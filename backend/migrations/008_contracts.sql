-- Migration: Create contracts table
-- Description: Contract management for recurring truck rentals
-- Date: 2026-02-14

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contract_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    truck_id INTEGER REFERENCES trucks(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_amount DECIMAL(10,2) NOT NULL CHECK (monthly_amount > 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    billing_day INTEGER DEFAULT 1 CHECK (billing_day >= 1 AND billing_day <= 28),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create indexes for performance
CREATE INDEX idx_contracts_user ON contracts(user_id);
CREATE INDEX idx_contracts_customer ON contracts(customer_id);
CREATE INDEX idx_contracts_truck ON contracts(truck_id);
CREATE INDEX idx_contracts_driver ON contracts(driver_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_contracts_updated_at();

-- Add contract_id to invoices table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'contract_id'
    ) THEN
        ALTER TABLE invoices 
        ADD COLUMN contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL;
        
        CREATE INDEX idx_invoices_contract ON invoices(contract_id);
    END IF;
END $$;

-- Function to generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number(p_user_id INTEGER)
RETURNS VARCHAR(30) AS $$
DECLARE
    v_year VARCHAR(4);
    v_sequence INTEGER;
    v_contract_number VARCHAR(30);
BEGIN
    v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(contract_number FROM 'CNT-' || v_year || '-(.*)') AS INTEGER)
    ), 0) + 1
    INTO v_sequence
    FROM contracts
    WHERE user_id = p_user_id
    AND contract_number LIKE 'CNT-' || v_year || '-%';
    
    -- Format: CNT-YYYY-XXXX (e.g., CNT-2026-0001)
    v_contract_number := 'CNT-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
    
    RETURN v_contract_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check and update contract status based on dates
CREATE OR REPLACE FUNCTION update_contract_status()
RETURNS void AS $$
BEGIN
    -- Mark contracts as expired if end_date has passed
    UPDATE contracts
    SET status = 'expired'
    WHERE status = 'active'
    AND end_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE contracts IS 'Stores rental contracts linking customers, trucks, and drivers';
COMMENT ON COLUMN contracts.contract_number IS 'Unique contract identifier (CNT-YYYY-XXXX)';
COMMENT ON COLUMN contracts.billing_day IS 'Day of month to generate invoice (1-28)';
COMMENT ON COLUMN contracts.status IS 'Contract status: active, expired, cancelled';
COMMENT ON COLUMN contracts.monthly_amount IS 'Monthly rental amount before VAT';
