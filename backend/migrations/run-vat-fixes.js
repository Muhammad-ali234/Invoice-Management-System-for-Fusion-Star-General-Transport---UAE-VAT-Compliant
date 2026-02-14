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

async function runVATFixes() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Running VAT Compliance Fixes...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, '005_vat_fixes.sql'),
      'utf8'
    );

    await client.query(sql);
    
    console.log('✅ Fix 1: invoice_number UNIQUE constraint added');
    console.log('✅ Fix 2: vat_rate column added to invoices');
    console.log('✅ Fix 3: Performance index created\n');

    console.log('🎯 VAT Compliance Fixes Complete!\n');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runVATFixes();
