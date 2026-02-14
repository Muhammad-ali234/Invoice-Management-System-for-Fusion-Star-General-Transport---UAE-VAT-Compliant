import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
router.use(authenticateToken);

// Get company settings
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM company_settings LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company settings not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update company settings
router.put('/', [
  body('company_name').trim().notEmpty().withMessage('Company name is required'),
  body('trn_number').trim().matches(/^\d{15}$/).withMessage('TRN must be 15 digits'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company_name,
      company_name_arabic,
      trn_number,
      address,
      phone,
      email,
      website,
      vat_rate,
    } = req.body;

    const result = await pool.query(
      `UPDATE company_settings 
       SET company_name = $1,
           company_name_arabic = $2,
           trn_number = $3,
           address = $4,
           phone = $5,
           email = $6,
           website = $7,
           vat_rate = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING *`,
      [
        company_name,
        company_name_arabic,
        trn_number,
        address,
        phone,
        email,
        website,
        vat_rate || 5.00,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company settings not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
