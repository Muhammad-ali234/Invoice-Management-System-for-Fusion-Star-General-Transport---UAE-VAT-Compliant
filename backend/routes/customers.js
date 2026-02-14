import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { customerValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all customers
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE user_id = $1 ORDER BY name ASC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create customer
router.post('/', customerValidation, validate, async (req, res, next) => {
  try {
    const { name, email, phone, company, tax_id, address, city, country } = req.body;

    const result = await pool.query(
      `INSERT INTO customers 
       (user_id, name, email, phone, company, tax_id, address, city, country) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [req.user.userId, name, email, phone, company, tax_id, address, city, country]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update customer
router.put('/:id', customerValidation, validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, tax_id, address, city, country } = req.body;

    const result = await pool.query(
      `UPDATE customers 
       SET name = $1, email = $2, phone = $3, company = $4, 
           tax_id = $5, address = $6, city = $7, country = $8
       WHERE id = $9 AND user_id = $10 
       RETURNING *`,
      [name, email, phone, company, tax_id, address, city, country, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete customer
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
