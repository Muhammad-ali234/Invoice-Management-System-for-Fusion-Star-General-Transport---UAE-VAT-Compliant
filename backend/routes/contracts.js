import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(authenticateToken);

// Validation rules
const contractValidation = [
  body('customer_id')
    .notEmpty()
    .withMessage('Customer is required')
    .isInt()
    .withMessage('Customer ID must be a number'),
  body('truck_id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Truck ID must be a number'),
  body('driver_id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Driver ID must be a number'),
  body('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('end_date')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('monthly_amount')
    .notEmpty()
    .withMessage('Monthly amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Monthly amount must be greater than 0'),
  body('billing_day')
    .optional()
    .isInt({ min: 1, max: 28 })
    .withMessage('Billing day must be between 1 and 28'),
  body('status')
    .optional()
    .isIn(['active', 'expired', 'cancelled'])
    .withMessage('Status must be active, expired, or cancelled'),
  body('notes')
    .optional()
    .trim(),
];

// Get all contracts with related data
router.get('/', async (req, res, next) => {
  try {
    const { status, customer_id } = req.query;
    
    let query = `
      SELECT 
        c.*,
        cu.name as customer_name,
        cu.email as customer_email,
        t.plate_number as truck_plate,
        t.truck_type,
        d.full_name as driver_name,
        d.phone as driver_phone
      FROM contracts c
      LEFT JOIN customers cu ON c.customer_id = cu.id
      LEFT JOIN trucks t ON c.truck_id = t.id
      LEFT JOIN drivers d ON c.driver_id = d.id
      WHERE c.user_id = $1
    `;
    
    const params = [req.user.userId];
    let paramIndex = 2;
    
    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (customer_id) {
      query += ` AND c.customer_id = $${paramIndex}`;
      params.push(customer_id);
      paramIndex++;
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single contract with full details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        c.*,
        cu.name as customer_name,
        cu.email as customer_email,
        cu.phone as customer_phone,
        cu.address as customer_address,
        t.plate_number as truck_plate,
        t.truck_type,
        t.status as truck_status,
        d.full_name as driver_name,
        d.phone as driver_phone,
        d.license_number as driver_license
      FROM contracts c
      LEFT JOIN customers cu ON c.customer_id = cu.id
      LEFT JOIN trucks t ON c.truck_id = t.id
      LEFT JOIN drivers d ON c.driver_id = d.id
      WHERE c.id = $1 AND c.user_id = $2`,
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get contracts expiring soon (within 30 days)
router.get('/filter/expiring-soon', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        c.*,
        cu.name as customer_name,
        t.plate_number as truck_plate
      FROM contracts c
      LEFT JOIN customers cu ON c.customer_id = cu.id
      LEFT JOIN trucks t ON c.truck_id = t.id
      WHERE c.user_id = $1 
      AND c.status = 'active'
      AND c.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      ORDER BY c.end_date ASC`,
      [req.user.userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create contract
router.post('/', contractValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      customer_id,
      truck_id,
      driver_id,
      start_date,
      end_date,
      monthly_amount,
      billing_day,
      notes,
    } = req.body;
    
    // Validate dates
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ 
        error: 'End date must be after start date' 
      });
    }
    
    // Verify customer belongs to user
    const customerCheck = await pool.query(
      'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
      [customer_id, req.user.userId]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Verify truck belongs to user and is available (if provided)
    if (truck_id) {
      const truckCheck = await pool.query(
        'SELECT id, status FROM trucks WHERE id = $1 AND user_id = $2',
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
    
    // Generate contract number
    const contractNumberResult = await pool.query(
      'SELECT generate_contract_number($1) as contract_number',
      [req.user.userId]
    );
    const contract_number = contractNumberResult.rows[0].contract_number;
    
    // Create contract
    const result = await pool.query(
      `INSERT INTO contracts 
       (user_id, contract_number, customer_id, truck_id, driver_id, 
        start_date, end_date, monthly_amount, billing_day, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
       RETURNING *`,
      [
        req.user.userId,
        contract_number,
        customer_id,
        truck_id || null,
        driver_id || null,
        start_date,
        end_date,
        monthly_amount,
        billing_day || 1,
        notes || null,
      ]
    );
    
    // Update truck status to rented if truck is assigned
    if (truck_id) {
      await pool.query(
        'UPDATE trucks SET status = $1 WHERE id = $2',
        ['rented', truck_id]
      );
    }
    
    // Update driver status to assigned if driver is assigned
    if (driver_id) {
      await pool.query(
        'UPDATE drivers SET status = $1 WHERE id = $2',
        ['assigned', driver_id]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update contract
router.put('/:id', contractValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const {
      customer_id,
      truck_id,
      driver_id,
      start_date,
      end_date,
      monthly_amount,
      billing_day,
      status,
      notes,
    } = req.body;
    
    // Validate dates
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ 
        error: 'End date must be after start date' 
      });
    }
    
    // Get existing contract
    const existing = await pool.query(
      'SELECT * FROM contracts WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    const oldContract = existing.rows[0];
    
    // Update truck statuses if truck changed
    if (oldContract.truck_id !== truck_id) {
      // Set old truck to available
      if (oldContract.truck_id) {
        await pool.query(
          'UPDATE trucks SET status = $1 WHERE id = $2',
          ['available', oldContract.truck_id]
        );
      }
      // Set new truck to rented
      if (truck_id) {
        await pool.query(
          'UPDATE trucks SET status = $1 WHERE id = $2',
          ['rented', truck_id]
        );
      }
    }
    
    // Update driver statuses if driver changed
    if (oldContract.driver_id !== driver_id) {
      // Set old driver to available
      if (oldContract.driver_id) {
        await pool.query(
          'UPDATE drivers SET status = $1 WHERE id = $2',
          ['available', oldContract.driver_id]
        );
      }
      // Set new driver to assigned
      if (driver_id) {
        await pool.query(
          'UPDATE drivers SET status = $1 WHERE id = $2',
          ['assigned', driver_id]
        );
      }
    }
    
    // If contract is being cancelled or expired, free up resources
    if (status && status !== 'active' && oldContract.status === 'active') {
      if (oldContract.truck_id) {
        await pool.query(
          'UPDATE trucks SET status = $1 WHERE id = $2',
          ['available', oldContract.truck_id]
        );
      }
      if (oldContract.driver_id) {
        await pool.query(
          'UPDATE drivers SET status = $1 WHERE id = $2',
          ['available', oldContract.driver_id]
        );
      }
    }
    
    // Update contract
    const result = await pool.query(
      `UPDATE contracts 
       SET customer_id = $1, truck_id = $2, driver_id = $3,
           start_date = $4, end_date = $5, monthly_amount = $6,
           billing_day = $7, status = $8, notes = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [
        customer_id,
        truck_id || null,
        driver_id || null,
        start_date,
        end_date,
        monthly_amount,
        billing_day,
        status || oldContract.status,
        notes,
        id,
        req.user.userId,
      ]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete contract
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get contract details
    const contract = await pool.query(
      'SELECT * FROM contracts WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    if (contract.rows.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    const contractData = contract.rows[0];
    
    // Check if contract has invoices
    const invoiceCheck = await pool.query(
      'SELECT id FROM invoices WHERE contract_id = $1 LIMIT 1',
      [id]
    );
    
    if (invoiceCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete contract with existing invoices. Cancel it instead.' 
      });
    }
    
    // Free up truck and driver
    if (contractData.truck_id) {
      await pool.query(
        'UPDATE trucks SET status = $1 WHERE id = $2',
        ['available', contractData.truck_id]
      );
    }
    
    if (contractData.driver_id) {
      await pool.query(
        'UPDATE drivers SET status = $1 WHERE id = $2',
        ['available', contractData.driver_id]
      );
    }
    
    // Delete contract
    await pool.query(
      'DELETE FROM contracts WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    res.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Update expired contracts (utility endpoint)
router.post('/update-status', async (req, res, next) => {
  try {
    await pool.query('SELECT update_contract_status()');
    res.json({ success: true, message: 'Contract statuses updated' });
  } catch (error) {
    next(error);
  }
});

export default router;
