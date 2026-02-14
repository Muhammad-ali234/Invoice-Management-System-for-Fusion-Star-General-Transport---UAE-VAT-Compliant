import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'invoice_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runVATMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Running VAT Compliance Migration...\n');

    // Read and execute VAT migration
    const vatSQL = fs.readFileSync(
      path.join(__dirname, '004_vat_compliance.sql'),
      'utf8'
    );

    await client.query(vatSQL);
    console.log('✅ VAT compliance migration completed successfully!\n');

    // Verify
    const result = await client.query('SELECT * FROM company_settings LIMIT 1');
    if (result.rows.length > 0) {
      console.log('📋 Company Settings:');
      console.log('   Company:', result.rows[0].company_name);
      console.log('   TRN:', result.rows[0].trn_number);
      console.log('   VAT Rate:', result.rows[0].vat_rate + '%');
      console.log('\n⚠️  IMPORTANT: Update TRN with actual Tax Registration Number!\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runVATMigration();
