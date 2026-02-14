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

async function runTrucksMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚚 Running Trucks Management Migration...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, '006_trucks.sql'),
      'utf8'
    );

    await client.query(sql);
    
    console.log('✅ Trucks table created');
    console.log('✅ Indexes created');
    console.log('✅ Triggers created\n');

    console.log('🎯 Trucks Management Ready!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runTrucksMigration();
