import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runProductsMigration() {
  try {
    console.log('🔄 Running products migration only...');
    
    // Run products migration only
    console.log('  📝 Running 002_products.sql...');
    const productsSchema = fs.readFileSync(
      path.join(__dirname, '002_products.sql'),
      'utf8'
    );
    await pool.query(productsSchema);
    console.log('  ✅ Products tables created successfully!');
    
    console.log('✅ Products migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runProductsMigration();
