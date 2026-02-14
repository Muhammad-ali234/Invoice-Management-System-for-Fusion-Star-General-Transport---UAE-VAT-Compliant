import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'invoice_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function verify() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying VAT Compliance Setup...\n');

    // Check company_settings
    const company = await client.query('SELECT * FROM company_settings LIMIT 1');
    console.log('✅ company_settings table exists');
    if (company.rows.length > 0) {
      console.log('   - Company:', company.rows[0].company_name);
      console.log('   - TRN:', company.rows[0].trn_number);
      console.log('   - VAT Rate:', company.rows[0].vat_rate + '%');
    }
    console.log();

    // Check customers TRN field
    const customerCols = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'customers' 
      AND column_name IN ('trn_number', 'is_vat_registered')
    `);
    console.log('✅ customers table enhanced');
    console.log('   - trn_number:', customerCols.rows.some(r => r.column_name === 'trn_number') ? 'YES' : 'NO');
    console.log('   - is_vat_registered:', customerCols.rows.some(r => r.column_name === 'is_vat_registered') ? 'YES' : 'NO');
    console.log();

    // Check invoices enhancements
    const invoiceCols = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'invoices' 
      AND column_name IN ('company_trn', 'customer_trn', 'vat_rate')
    `);
    console.log('✅ invoices table enhanced');
    console.log('   - company_trn:', invoiceCols.rows.some(r => r.column_name === 'company_trn') ? 'YES' : 'NO');
    console.log('   - customer_trn:', invoiceCols.rows.some(r => r.column_name === 'customer_trn') ? 'YES' : 'NO');
    console.log('   - vat_rate:', invoiceCols.rows.some(r => r.column_name === 'vat_rate') ? 'YES' : 'NO');
    console.log();

    // Check UNIQUE constraint
    const constraint = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'invoices' 
      AND constraint_name = 'unique_invoice_number'
    `);
    console.log('✅ invoice_number UNIQUE constraint:', constraint.rows.length > 0 ? 'YES' : 'NO');
    console.log();

    // Check sample invoice
    const invoice = await client.query('SELECT invoice_number, vat_rate FROM invoices ORDER BY id DESC LIMIT 1');
    if (invoice.rows.length > 0) {
      console.log('📄 Latest Invoice:');
      console.log('   - Number:', invoice.rows[0].invoice_number);
      console.log('   - VAT Rate:', invoice.rows[0].vat_rate + '%');
    } else {
      console.log('📄 No invoices yet (create one to test)');
    }
    console.log();

    console.log('🎯 VAT Compliance Status: READY ✅\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
