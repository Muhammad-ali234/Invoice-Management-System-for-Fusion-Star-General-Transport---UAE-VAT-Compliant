import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Run initial schema migration
    console.log('  📝 Running 001_initial_schema.sql...');
    const initialSchema = fs.readFileSync(
      path.join(__dirname, '001_initial_schema.sql'),
      'utf8'
    );
    await pool.query(initialSchema);
    console.log('  ✅ Initial schema created');
    
    // Run products migration
    console.log('  📝 Running 002_products.sql...');
    const productsSchema = fs.readFileSync(
      path.join(__dirname, '002_products.sql'),
      'utf8'
    );
    await pool.query(productsSchema);
    console.log('  ✅ Products tables created');
    
    // Run quotes migration
    console.log('  📝 Running 003_quotes.sql...');
    const quotesSchema = fs.readFileSync(
      path.join(__dirname, '003_quotes.sql'),
      'utf8'
    );
    await pool.query(quotesSchema);
    console.log('  ✅ Quotes tables created');
    
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
