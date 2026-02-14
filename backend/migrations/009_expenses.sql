-- Migration: Create expenses table
-- Description: Track operational expenses (fuel, salik, maintenance, salary)
-- Date: 2026-02-14

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('fuel', 'salik', 'maintenance', 'salary', 'other')),
    truck_id INTEGER REFERENCES trucks(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    receipt_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_truck ON expenses(truck_id);
CREATE INDEX idx_expenses_driver ON expenses(driver_id);
CREATE INDEX idx_expenses_date_category ON expenses(expense_date, category);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expenses_updated_at();

-- Comments for documentation
COMMENT ON TABLE expenses IS 'Stores operational expenses for the business';
COMMENT ON COLUMN expenses.category IS 'Expense category: fuel, salik, maintenance, salary, other';
COMMENT ON COLUMN expenses.truck_id IS 'Optional link to truck (for fuel, maintenance, salik)';
COMMENT ON COLUMN expenses.driver_id IS 'Optional link to driver (for salary)';
COMMENT ON COLUMN expenses.amount IS 'Expense amount in AED';
COMMENT ON COLUMN expenses.receipt_number IS 'Optional receipt or reference number';
