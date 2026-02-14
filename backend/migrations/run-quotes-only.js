import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runQuotesMigration() {
  try {
    console.log('🔄 Running quotes migration only...');
    
    // Run quotes migration only
    console.log('  📝 Running 003_quotes.sql...');
    const quotesSchema = fs.readFileSync(
      path.join(__dirname, '003_quotes.sql'),
      'utf8'
    );
    await pool.query(quotesSchema);
    console.log('  ✅ Quotes tables created successfully!');
    
    console.log('✅ Quotes migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runQuotesMigration();
