import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(authenticateToken);

// Validation rules
const truckValidation = [
  body('plate_number')
    .trim()
    .notEmpty()
    .withMessage('Plate number is required')
    .isLength({ max: 20 })
    .withMessage('Plate number must be 20 characters or less'),
  body('truck_type')
    .trim()
    .notEmpty()
    .withMessage('Truck type is required'),
  body('status')
    .optional()
    .isIn(['available', 'rented', 'maintenance'])
    .withMessage('Status must be available, rented, or maintenance'),
  body('monthly_rate')
    .isFloat({ min: 0 })
    .withMessage('Monthly rate must be a positive number'),
  body('notes')
    .optional()
    .trim(),
];

// Get all trucks
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM trucks WHERE user_id = $1';
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

// Get single truck
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM trucks WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Truck not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get available trucks only
router.get('/filter/available', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM trucks 
       WHERE user_id = $1 AND status = 'available'
       ORDER BY plate_number`,
      [req.user.userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create truck
router.post('/', truckValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { plate_number, truck_type, status, monthly_rate, notes } = req.body;
    
    // Check if plate number already exists
    const existing = await pool.query(
      'SELECT id FROM trucks WHERE plate_number = $1',
      [plate_number]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Plate number already exists' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO trucks 
       (user_id, plate_number, truck_type, status, monthly_rate, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.userId,
        plate_number,
        truck_type,
        status || 'available',
        monthly_rate,
        notes || null,
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update truck
router.put('/:id', truckValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { plate_number, truck_type, status, monthly_rate, notes } = req.body;
    
    // Check if truck exists and belongs to user
    const existing = await pool.query(
      'SELECT id FROM trucks WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Truck not found' });
    }
    
    // Check if plate number is taken by another truck
    const duplicate = await pool.query(
      'SELECT id FROM trucks WHERE plate_number = $1 AND id != $2',
      [plate_number, id]
    );
    
    if (duplicate.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Plate number already exists' 
      });
    }
    
    const result = await pool.query(
      `UPDATE trucks 
       SET plate_number = $1, truck_type = $2, status = $3, 
           monthly_rate = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [plate_number, truck_type, status, monthly_rate, notes, id, req.user.userId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete truck
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if truck is assigned to any active contract
    const contractCheck = await pool.query(
      `SELECT id FROM contracts 
       WHERE truck_id = $1 AND status = 'active'
       LIMIT 1`,
      [id]
    );
    
    if (contractCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete truck assigned to an active contract' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM trucks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Truck not found' });
    }
    
    res.json({ success: true, message: 'Truck deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
