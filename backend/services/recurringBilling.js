import pool from '../config/database.js';

/**
 * Recurring Billing Service
 * Handles automatic invoice generation from active contracts
 */

/**
 * Generate invoice number
 * Format: INV-YYYY-MM-XXXX
 */
async function generateInvoiceNumber(userId) {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const result = await pool.query(
    `SELECT invoice_number FROM invoices 
     WHERE user_id = $1 
     AND invoice_number LIKE $2
     ORDER BY invoice_number DESC LIMIT 1`,
    [userId, `INV-${year}-${month}-%`]
  );
  
  let sequence = 1;
  if (result.rows.length > 0) {
    const parts = result.rows[0].invoice_number.split('-');
    sequence = parseInt(parts[3]) + 1;
  }
  
  return `INV-${year}-${month}-${String(sequence).padStart(4, '0')}`;
}

/**
 * Get contracts that need billing today
 * Returns contracts where billing_day matches today's date
 */
export async function getContractsDueForBilling() {
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  try {
    const result = await pool.query(
      `SELECT 
        c.*,
        cu.name as customer_name,
        cu.email as customer_email,
        cu.address as customer_address,
        cu.trn_number as customer_trn,
        t.plate_number as truck_plate,
        t.truck_type,
        d.full_name as driver_name
      FROM contracts c
      LEFT JOIN customers cu ON c.customer_id = cu.id
      LEFT JOIN trucks t ON c.truck_id = t.id
      LEFT JOIN drivers d ON c.driver_id = d.id
      WHERE c.status = 'active'
      AND c.billing_day = $1
      AND c.start_date <= CURRENT_DATE
      AND c.end_date >= CURRENT_DATE`,
      [dayOfMonth]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching contracts due for billing:', error);
    throw error;
  }
}

/**
 * Check if invoice already exists for contract this month
 */
async function invoiceExistsForContractThisMonth(contractId) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  
  const result = await pool.query(
    `SELECT id FROM invoices 
     WHERE contract_id = $1
     AND EXTRACT(YEAR FROM invoice_date) = $2
     AND EXTRACT(MONTH FROM invoice_date) = $3`,
    [contractId, year, month]
  );
  
  return result.rows.length > 0;
}

/**
 * Generate invoice from contract
 */
async function generateInvoiceFromContract(contract) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if invoice already exists for this month
    const exists = await invoiceExistsForContractThisMonth(contract.id);
    if (exists) {
      console.log(`Invoice already exists for contract ${contract.contract_number} this month`);
      await client.query('ROLLBACK');
      return { skipped: true, reason: 'Invoice already exists for this month' };
    }
    
    // Get company settings for VAT
    const settingsResult = await client.query(
      'SELECT trn_number, vat_rate FROM company_settings WHERE id = 1'
    );
    const settings = settingsResult.rows[0] || { vat_rate: 5.00 };
    
    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(contract.user_id);
    
    // Calculate dates
    const invoiceDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15); // Net 15 days
    
    // Calculate amounts
    const subtotal = parseFloat(contract.monthly_amount);
    const vatRate = parseFloat(settings.vat_rate || 5.00);
    const vatAmount = subtotal * (vatRate / 100);
    const grandTotal = subtotal + vatAmount;
    
    // Create line item description
    const lineItemDescription = [];
    if (contract.truck_plate) {
      lineItemDescription.push(`Truck: ${contract.truck_plate} (${contract.truck_type})`);
    }
    if (contract.driver_name) {
      lineItemDescription.push(`Driver: ${contract.driver_name}`);
    }
    const description = lineItemDescription.length > 0 
      ? `Monthly Rental - ${lineItemDescription.join(', ')}`
      : 'Monthly Rental Service';
    
    // Create line items array
    const lineItems = [{
      description: description,
      quantity: 1,
      rate: subtotal,
      amount: subtotal,
    }];
    
    // Insert invoice
    const invoiceResult = await client.query(
      `INSERT INTO invoices 
       (user_id, invoice_number, customer_id, contract_id, invoice_date, due_date,
        line_items, subtotal, discount_percent, discount_amount, 
        tax_percent, tax_amount, grand_total, status, notes,
        company_trn, customer_trn)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        contract.user_id,
        invoiceNumber,
        contract.customer_id,
        contract.id,
        invoiceDate,
        dueDate,
        JSON.stringify(lineItems),
        subtotal,
        0, // discount_percent
        0, // discount_amount
        vatRate,
        vatAmount,
        grandTotal,
        'sent', // Auto-mark as sent
        `Auto-generated from contract ${contract.contract_number}`,
        settings.trn_number || null,
        contract.customer_trn || null,
      ]
    );
    
    await client.query('COMMIT');
    
    console.log(`✅ Generated invoice ${invoiceNumber} for contract ${contract.contract_number}`);
    
    return {
      success: true,
      invoice: invoiceResult.rows[0],
      contract: contract,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error generating invoice for contract ${contract.contract_number}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Process all contracts due for billing
 * Main function to be called by cron job
 */
export async function processRecurringBilling() {
  console.log('\n🔄 Starting recurring billing process...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  try {
    // Get contracts due for billing
    const contracts = await getContractsDueForBilling();
    console.log(`📋 Found ${contracts.length} contract(s) due for billing today`);
    
    if (contracts.length === 0) {
      console.log('✅ No contracts to process');
      return {
        success: true,
        processed: 0,
        skipped: 0,
        failed: 0,
        results: [],
      };
    }
    
    // Process each contract
    const results = [];
    let processed = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const contract of contracts) {
      try {
        console.log(`\n📝 Processing contract ${contract.contract_number}...`);
        const result = await generateInvoiceFromContract(contract);
        
        if (result.skipped) {
          skipped++;
          results.push({
            contract_number: contract.contract_number,
            status: 'skipped',
            reason: result.reason,
          });
        } else {
          processed++;
          results.push({
            contract_number: contract.contract_number,
            invoice_number: result.invoice.invoice_number,
            status: 'success',
            amount: result.invoice.grand_total,
          });
        }
      } catch (error) {
        failed++;
        results.push({
          contract_number: contract.contract_number,
          status: 'failed',
          error: error.message,
        });
        console.error(`❌ Failed to process contract ${contract.contract_number}:`, error.message);
      }
    }
    
    console.log('\n📊 Recurring Billing Summary:');
    console.log(`   ✅ Processed: ${processed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📋 Total: ${contracts.length}`);
    
    return {
      success: true,
      processed,
      skipped,
      failed,
      results,
    };
  } catch (error) {
    console.error('❌ Recurring billing process failed:', error);
    throw error;
  }
}

/**
 * Manual trigger for testing
 * Can be called via API endpoint
 */
export async function triggerRecurringBillingManually(userId = null) {
  console.log('\n🔧 Manual recurring billing trigger');
  
  if (userId) {
    console.log(`👤 Processing for user ID: ${userId}`);
    // If userId provided, filter contracts by user
    // For now, process all contracts
  }
  
  return await processRecurringBilling();
}

export default {
  processRecurringBilling,
  triggerRecurringBillingManually,
  getContractsDueForBilling,
};
