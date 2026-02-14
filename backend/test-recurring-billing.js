import dotenv from 'dotenv';
import { processRecurringBilling, getContractsDueForBilling } from './services/recurringBilling.js';
import pool from './config/database.js';

dotenv.config();

/**
 * Test script for recurring billing
 * Run with: node test-recurring-billing.js
 */

async function testRecurringBilling() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   🧪 Recurring Billing Test Script                   ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  try {
    // Test database connection
    console.log('1️⃣  Testing database connection...');
    await pool.query('SELECT 1');
    console.log('   ✅ Database connected\n');
    
    // Get contracts due for billing
    console.log('2️⃣  Checking contracts due for billing today...');
    const contracts = await getContractsDueForBilling();
    console.log(`   📋 Found ${contracts.length} contract(s) due for billing\n`);
    
    if (contracts.length > 0) {
      console.log('   Contracts:');
      contracts.forEach(c => {
        console.log(`   - ${c.contract_number}: ${c.customer_name} (${c.monthly_amount} AED)`);
      });
      console.log('');
    }
    
    // Ask for confirmation
    console.log('3️⃣  Ready to process recurring billing');
    console.log('   This will generate invoices for the contracts listed above.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Process recurring billing
    console.log('4️⃣  Processing recurring billing...\n');
    const result = await processRecurringBilling();
    
    console.log('\n5️⃣  Results:');
    console.log(`   ✅ Successfully processed: ${result.processed}`);
    console.log(`   ⏭️  Skipped (already billed): ${result.skipped}`);
    console.log(`   ❌ Failed: ${result.failed}`);
    console.log(`   📋 Total contracts: ${result.processed + result.skipped + result.failed}\n`);
    
    if (result.results.length > 0) {
      console.log('   Details:');
      result.results.forEach(r => {
        if (r.status === 'success') {
          console.log(`   ✅ ${r.contract_number} → ${r.invoice_number} (${r.amount} AED)`);
        } else if (r.status === 'skipped') {
          console.log(`   ⏭️  ${r.contract_number}: ${r.reason}`);
        } else {
          console.log(`   ❌ ${r.contract_number}: ${r.error}`);
        }
      });
    }
    
    console.log('\n✅ Test completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error(error.stack);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run the test
testRecurringBilling();
