import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'invoice_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runDriversMigration() {
  const client = await pool.connect();
  
  try {
    console.log('👨‍✈️ Running Drivers Management Migration...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, '007_drivers.sql'),
      'utf8'
    );

    await client.query(sql);
    
    console.log('✅ Drivers table created');
    console.log('✅ Indexes created');
    console.log('✅ Triggers created\n');

    console.log('🎯 Drivers Management Ready!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runDriversMigration();
