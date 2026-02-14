import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(authenticateToken);

// Validation rules
const expenseValidation = [
  body('expense_date')
    .notEmpty()
    .withMessage('Expense date is required')
    .isISO8601()
    .withMessage('Expense date must be a valid date'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['fuel', 'salik', 'maintenance', 'salary', 'other'])
    .withMessage('Category must be fuel, salik, maintenance, salary, or other'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('truck_id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Truck ID must be a number'),
  body('driver_id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Driver ID must be a number'),
  body('description')
    .optional()
    .trim(),
  body('receipt_number')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Receipt number must be 50 characters or less'),
];

// Get all expenses with related data
router.get('/', async (req, res, next) => {
  try {
    const { category, truck_id, driver_id, start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        e.*,
        t.plate_number as truck_plate,
        t.truck_type,
        d.full_name as driver_name
      FROM expenses e
      LEFT JOIN trucks t ON e.truck_id = t.id
      LEFT JOIN drivers d ON e.driver_id = d.id
      WHERE e.user_id = $1
    `;
    
    const params = [req.user.userId];
    let paramIndex = 2;
    
    if (category) {
      query += ` AND e.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (truck_id) {
      query += ` AND e.truck_id = $${paramIndex}`;
      params.push(truck_id);
      paramIndex++;
    }
    
    if (driver_id) {
      query += ` AND e.driver_id = $${paramIndex}`;
      params.push(driver_id);
      paramIndex++;
    }
    
    if (start_date) {
      query += ` AND e.expense_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND e.expense_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ' ORDER BY e.expense_date DESC, e.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single expense
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        e.*,
        t.plate_number as truck_plate,
        t.truck_type,
        d.full_name as driver_name
      FROM expenses e
      LEFT JOIN trucks t ON e.truck_id = t.id
      LEFT JOIN drivers d ON e.driver_id = d.id
      WHERE e.id = $1 AND e.user_id = $2`,
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get expense summary by category
router.get('/summary/by-category', async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total
      FROM expenses
      WHERE user_id = $1
    `;
    
    const params = [req.user.userId];
    let paramIndex = 2;
    
    if (start_date) {
      query += ` AND expense_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND expense_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ' GROUP BY category ORDER BY total DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get expense summary by truck
router.get('/summary/by-truck', async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        e.truck_id,
        t.plate_number,
        t.truck_type,
        COUNT(*) as count,
        SUM(e.amount) as total
      FROM expenses e
      LEFT JOIN trucks t ON e.truck_id = t.id
      WHERE e.user_id = $1 AND e.truck_id IS NOT NULL
    `;
    
    const params = [req.user.userId];
    let paramIndex = 2;
    
    if (start_date) {
      query += ` AND e.expense_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND e.expense_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ' GROUP BY e.truck_id, t.plate_number, t.truck_type ORDER BY total DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create expense
router.post('/', expenseValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      expense_date,
      category,
      truck_id,
      driver_id,
      amount,
      description,
      receipt_number,
    } = req.body;
    
    // Verify truck belongs to user (if provided)
    if (truck_id) {
      const truckCheck = await pool.query(
        'SELECT id FROM trucks WHERE id = $1 AND user_id = $2',
        [truck_id, req.user.userId]
      );
      
      if (truckCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Truck not found' });
      }
    }
    
    // Verify driver belongs to user (if provided)
    if (driver_id) {
      const driverCheck = await pool.query(
        'SELECT id FROM drivers WHERE id = $1 AND user_id = $2',
        [driver_id, req.user.userId]
      );
      
      if (driverCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Driver not found' });
      }
    }
    
    const result = await pool.query(
      `INSERT INTO expenses 
       (user_id, expense_date, category, truck_id, driver_id, amount, description, receipt_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.userId,
        expense_date,
        category,
        truck_id || null,
        driver_id || null,
        amount,
        description || null,
        receipt_number || null,
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update expense
router.put('/:id', expenseValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const {
      expense_date,
      category,
      truck_id,
      driver_id,
      amount,
      description,
      receipt_number,
    } = req.body;
    
    // Check if expense exists and belongs to user
    const existing = await pool.query(
      'SELECT id FROM expenses WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    const result = await pool.query(
      `UPDATE expenses 
       SET expense_date = $1, category = $2, truck_id = $3, driver_id = $4,
           amount = $5, description = $6, receipt_number = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        expense_date,
        category,
        truck_id || null,
        driver_id || null,
        amount,
        description,
        receipt_number,
        id,
        req.user.userId,
      ]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete expense
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
