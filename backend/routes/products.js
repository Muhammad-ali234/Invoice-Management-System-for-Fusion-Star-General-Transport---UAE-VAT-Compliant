import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(authenticateToken);

// Validation middleware
const validateProduct = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('taxPercent').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax percent must be between 0 and 100'),
];

const validateCategory = [
    body('name').trim().notEmpty().withMessage('Category name is required'),
];

const validateUnit = [
    body('name').trim().notEmpty().withMessage('Unit name is required'),
];

// ==================== PRODUCTS ====================

// Get all products
router.get('/', async (req, res, next) => {
    try {
        const { category, active, search } = req.query;

        let query = `
      SELECT p.*, 
             pc.name as category_name,
             u.name as unit_name,
             u.abbreviation as unit_abbreviation
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN units u ON p.unit_id = u.id
      WHERE p.user_id = $1
    `;

        const params = [req.user.userId];
        let paramCount = 1;

        if (category) {
            paramCount++;
            query += ` AND p.category_id = $${paramCount}`;
            params.push(category);
        }

        if (active !== undefined) {
            paramCount++;
            query += ` AND p.is_active = $${paramCount}`;
            params.push(active === 'true');
        }

        if (search) {
            paramCount++;
            query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ' ORDER BY p.name ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Get single product
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT p.*, 
              pc.name as category_name,
              u.name as unit_name,
              u.abbreviation as unit_abbreviation
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN units u ON p.unit_id = u.id
       WHERE p.id = $1 AND p.user_id = $2`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Create product
router.post('/', validateProduct, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, price, categoryId, unitId, taxPercent, isActive } = req.body;

        const result = await pool.query(
            `INSERT INTO products 
       (user_id, name, description, price, category_id, unit_id, tax_percent, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [req.user.userId, name, description || null, price, categoryId || null, unitId || null, taxPercent || 0, isActive !== false]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update product
router.put('/:id', validateProduct, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, description, price, categoryId, unitId, taxPercent, isActive } = req.body;

        const result = await pool.query(
            `UPDATE products 
       SET name = $1, description = $2, price = $3, category_id = $4, 
           unit_id = $5, tax_percent = $6, is_active = $7
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
            [name, description || null, price, categoryId || null, unitId || null, taxPercent || 0, isActive !== false, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete product
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

// Toggle product active status
router.patch('/:id/toggle', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE products 
       SET is_active = NOT is_active
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// ==================== CATEGORIES ====================

// Get all categories
router.get('/categories/all', async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM product_categories WHERE user_id = $1 ORDER BY name ASC',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Create category
router.post('/categories', validateCategory, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;

        const result = await pool.query(
            'INSERT INTO product_categories (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [req.user.userId, name, description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update category
router.put('/categories/:id', validateCategory, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, description } = req.body;

        const result = await pool.query(
            'UPDATE product_categories SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [name, description || null, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete category
router.delete('/categories/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM product_categories WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

// ==================== UNITS ====================

// Get all units
router.get('/units/all', async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM units WHERE user_id = $1 ORDER BY name ASC',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Create unit
router.post('/units', validateUnit, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, abbreviation } = req.body;

        const result = await pool.query(
            'INSERT INTO units (user_id, name, abbreviation) VALUES ($1, $2, $3) RETURNING *',
            [req.user.userId, name, abbreviation || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update unit
router.put('/units/:id', validateUnit, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, abbreviation } = req.body;

        const result = await pool.query(
            'UPDATE units SET name = $1, abbreviation = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [name, abbreviation || null, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete unit
router.delete('/units/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM units WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit not found' });
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;
