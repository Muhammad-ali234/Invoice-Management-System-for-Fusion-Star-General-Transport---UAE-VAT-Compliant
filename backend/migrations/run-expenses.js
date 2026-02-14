import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

async function runExpensesMigration() {
  const client = await pool.connect();
  
  try {
    console.log('💰 Running Expenses Management Migration...\n');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync(
      join(__dirname, '009_expenses.sql'),
      'utf8'
    );
    
    // Execute the migration
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('COMMIT');
    
    console.log('✅ Expenses table created successfully');
    console.log('✅ Indexes created');
    console.log('✅ Triggers created');
    
    // Verify the table
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'expenses'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Expenses table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runExpensesMigration();
