import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

async function runContractsMigration() {
  const client = await pool.connect();
  
  try {
    console.log('📄 Running Contracts Management Migration...\n');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync(
      join(__dirname, '008_contracts.sql'),
      'utf8'
    );
    
    // Execute the migration
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('COMMIT');
    
    console.log('✅ Contracts table created successfully');
    console.log('✅ Indexes created');
    console.log('✅ Triggers created');
    console.log('✅ Helper functions created');
    console.log('✅ contract_id added to invoices table');
    
    // Verify the table
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'contracts'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Contracts table structure:');
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

runContractsMigration();
