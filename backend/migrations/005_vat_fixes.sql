-- ============================================
-- VAT COMPLIANCE FIXES
-- ============================================

-- 1. CRITICAL: Ensure invoice_number is UNIQUE (prevent duplicates)
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS unique_invoice_number;

ALTER TABLE invoices 
ADD CONSTRAINT unique_invoice_number UNIQUE (invoice_number);

-- 2. CRITICAL: Store VAT rate in invoice (for future rate changes)
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5,2) DEFAULT 5.00;

-- Update existing invoices to have vat_rate
UPDATE invoices 
SET vat_rate = 5.00 
WHERE vat_rate IS NULL;

-- 3. Add index for performance
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- Done!
