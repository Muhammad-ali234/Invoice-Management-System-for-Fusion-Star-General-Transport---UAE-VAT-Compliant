-- Remove product_id from invoice_items
-- Transport business doesn't need product catalog

ALTER TABLE invoice_items DROP COLUMN IF EXISTS product_id;
ALTER TABLE invoice_items DROP COLUMN IF EXISTS tax_percent;

-- invoice_items now has clean structure:
-- id, invoice_id, description, quantity, rate, amount
