-- Product Categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_categories_user_id ON product_categories(user_id);

-- Units table (for measurement units)
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- hour, piece, kg, km, box, service, etc.
    abbreviation VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_units_user_id ON units(user_id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
    unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    tax_percent DECIMAL(5, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_name ON products(name);

-- Update invoice_items table to reference products
ALTER TABLE invoice_items 
ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tax_percent DECIMAL(5, 2) DEFAULT 0;

-- Add triggers for updated_at
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default units for common use cases
INSERT INTO units (user_id, name, abbreviation) 
SELECT 1, 'Hour', 'hr' WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Hour' AND user_id = 1);

INSERT INTO units (user_id, name, abbreviation) 
SELECT 1, 'Piece', 'pc' WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Piece' AND user_id = 1);

INSERT INTO units (user_id, name, abbreviation) 
SELECT 1, 'Service', 'svc' WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Service' AND user_id = 1);

INSERT INTO units (user_id, name, abbreviation) 
SELECT 1, 'Kilometer', 'km' WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Kilometer' AND user_id = 1);

INSERT INTO units (user_id, name, abbreviation) 
SELECT 1, 'Kilogram', 'kg' WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Kilogram' AND user_id = 1);

INSERT INTO units (user_id, name, abbreviation) 
SELECT 1, 'Box', 'box' WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Box' AND user_id = 1);
