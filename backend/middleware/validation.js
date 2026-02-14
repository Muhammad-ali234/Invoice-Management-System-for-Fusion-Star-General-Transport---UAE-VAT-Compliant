import { body, validationResult } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
}

// Auth validation rules
export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Customer validation rules
export const customerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
];

// Invoice validation rules
export const invoiceValidation = [
  body('customerId').isInt().withMessage('Valid customer ID required'),
  body('invoiceDate').isISO8601().withMessage('Valid invoice date required'),
  body('dueDate').isISO8601().withMessage('Valid due date required'),
  body('lineItems').isArray({ min: 1 }).withMessage('At least one line item required'),
  body('lineItems.*.description').notEmpty(),
  body('lineItems.*.quantity').isFloat({ min: 0.01 }),
  body('lineItems.*.rate').isFloat({ min: 0 }),
];

// Payment validation rules
export const paymentValidation = [
  body('invoiceId').isInt().withMessage('Valid invoice ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
  body('paymentDate').isISO8601().withMessage('Valid payment date required'),
  body('paymentMethod').isIn(['cash', 'bank_transfer', 'other']),
];

// Quote validation rules
export const quoteValidation = [
  body('customerId').isInt().withMessage('Valid customer ID required'),
  body('quoteDate').isISO8601().withMessage('Valid quote date required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date required'),
  body('lineItems').isArray({ min: 1 }).withMessage('At least one line item required'),
  body('lineItems.*.description').notEmpty(),
  body('lineItems.*.quantity').isFloat({ min: 0.01 }),
  body('lineItems.*.rate').isFloat({ min: 0 }),
];

// Simple validation function for quotes
export function validateQuote(req, res, next) {
  const { customerId, customerName, quoteDate, expiryDate, lineItems, grandTotal } = req.body;

  if (!customerId || !customerName || !quoteDate || !expiryDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    return res.status(400).json({ error: 'At least one line item is required' });
  }

  if (grandTotal < 0) {
    return res.status(400).json({ error: 'Invalid total amount' });
  }

  next();
}
