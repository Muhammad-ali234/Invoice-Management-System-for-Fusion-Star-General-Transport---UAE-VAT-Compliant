import express from 'express';
import pool, { withTransaction } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { paymentValidation, validate } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

// Calculate and update invoice status based on payments
async function updateInvoiceStatus(client, invoiceId, userId) {
  const invoiceResult = await client.query(
    'SELECT grand_total, status FROM invoices WHERE id = $1 AND user_id = $2',
    [invoiceId, userId]
  );

  if (invoiceResult.rows.length === 0) return;

  const invoice = invoiceResult.rows[0];

  const paymentsResult = await client.query(
    'SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE invoice_id = $1',
    [invoiceId]
  );

  const totalPaid = parseFloat(paymentsResult.rows[0].total_paid);
  const grandTotal = parseFloat(invoice.grand_total);

  let newStatus = invoice.status;
  if (totalPaid === 0 && invoice.status !== 'draft') {
    newStatus = 'sent';
  } else if (totalPaid > 0 && totalPaid < grandTotal) {
    newStatus = 'partially_paid';
  } else if (totalPaid >= grandTotal) {
    newStatus = 'paid';
  }

  await client.query(
    'UPDATE invoices SET status = $1 WHERE id = $2',
    [newStatus, invoiceId]
  );
}

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    const { invoiceId } = req.query;
    let query = 'SELECT * FROM payments WHERE user_id = $1';
    const params = [req.user.userId];

    if (invoiceId) {
      query += ' AND invoice_id = $2';
      params.push(invoiceId);
    }

    query += ' ORDER BY payment_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create payment
router.post('/', paymentValidation, validate, async (req, res, next) => {
  try {
    const { invoiceId, invoiceNumber, amount, paymentDate, paymentMethod, notes } = req.body;

    const result = await withTransaction(async (client) => {
      // Insert payment
      const paymentResult = await client.query(
        `INSERT INTO payments 
         (user_id, invoice_id, invoice_number, amount, payment_date, payment_method, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [req.user.userId, invoiceId, invoiceNumber, amount, paymentDate, paymentMethod, notes]
      );

      // Update invoice status
      await updateInvoiceStatus(client, invoiceId, req.user.userId);

      return paymentResult.rows[0];
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Delete payment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { invoiceId } = req.query;

    if (!invoiceId) {
      return res.status(400).json({ error: 'Invoice ID required' });
    }

    await withTransaction(async (client) => {
      const result = await client.query(
        'DELETE FROM payments WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, req.user.userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Payment not found');
      }

      // Update invoice status
      await updateInvoiceStatus(client, invoiceId, req.user.userId);
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
