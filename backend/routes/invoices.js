import express from 'express';
import pool, { withTransaction } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { invoiceValidation, validate } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

// Get all invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single invoice with line items
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoiceResult = await pool.query(
      'SELECT * FROM invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const itemsResult = await pool.query(
      'SELECT * FROM invoice_items WHERE invoice_id = $1',
      [id]
    );

    const invoice = invoiceResult.rows[0];
    invoice.lineItems = itemsResult.rows;

    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

// Generate invoice number (UAE format: INV-YYYY-MM-XXXX)
async function generateInvoiceNumber(client, userId) {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const result = await client.query(
    `SELECT invoice_number FROM invoices 
     WHERE user_id = $1 
     AND invoice_number LIKE $2
     ORDER BY invoice_number DESC 
     LIMIT 1`,
    [userId, `INV-${year}-${month}-%`]
  );

  let sequence = 1;
  if (result.rows.length > 0) {
    const parts = result.rows[0].invoice_number.split('-');
    sequence = parseInt(parts[3]) + 1;
  }

  return `INV-${year}-${month}-${String(sequence).padStart(4, '0')}`;
}

// Create invoice
router.post('/', invoiceValidation, validate, async (req, res, next) => {
  try {
    const {
      customerId,
      customerName,
      invoiceDate,
      dueDate,
      lineItems,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      status,
      notes,
    } = req.body;

    const result = await withTransaction(async (client) => {
      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber(client, req.user.userId);

      // Get company TRN
      const companySettings = await client.query('SELECT trn_number FROM company_settings LIMIT 1');
      const companyTrn = companySettings.rows[0]?.trn_number || null;

      // Get customer TRN
      const customerData = await client.query('SELECT trn_number FROM customers WHERE id = $1', [customerId]);
      const customerTrn = customerData.rows[0]?.trn_number || null;

      // Get VAT rate from company settings (default 5%)
      const vatRateResult = await client.query('SELECT vat_rate FROM company_settings LIMIT 1');
      const vatRate = vatRateResult.rows[0]?.vat_rate || 5.00;

      // Insert invoice
      const invoiceResult = await client.query(
        `INSERT INTO invoices 
         (user_id, customer_id, invoice_number, customer_name, invoice_date, due_date,
          subtotal, discount_percent, discount_amount, tax_percent, tax_amount, 
          grand_total, status, notes, company_trn, customer_trn, vat_rate)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING *`,
        [
          req.user.userId,
          customerId,
          invoiceNumber,
          customerName,
          invoiceDate,
          dueDate,
          subtotal,
          discountPercent,
          discountAmount,
          taxPercent,
          taxAmount,
          grandTotal,
          status,
          notes,
          companyTrn,
          customerTrn,
          vatRate,
        ]
      );

      const invoice = invoiceResult.rows[0];

      // Insert line items
      for (const item of lineItems) {
        await client.query(
          `INSERT INTO invoice_items 
           (invoice_id, description, quantity, rate, amount)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            invoice.id,
            item.description,
            item.quantity,
            item.rate,
            item.amount
          ]
        );
      }

      return invoice;
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Update invoice
router.put('/:id', invoiceValidation, validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      customerName,
      invoiceDate,
      dueDate,
      lineItems,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      status,
      notes,
    } = req.body;

    const result = await withTransaction(async (client) => {
      // Update invoice
      const invoiceResult = await client.query(
        `UPDATE invoices 
         SET customer_id = $1, customer_name = $2, invoice_date = $3, due_date = $4,
             subtotal = $5, discount_percent = $6, discount_amount = $7, 
             tax_percent = $8, tax_amount = $9, grand_total = $10, status = $11, notes = $12
         WHERE id = $13 AND user_id = $14
         RETURNING *`,
        [
          customerId,
          customerName,
          invoiceDate,
          dueDate,
          subtotal,
          discountPercent,
          discountAmount,
          taxPercent,
          taxAmount,
          grandTotal,
          status,
          notes,
          id,
          req.user.userId,
        ]
      );

      if (invoiceResult.rows.length === 0) {
        throw new Error('Invoice not found');
      }

      // Delete old line items
      await client.query('DELETE FROM invoice_items WHERE invoice_id = $1', [id]);

      // Insert new line items
      for (const item of lineItems) {
        await client.query(
          `INSERT INTO invoice_items 
           (invoice_id, description, quantity, rate, amount)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            id,
            item.description,
            item.quantity,
            item.rate,
            item.amount
          ]
        );
      }

      return invoiceResult.rows[0];
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Delete invoice (only drafts)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM invoices 
       WHERE id = $1 AND user_id = $2 AND status = 'draft' 
       RETURNING id`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found or cannot be deleted' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
