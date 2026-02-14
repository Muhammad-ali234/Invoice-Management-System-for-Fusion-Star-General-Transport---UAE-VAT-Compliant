-- Run this SQL in your PostgreSQL database to fix the quote number function
-- You can use pgAdmin or psql command line

DROP FUNCTION IF EXISTS generate_quote_number(INTEGER);

CREATE OR REPLACE FUNCTION generate_quote_number(p_user_id INTEGER)
RETURNS VARCHAR AS $$
DECLARE
    v_next_number INTEGER;
    v_quote_number VARCHAR(50);
BEGIN
    -- Get the highest quote number for this user
    SELECT COALESCE(MAX(CAST(SUBSTRING(q.quote_number FROM 'QUO-(\d+)') AS INTEGER)), 0) + 1
    INTO v_next_number
    FROM quotes q
    WHERE q.user_id = p_user_id;
    
    -- Format as QUO-0001, QUO-0002, etc.
    v_quote_number := 'QUO-' || LPAD(v_next_number::TEXT, 4, '0');
    
    RETURN v_quote_number;
END;
$$ LANGUAGE plpgsql;
