import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Removing product_id from invoice_items...');
    
    const sql = readFileSync(join(__dirname, '011_remove_product_id.sql'), 'utf8');
    
    await client.query(sql);
    
    console.log('✅ Migration complete!');
    console.log('   - Removed product_id column');
    console.log('   - Removed tax_percent column');
    console.log('\n✨ invoice_items table is now clean and transport-focused!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
