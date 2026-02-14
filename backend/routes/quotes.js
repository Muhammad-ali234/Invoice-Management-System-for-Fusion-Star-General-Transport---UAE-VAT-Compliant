import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateQuote } from '../middleware/validation.js';

const router = express.Router();

// Get all quotes for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, customer_id } = req.query;
    
    let query = `
      SELECT q.*, c.name as customer_name
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.user_id = $1
    `;
    const params = [req.user.userId];
    
    if (status) {
      query += ` AND q.status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (customer_id) {
      query += ` AND q.customer_id = $${params.length + 1}`;
      params.push(customer_id);
    }
    
    query += ' ORDER BY q.created_at DESC';
    
    const result = await pool.query(query, params);
    
    // Get line items for each quote
    for (const quote of result.rows) {
      const itemsResult = await pool.query(
        'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY id',
        [quote.id]
      );
      quote.lineItems = itemsResult.rows;
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Get single quote by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.*, c.name as customer_name, c.email, c.phone, c.address
       FROM quotes q
       LEFT JOIN customers c ON q.customer_id = c.id
       WHERE q.id = $1 AND q.user_id = $2`,
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    const quote = result.rows[0];
    
    // Get line items
    const itemsResult = await pool.query(
      'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY id',
      [quote.id]
    );
    quote.lineItems = itemsResult.rows;
    
    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Create new quote
router.post('/', authenticateToken, validateQuote, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      customerId,
      customerName,
      quoteDate,
      expiryDate,
      lineItems,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      status,
      notes
    } = req.body;
    
    // Generate quote number
    const quoteNumberResult = await client.query(
      'SELECT generate_quote_number($1) as quote_number',
      [req.user.userId]
    );
    const quoteNumber = quoteNumberResult.rows[0].quote_number;
    
    // Insert quote
    const quoteResult = await client.query(
      `INSERT INTO quotes (
        user_id, quote_number, customer_id, customer_name,
        quote_date, expiry_date, subtotal, discount_percent, discount_amount,
        tax_percent, tax_amount, grand_total, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        req.user.userId, quoteNumber, customerId, customerName,
        quoteDate, expiryDate, subtotal, discountPercent, discountAmount,
        taxPercent, taxAmount, grandTotal, status || 'draft', notes
      ]
    );
    
    const quote = quoteResult.rows[0];
    
    // Insert line items
    for (const item of lineItems) {
      await client.query(
        `INSERT INTO quote_items (
          quote_id, product_id, description, quantity, rate, amount, tax_percent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          quote.id,
          item.productId || null,
          item.description,
          item.quantity,
          item.rate,
          item.amount,
          item.taxPercent || 0
        ]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json(quote);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating quote:', error);
    res.status(400).json({ error: 'Failed to create quote' });
  } finally {
    client.release();
  }
});

// Update quote
router.put('/:id', authenticateToken, validateQuote, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      customerId,
      customerName,
      quoteDate,
      expiryDate,
      lineItems,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      status,
      notes
    } = req.body;
    
    // Update quote
    const result = await client.query(
      `UPDATE quotes SET
        customer_id = $1, customer_name = $2, quote_date = $3, expiry_date = $4,
        subtotal = $5, discount_percent = $6, discount_amount = $7,
        tax_percent = $8, tax_amount = $9, grand_total = $10,
        status = $11, notes = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13 AND user_id = $14
      RETURNING *`,
      [
        customerId, customerName, quoteDate, expiryDate,
        subtotal, discountPercent, discountAmount,
        taxPercent, taxAmount, grandTotal,
        status, notes, req.params.id, req.user.userId
      ]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    // Delete existing line items
    await client.query('DELETE FROM quote_items WHERE quote_id = $1', [req.params.id]);
    
    // Insert new line items
    for (const item of lineItems) {
      await client.query(
        `INSERT INTO quote_items (
          quote_id, product_id, description, quantity, rate, amount, tax_percent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          req.params.id,
          item.productId || null,
          item.description,
          item.quantity,
          item.rate,
          item.amount,
          item.taxPercent || 0
        ]
      );
    }
    
    await client.query('COMMIT');
    
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating quote:', error);
    res.status(400).json({ error: 'Failed to update quote' });
  } finally {
    client.release();
  }
});

// Delete quote
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM quotes WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// Update quote status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const result = await pool.query(
      `UPDATE quotes SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(400).json({ error: 'Failed to update quote status' });
  }
});

// Convert quote to invoice
router.post('/:id/convert', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get quote
    const quoteResult = await client.query(
      'SELECT * FROM quotes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (quoteResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    const quote = quoteResult.rows[0];
    
    // Check if already converted
    if (quote.status === 'converted') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Quote already converted to invoice' });
    }
    
    // Get quote items
    const itemsResult = await client.query(
      'SELECT * FROM quote_items WHERE quote_id = $1',
      [quote.id]
    );
    
    // Generate invoice number
    const invoiceNumberResult = await client.query(
      'SELECT generate_invoice_number($1) as invoice_number',
      [req.user.userId]
    );
    const invoiceNumber = invoiceNumberResult.rows[0].invoice_number;
    
    // Create invoice from quote
    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        user_id, invoice_number, customer_id, customer_name,
        invoice_date, due_date, subtotal, discount_percent, discount_amount,
        tax_percent, tax_amount, grand_total, status, notes
      ) VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', $5, $6, $7, $8, $9, $10, 'draft', $11)
      RETURNING *`,
      [
        req.user.userId, invoiceNumber, quote.customer_id, quote.customer_name,
        quote.subtotal, quote.discount_percent, quote.discount_amount,
        quote.tax_percent, quote.tax_amount, quote.grand_total, quote.notes
      ]
    );
    
    const invoice = invoiceResult.rows[0];
    
    // Copy line items
    for (const item of itemsResult.rows) {
      await client.query(
        `INSERT INTO invoice_items (
          invoice_id, product_id, description, quantity, rate, amount, tax_percent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          invoice.id, item.product_id, item.description,
          item.quantity, item.rate, item.amount, item.tax_percent
        ]
      );
    }
    
    // Update quote status to converted
    await client.query(
      'UPDATE quotes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['converted', quote.id]
    );
    
    await client.query('COMMIT');
    
    res.json({ invoice, message: 'Quote converted to invoice successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error converting quote:', error);
    res.status(500).json({ error: 'Failed to convert quote to invoice' });
  } finally {
    client.release();
  }
});

export default router;
