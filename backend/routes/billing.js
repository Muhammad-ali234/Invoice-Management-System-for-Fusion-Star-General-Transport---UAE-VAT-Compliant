import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { 
  processRecurringBilling, 
  triggerRecurringBillingManually,
  getContractsDueForBilling 
} from '../services/recurringBilling.js';
import { getCronJobStatus } from '../jobs/recurringBillingCron.js';

const router = express.Router();
router.use(authenticateToken);

/**
 * GET /api/billing/status
 * Get recurring billing cron job status
 */
router.get('/status', async (req, res, next) => {
  try {
    const status = getCronJobStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/billing/contracts-due
 * Get contracts that are due for billing today
 */
router.get('/contracts-due', async (req, res, next) => {
  try {
    const contracts = await getContractsDueForBilling();
    res.json({
      count: contracts.length,
      contracts: contracts.map(c => ({
        id: c.id,
        contract_number: c.contract_number,
        customer_name: c.customer_name,
        monthly_amount: c.monthly_amount,
        billing_day: c.billing_day,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/billing/process
 * Manually trigger recurring billing process
 * Useful for testing or manual runs
 */
router.post('/process', async (req, res, next) => {
  try {
    console.log(`\n🔧 Manual billing trigger by user ${req.user.userId}`);
    
    const result = await triggerRecurringBillingManually(req.user.userId);
    
    res.json({
      success: true,
      message: 'Recurring billing process completed',
      ...result,
    });
  } catch (error) {
    console.error('Error in manual billing trigger:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/billing/history
 * Get history of auto-generated invoices
 */
router.get('/history', async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    
    const result = await pool.query(
      `SELECT 
        i.id,
        i.invoice_number,
        i.invoice_date,
        i.grand_total,
        i.status,
        c.contract_number,
        cu.name as customer_name
      FROM invoices i
      LEFT JOIN contracts c ON i.contract_id = c.id
      LEFT JOIN customers cu ON i.customer_id = cu.id
      WHERE i.user_id = $1
      AND i.contract_id IS NOT NULL
      AND i.notes LIKE '%Auto-generated%'
      ORDER BY i.invoice_date DESC
      LIMIT $2`,
      [req.user.userId, limit]
    );
    
    res.json({
      count: result.rows.length,
      invoices: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
