import pool from './config/database.js';

async function fixQuoteFunction() {
  try {
    console.log('🔧 Fixing generate_quote_number function...');
    
    // Drop the old function
    await pool.query('DROP FUNCTION IF EXISTS generate_quote_number(INTEGER);');
    console.log('  ✓ Dropped old function');
    
    // Create the fixed function with proper aliases
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION generate_quote_number(p_user_id INTEGER)
      RETURNS VARCHAR AS $$
      DECLARE
          v_next_number INTEGER;
          v_quote_number VARCHAR(50);
      BEGIN
          -- Get the highest quote number for this user
          -- Use table alias 'q' and variable prefix 'v_' to avoid ambiguity
          SELECT COALESCE(MAX(CAST(SUBSTRING(q.quote_number FROM 'QUO-(\\d+)') AS INTEGER)), 0) + 1
          INTO v_next_number
          FROM quotes q
          WHERE q.user_id = p_user_id;
          
          -- Format as QUO-0001, QUO-0002, etc.
          v_quote_number := 'QUO-' || LPAD(v_next_number::TEXT, 4, '0');
          
          RETURN v_quote_number;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    await pool.query(createFunctionSQL);
    console.log('  ✓ Created fixed function');
    
    console.log('✅ Function fixed successfully!');
    console.log('');
    console.log('Now restart your backend server:');
    console.log('  1. Stop backend (Ctrl+C)');
    console.log('  2. Run: npm start');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing function:', error.message);
    console.error('');
    console.error('Details:', error);
    process.exit(1);
  }
}

fixQuoteFunction();
