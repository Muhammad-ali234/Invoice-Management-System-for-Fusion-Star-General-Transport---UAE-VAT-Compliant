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

async function runCleanup() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Starting cleanup: Removing quotes and products tables...');
    
    const sql = readFileSync(join(__dirname, '010_remove_quotes_products.sql'), 'utf8');
    
    await client.query(sql);
    
    console.log('✅ Cleanup complete!');
    console.log('   - Dropped quote_items table');
    console.log('   - Dropped quotes table');
    console.log('   - Dropped product_categories table');
    console.log('   - Dropped units table');
    console.log('   - Dropped products table');
    console.log('\n✨ System is now transport-focused!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runCleanup();
