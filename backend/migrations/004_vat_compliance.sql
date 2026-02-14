-- ============================================
-- UAE VAT COMPLIANCE MIGRATION
-- ============================================

-- 1. Company Settings Table (Single Row)
CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL DEFAULT 'Fusion Star General Transport L.L.C - O.P.C',
    company_name_arabic VARCHAR(200) DEFAULT 'فيوشن ستار للنقليات العامة - ذ.م.م - ش.و.و',
    trn_number VARCHAR(15) NOT NULL, -- Tax Registration Number (CRITICAL)
    address TEXT NOT NULL DEFAULT 'Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area, Abu Dhabi, UAE',
    phone VARCHAR(20) NOT NULL DEFAULT '+971529747360',
    email VARCHAR(100) NOT NULL DEFAULT 'info@fusionstargeneraltransport.ae',
    website VARCHAR(100) DEFAULT 'www.fusionstargeneraltransport.ae',
    vat_rate DECIMAL(5,2) DEFAULT 5.00, -- UAE standard VAT rate
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default company data (REPLACE TRN WITH ACTUAL)
INSERT INTO company_settings (trn_number, company_name, company_name_arabic, address, phone, email, website)
VALUES (
    '100000000000000', -- ⚠️ REPLACE WITH ACTUAL TRN
    'Fusion Star General Transport L.L.C - O.P.C',
    'فيوشن ستار للنقليات العامة - ذ.م.م - ش.و.و',
    'Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area, Abu Dhabi, UAE',
    '+971529747360',
    'info@fusionstargeneraltransport.ae',
    'www.fusionstargeneraltransport.ae'
)
ON CONFLICT DO NOTHING;

-- 2. Add TRN to Customers
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS trn_number VARCHAR(15),
ADD COLUMN IF NOT EXISTS is_vat_registered BOOLEAN DEFAULT false;

-- 3. Add VAT fields to Invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS company_trn VARCHAR(15), -- Snapshot at invoice time
ADD COLUMN IF NOT EXISTS customer_trn VARCHAR(15); -- Snapshot at invoice time

-- 4. Create trigger for company_settings updated_at (if not exists)
DROP TRIGGER IF EXISTS update_company_settings_updated_at ON company_settings;

CREATE TRIGGER update_company_settings_updated_at 
BEFORE UPDATE ON company_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Create index
CREATE INDEX IF NOT EXISTS idx_customers_trn ON customers(trn_number) WHERE trn_number IS NOT NULL;

-- Done!
