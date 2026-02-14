import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runFix() {
  try {
    console.log('🔧 Fixing generate_quote_number function...');
    
    const fixSQL = fs.readFileSync(
      path.join(__dirname, 'fix-quote-function.sql'),
      'utf8'
    );
    
    await pool.query(fixSQL);
    console.log('✅ Function fixed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

runFix();
