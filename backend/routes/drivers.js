import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(authenticateToken);

// Validation rules
const driverValidation = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name must be 100 characters or less'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ max: 20 })
    .withMessage('Phone number must be 20 characters or less'),
  body('license_number')
    .trim()
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ max: 50 })
    .withMessage('License number must be 50 characters or less'),
  body('license_expiry')
    .notEmpty()
    .withMessage('License expiry date is required')
    .isISO8601()
    .withMessage('License expiry must be a valid date'),
  body('status')
    .optional()
    .isIn(['available', 'assigned', 'on_leave'])
    .withMessage('Status must be available, assigned, or on_leave'),
  body('notes')
    .optional()
    .trim(),
];

// Get all drivers
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM drivers WHERE user_id = $1';
    const params = [req.user.userId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single driver
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM drivers WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get available drivers only
router.get('/filter/available', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM drivers 
       WHERE user_id = $1 AND status = 'available'
       ORDER BY full_name`,
      [req.user.userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create driver
router.post('/', driverValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { full_name, phone, license_number, license_expiry, status, notes } = req.body;
    
    // Check if license is expired
    const expiryDate = new Date(license_expiry);
    const today = new Date();
    if (expiryDate < today) {
      return res.status(400).json({ 
        error: 'License expiry date cannot be in the past' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO drivers 
       (user_id, full_name, phone, license_number, license_expiry, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.userId,
        full_name,
        phone,
        license_number,
        license_expiry,
        status || 'available',
        notes || null,
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update driver
router.put('/:id', driverValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { full_name, phone, license_number, license_expiry, status, notes } = req.body;
    
    // Check if driver exists and belongs to user
    const existing = await pool.query(
      'SELECT id FROM drivers WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const result = await pool.query(
      `UPDATE drivers 
       SET full_name = $1, phone = $2, license_number = $3, 
           license_expiry = $4, status = $5, notes = $6, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [full_name, phone, license_number, license_expiry, status, notes, id, req.user.userId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete driver
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if driver is assigned to any active contract
    const contractCheck = await pool.query(
      `SELECT id FROM contracts 
       WHERE driver_id = $1 AND status = 'active'
       LIMIT 1`,
      [id]
    );
    
    if (contractCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete driver assigned to an active contract' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM drivers WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
