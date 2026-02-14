-- Fix the generate_quote_number function
-- This fixes the "column reference is ambiguous" error

DROP FUNCTION IF EXISTS generate_quote_number(INTEGER);

CREATE OR REPLACE FUNCTION generate_quote_number(user_id_param INTEGER)
RETURNS VARCHAR AS $$
DECLARE
    next_number INTEGER;
    quote_number VARCHAR(50);
BEGIN
    -- Get the highest quote number for this user
    -- Use table alias 'q' to avoid ambiguity
    SELECT COALESCE(MAX(CAST(SUBSTRING(q.quote_number FROM 'QUO-(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM quotes q
    WHERE q.user_id = user_id_param;
    
    -- Format as QUO-0001, QUO-0002, etc.
    quote_number := 'QUO-' || LPAD(next_number::TEXT, 4, '0');
    
    RETURN quote_number;
END;
$$ LANGUAGE plpgsql;
