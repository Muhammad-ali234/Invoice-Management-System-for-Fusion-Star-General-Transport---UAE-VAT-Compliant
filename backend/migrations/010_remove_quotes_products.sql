-- Migration to remove quotes and products tables
-- These are not needed for transport rental business

-- Drop quotes tables
DROP TABLE IF EXISTS quote_items CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;

-- Drop products tables
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Note: invoice_items table already has no product_id dependency
-- It uses simple description field for transport services
