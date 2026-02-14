-- ============================================
-- TRUCKS MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS trucks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    truck_type VARCHAR(50) NOT NULL DEFAULT '1-ton pickup',
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    monthly_rate DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trucks_user_id ON trucks(user_id);
CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_trucks_plate_number ON trucks(plate_number);

-- Trigger for updated_at
CREATE TRIGGER update_trucks_updated_at 
BEFORE UPDATE ON trucks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done!
