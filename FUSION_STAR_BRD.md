# BUSINESS REQUIREMENT DOCUMENT (BRD)
## Rental Transport Invoice Management System
### Fusion Star General Transport L.L.C – O.P.C

---

**Document Version:** 1.0  
**Date:** February 14, 2026  
**Prepared By:** Senior Business Analyst & ERP Consultant  
**Company:** Fusion Star General Transport L.L.C – O.P.C  
**Website:** www.fusionstargeneraltransport.ae  
**Location:** Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area, Abu Dhabi, UAE

---

## EXECUTIVE SUMMARY

This document outlines comprehensive requirements for developing a professional Invoice Management System tailored for Fusion Star General Transport, a UAE-based transport rental company specializing in 1-ton pickup trucks with driver services. The system will automate billing operations, ensure UAE VAT compliance, and provide complete financial visibility for the transport rental business.

---

## 1️⃣ WEBSITE & BUSINESS MODEL ANALYSIS

### 1.1 Company Profile
- **Legal Name:** Fusion Star General Transport L.L.C – O.P.C (One Person Company)
- **Business Type:** Transport Rental Services
- **Primary Service:** 1-ton pickup truck rental with driver
- **Service Area:** UAE (Abu Dhabi, Dubai, and surrounding emirates)
- **Contact:** +971529747360
- **Email:** fusionstargt@gmail.com, info@fusionstargeneraltransport.ae

### 1.2 Core Services Identified

1. **Monthly Truck Rental** - Primary service offering
2. **1-Ton Pickup Trucks with Driver** - Core fleet offering
3. **Commercial Transport Services** - B2B focused
4. **Contract-Based Rentals** - Long-term agreements
5. **On-Demand Transport** - Short-term bookings

### 1.3 Target Customer Segments
- **Construction Companies** - Material transport
- **Retail Businesses** - Delivery services
- **E-commerce Companies** - Last-mile delivery
- **Corporate Clients** - Regular transport needs
- **Event Management** - Equipment transport
- **Small Businesses** - Flexible transport solutions

### 1.4 Operational Workflow

```
Customer Inquiry → Quotation → Contract Agreement → Truck Assignment → 
Driver Allocation → Service Delivery → Monthly Billing → Invoice Generation → 
Payment Collection → Service Renewal
```

**Detailed Workflow:**
1. **Booking Phase:** Customer requests truck rental (daily/weekly/monthly)
2. **Dispatch Phase:** Truck and driver assigned based on availability
3. **Service Phase:** Daily operations, tracking, fuel, Salik (toll), maintenance
4. **Billing Phase:** Monthly invoice generation based on contract terms
5. **Payment Phase:** Payment tracking, reminders, receipt generation
6. **Renewal Phase:** Contract renewal or termination

### 1.5 Automation Opportunities
- ✅ Automated monthly invoice generation for recurring contracts
- ✅ Automatic calculation of VAT (5%)
- ✅ Driver assignment and availability tracking
- ✅ Fuel and Salik expense tracking per truck
- ✅ Payment reminder notifications
- ✅ Contract renewal alerts
- ✅ Dashboard analytics for revenue and expenses
- ✅ Digital invoice delivery (Email/WhatsApp)
- ✅ Multi-currency support (AED primary)

---

## 2️⃣ INVOICE ANALYSIS (FROM PROVIDED PDF)

### 2.1 Current Invoice Structure

**Header Information:**
- Company Logo (Fusion Star branding)
- Company Name: FUSION STAR GENERAL TRANSPORT - L.L.C - O.P.C
- Arabic Name: فيوشن ستار للنقليات العامة - ذ.م.م - ش.و.و
- Document Title: "INVOICE"

**Invoice Details:**
- **Invoice Number:** FSGT-01000 (Pattern: FSGT-XXXXX)
- **Date:** 05/02/2026
- **Month:** February 2026 (Monthly billing cycle)

**Customer Information:**
- **Ref To:** Bilal Khan
- **Address:** Abdra BRT Stop, Peshawar, KPK

**Line Items:**
| S/No | Description | Quantity | Amount |
|------|-------------|----------|--------|
| 1 | 1 ton pickup truck with driver | 01 | 1,000 AED |
| 2 | (Empty row for additional items) | | |

**Total:** OneThousand Dirhams Only (Written in words)

**Footer:**
- Sign & Stamp section
- Office Address: Al Sarab Commercial Center Office No. 21, M-14 Musaffah Industrial Area Abu Dhabi, UAE
- Website: www.fusionstargeneraltransport.ae
- Emails: fusionstargt@gmail.com, info@fusionstargeneraltransport.ae
- Phone: +971529747360

### 2.2 Invoice Numbering Pattern

**Current Pattern:** FSGT-01000
- **Prefix:** FSGT (Fusion Star General Transport)
- **Separator:** Hyphen (-)
- **Number:** 5-digit sequential (01000, 01001, 01002...)
- **Format:** FSGT-XXXXX

**Recommended Enhancement:**
- Add year/month prefix: FSGT-2026-02-0001
- Separate series for Invoices vs Quotes
- Invoice: INV-2026-02-0001
- Quote: QUO-2026-02-0001

### 2.3 Billing Structure Analysis
- **Billing Cycle:** Monthly (as indicated by "Month: February 2026")
- **Pricing Model:** Fixed monthly rate per truck
- **Unit Price:** 1,000 AED per truck per month
- **Quantity:** Number of trucks rented
- **Currency:** AED (UAE Dirham)
- **Payment Terms:** Not specified (needs to be added)

### 2.4 Description Format
- Simple, clear description: "1 ton pickup truck with driver"
- Includes both asset (truck) and service (driver)
- Quantity-based billing

---

## 3️⃣ PROFESSIONAL IMPROVEMENTS & UAE COMPLIANCE

### 3.1 CRITICAL MISSING ELEMENTS

#### ❌ VAT Compliance (MANDATORY)
The current invoice is **NOT VAT compliant**. UAE law requires:

**Required VAT Elements:**
1. ✅ Document labeled as "TAX INVOICE" (currently just "INVOICE")
2. ❌ **Supplier TRN (Tax Registration Number)** - MISSING
3. ❌ **Customer TRN** - MISSING (if customer is VAT registered)
4. ❌ **Subtotal (before VAT)** - MISSING
5. ❌ **VAT Amount (5%)** - MISSING
6. ❌ **VAT Rate (5%)** - MISSING
7. ❌ **Total Amount (including VAT)** - MISSING
8. ❌ **Sequential Invoice Number** - Partially compliant
9. ❌ **Date of Supply** (if different from invoice date) - MISSING

**UAE VAT Invoice Requirements (as per FTA guidelines):**

- Supplier name, address, and TRN
- Customer name, address, and TRN (if registered)
- Unique sequential invoice number
- Date of issue and date of supply
- Description of goods/services with quantity and unit price (excluding VAT)
- VAT rate applied (5% standard rate)
- VAT amount in AED
- Total amount payable in AED
- If currency conversion: exchange rate and VAT in AED

### 3.2 Enhanced Invoice Structure (VAT Compliant)

```
┌─────────────────────────────────────────────────────────────┐
│                    TAX INVOICE                              │
│  [Company Logo]  FUSION STAR GENERAL TRANSPORT              │
│                  فيوشن ستار للنقليات العامة                │
│                  L.L.C - O.P.C                              │
├─────────────────────────────────────────────────────────────┤
│ SUPPLIER DETAILS:                                           │
│ TRN: [123456789012345] ← MANDATORY                         │
│ Address: Al Sarab Commercial Center Office No. 21          │
│ M-14 Musaffah Industrial Area, Abu Dhabi, UAE              │
│ Tel: +971529747360                                          │
│ Email: info@fusionstargeneraltransport.ae                  │
├─────────────────────────────────────────────────────────────┤
│ INVOICE NO: INV-2026-02-0001    DATE: 05/02/2026          │
│ BILLING PERIOD: February 2026                              │
│ DUE DATE: 20/02/2026 (15 days)                            │
│ LPO/PO NUMBER: [If applicable]                             │
│ CONTRACT REF: [Contract number]                            │
├─────────────────────────────────────────────────────────────┤
│ BILL TO:                                                    │
│ Customer Name: Bilal Khan                                   │
│ TRN: [Customer TRN if registered]                          │
│ Address: Abdra BRT Stop, Peshawar, KPK                     │
│ Contact: [Phone/Email]                                      │
├─────────────────────────────────────────────────────────────┤
│ S/No │ Description              │ Qty │ Rate  │ Amount    │
│──────┼─────────────────────────┼─────┼───────┼───────────│
│  1   │ 1 ton pickup truck      │  1  │ 1,000 │ 1,000.00 │
│      │ with driver - Monthly   │     │       │           │
│──────┼─────────────────────────┼─────┼───────┼───────────│
│                                      SUBTOTAL: 1,000.00 AED│
│                                      VAT (5%):    50.00 AED│
│                                      ─────────────────────  │
│                                      TOTAL:    1,050.00 AED│
│                                                             │
│ Amount in Words: One Thousand Fifty Dirhams Only           │
├─────────────────────────────────────────────────────────────┤
│ PAYMENT TERMS: Net 15 days                                 │
│ PAYMENT METHOD: Bank Transfer / Cash / Cheque              │
│                                                             │
│ BANK DETAILS:                                               │
│ Bank Name: [Bank Name]                                      │
│ Account Name: Fusion Star General Transport L.L.C          │
│ Account Number: [Account Number]                           │
│ IBAN: AE[XX][XXXX][XXXX][XXXX][XXXX][XXX]                 │
│ Swift Code: [SWIFT]                                         │
├─────────────────────────────────────────────────────────────┤
│ TERMS & CONDITIONS:                                         │
│ 1. Payment due within 15 days of invoice date             │
│ 2. Late payment subject to 2% monthly interest            │
│ 3. Fuel and Salik charges included in monthly rate        │
│ 4. Service hours: 8 hours/day, 26 days/month              │
│ 5. Overtime charged at AED 50/hour                         │
├─────────────────────────────────────────────────────────────┤
│ Authorized Signature: _______________  Date: __________    │
│ [Digital Stamp/Seal]                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Additional Professional Elements

#### Payment Terms
- Net 15 days / Net 30 days
- Early payment discount (e.g., 2% if paid within 7 days)
- Late payment penalty (e.g., 2% per month)

#### Bank Details (MANDATORY for B2B)
- Bank Name
- Account Name
- Account Number
- IBAN (International Bank Account Number)
- Swift Code (for international transfers)
- Branch

#### LPO/PO Reference
- Local Purchase Order number (common in UAE B2B)
- Contract reference number
- Project code (if applicable)

#### Contract Reference
- Master contract number
- Service agreement reference
- Renewal date

#### Digital Signature/Stamp
- Authorized signatory name and designation
- Digital signature
- Company stamp/seal
- QR code for verification (future e-invoicing requirement)

#### Terms & Conditions
- Service scope
- Working hours
- Overtime charges
- Fuel policy
- Salik (toll) charges
- Cancellation policy
- Liability clauses

---

## 4️⃣ SYSTEM REQUIREMENTS

### 4.1 Core Modules

#### Module 1: Customer Management

**Features:**
- Customer registration (Individual/Company)
- Contact information (Name, Phone, Email, Address)
- TRN number (for VAT-registered customers)
- Trade License details
- Credit limit management
- Payment terms configuration
- Customer category (VIP, Regular, New)
- Customer status (Active, Inactive, Blocked)
- Document uploads (Trade License, Emirates ID, Contract)
- Customer history and notes
- Multiple contact persons per customer

**Business Rules:**
- Unique customer ID auto-generated
- TRN validation for UAE format (15 digits)
- Credit limit alerts
- Overdue payment blocking

#### Module 2: Fleet Management (Trucks)
**Features:**
- Truck registration
- Truck details (Make, Model, Year, Plate Number)
- Truck type (1-ton pickup, 3-ton, 7-ton, etc.)
- Truck status (Available, Rented, Maintenance, Out of Service)
- Mulkiya (vehicle registration) details
- Insurance details and expiry tracking
- Maintenance schedule
- Fuel consumption tracking
- Salik tag assignment
- GPS tracking integration (optional)
- Truck availability calendar
- Truck assignment history

**Business Rules:**
- Prevent double-booking
- Maintenance alerts (Mulkiya renewal, insurance expiry)
- Availability status real-time update

#### Module 3: Driver Management
**Features:**
- Driver registration
- Personal details (Name, Nationality, Emirates ID, Visa)
- License details (Number, Type, Expiry)
- Contact information
- Driver status (Available, Assigned, On Leave, Terminated)
- Driver rating/performance
- Salary and overtime tracking
- Document uploads (License, Visa, Emirates ID)
- Driver assignment history
- Attendance tracking

**Business Rules:**
- License expiry alerts
- Visa expiry alerts
- Prevent assignment if license expired
- Overtime calculation rules

#### Module 4: Contract Management
**Features:**
- Contract creation and templates
- Contract types (Monthly, Quarterly, Annual, One-time)
- Contract terms and conditions
- Start date and end date
- Auto-renewal settings
- Contract value and payment terms
- Truck and driver assignment
- Service scope definition
- Working hours (8 hours/day standard)
- Overtime rates
- Fuel policy (Included/Excluded)
- Salik policy (Included/Excluded)
- Contract status (Draft, Active, Expired, Terminated)
- Contract renewal alerts
- Contract amendment history
- Digital signature support

**Business Rules:**
- Contract expiry notifications (30, 15, 7 days before)
- Auto-renewal processing
- Contract termination workflow
- Amendment approval workflow

#### Module 5: Invoice Management
**Features:**
- Manual invoice creation
- Automated recurring invoice generation (monthly contracts)
- Invoice templates (Standard, Detailed, Custom)
- Line item management
- VAT calculation (5% automatic)
- Discount application
- Multiple currency support (AED primary)
- Invoice status (Draft, Sent, Paid, Overdue, Cancelled)
- Invoice preview and PDF generation
- Email delivery
- WhatsApp sharing
- Invoice numbering (auto-sequential)
- Credit note generation
- Invoice amendment
- Bulk invoice generation
- Invoice approval workflow (optional)

**Business Rules:**
- VAT mandatory for amounts > AED 10,000
- Invoice number sequential and unique
- Cannot delete paid invoices
- Credit note for invoice corrections
- Due date calculation based on payment terms

#### Module 6: Quotation Management
**Features:**
- Quotation creation
- Quote templates
- Validity period
- Quote to invoice conversion
- Quote status (Draft, Sent, Accepted, Rejected, Expired)
- Quote numbering (QUO-YYYY-MM-XXXX)
- PDF generation
- Email/WhatsApp sharing
- Quote comparison
- Quote revision history

**Business Rules:**
- Quote expiry alerts
- One-click conversion to invoice
- Quote acceptance workflow

#### Module 7: Payment Tracking
**Features:**
- Payment recording
- Payment methods (Cash, Bank Transfer, Cheque, Card)
- Partial payment support
- Payment allocation to invoices
- Receipt generation
- Payment status tracking
- Bank reconciliation
- Payment reminders (automated)
- Overdue tracking
- Payment history
- Refund management

**Business Rules:**
- Payment cannot exceed invoice amount
- Auto-update invoice status on payment
- Payment reminder schedule (Due date, +3 days, +7 days, +15 days)
- Late payment interest calculation

#### Module 8: Expense Tracking
**Features:**
- Expense categories (Fuel, Salik, Maintenance, Driver Salary, Insurance, etc.)
- Expense recording per truck
- Expense allocation to contracts/customers
- Receipt/document upload
- Expense approval workflow
- Recurring expense setup
- Expense reports
- Budget vs actual tracking

**Expense Categories:**
- Fuel costs (per truck, per trip)
- Salik (toll) charges
- Maintenance and repairs
- Driver salaries and overtime
- Insurance premiums
- Mulkiya renewal fees
- Office expenses
- Marketing expenses
- Utilities

**Business Rules:**
- Expense approval for amounts > threshold
- Expense allocation to cost centers
- Monthly expense budgets

#### Module 9: VAT Management (UAE 5%)
**Features:**
- VAT rate configuration (5% standard)
- VAT calculation on invoices
- VAT reports (Input VAT, Output VAT)
- VAT return preparation
- TRN validation
- VAT exemption handling
- Zero-rated supply support
- Reverse charge mechanism
- VAT audit trail

**Reports:**
- VAT Summary Report
- Input VAT Report (expenses)
- Output VAT Report (sales)
- VAT Return (FTA format)
- VAT Reconciliation

**Business Rules:**
- VAT mandatory for registered businesses
- VAT rate 5% (standard)
- Zero-rated for specific services
- Reverse charge for imported services

#### Module 10: Reports & Dashboard
**Dashboard Widgets:**
- Total Revenue (Monthly, Quarterly, Annual)
- Outstanding Payments
- Overdue Invoices
- Active Contracts
- Available Trucks
- Available Drivers
- Monthly Expenses
- Profit/Loss Summary
- VAT Summary
- Top Customers
- Revenue Trends (Chart)
- Expense Trends (Chart)

**Reports:**
1. **Financial Reports:**
   - Income Statement (P&L)
   - Balance Sheet
   - Cash Flow Statement
   - Accounts Receivable Aging
   - Accounts Payable Aging
   - Revenue by Customer
   - Revenue by Service Type
   - Profit Margin Analysis

2. **Operational Reports:**
   - Fleet Utilization Report
   - Driver Performance Report
   - Contract Expiry Report
   - Maintenance Schedule Report
   - Fuel Consumption Report
   - Salik Expense Report

3. **Tax Reports:**
   - VAT Summary Report
   - VAT Return Report
   - TRN Validation Report

4. **Customer Reports:**
   - Customer Statement
   - Customer Payment History
   - Customer Outstanding Report
   - Top Customers by Revenue

**Export Formats:**
- PDF
- Excel
- CSV

---

## 5️⃣ DATABASE DESIGN

### 5.1 Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  CUSTOMERS  │───────│  CONTRACTS   │───────│   TRUCKS    │
└─────────────┘       └──────────────┘       └─────────────┘
      │                      │                       │
      │                      │                       │
      ▼                      ▼                       ▼
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  INVOICES   │       │   DRIVERS    │       │ MAINTENANCE │
└─────────────┘       └──────────────┘       └─────────────┘
      │                      │
      │                      │
      ▼                      ▼
┌─────────────┐       ┌──────────────┐
│  PAYMENTS   │       │   EXPENSES   │
└─────────────┘       └──────────────┘
```

### 5.2 Database Tables Structure

#### Table 1: users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- admin, manager, accountant, user
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 2: customers
```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL, -- AUTO: CUST-0001
    customer_type VARCHAR(20) NOT NULL, -- individual, company
    company_name VARCHAR(200),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    mobile VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'UAE',
    trn_number VARCHAR(15), -- Tax Registration Number (15 digits)
    trade_license VARCHAR(50),
    credit_limit DECIMAL(10,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 15, -- days
    customer_category VARCHAR(20), -- VIP, Regular, New
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, blocked
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 3: trucks
```sql
CREATE TABLE trucks (
    id SERIAL PRIMARY KEY,
    truck_code VARCHAR(20) UNIQUE NOT NULL, -- AUTO: TRK-0001
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    truck_type VARCHAR(50) NOT NULL, -- 1-ton pickup, 3-ton, 7-ton
    make VARCHAR(50), -- Toyota, Nissan, Isuzu
    model VARCHAR(50),
    year INTEGER,
    color VARCHAR(30),
    chassis_number VARCHAR(50),
    mulkiya_number VARCHAR(50), -- Vehicle registration
    mulkiya_expiry DATE,
    insurance_company VARCHAR(100),
    insurance_policy VARCHAR(50),
    insurance_expiry DATE,
    salik_tag VARCHAR(20), -- Toll tag number
    status VARCHAR(20) DEFAULT 'available', -- available, rented, maintenance, out_of_service
    daily_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 4: drivers
```sql
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    driver_code VARCHAR(20) UNIQUE NOT NULL, -- AUTO: DRV-0001
    full_name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50),
    emirates_id VARCHAR(20),
    visa_number VARCHAR(50),
    visa_expiry DATE,
    license_number VARCHAR(50) NOT NULL,
    license_type VARCHAR(20), -- Light, Heavy
    license_expiry DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    joining_date DATE,
    basic_salary DECIMAL(10,2),
    overtime_rate DECIMAL(10,2), -- per hour
    status VARCHAR(20) DEFAULT 'available', -- available, assigned, on_leave, terminated
    rating DECIMAL(3,2), -- 0.00 to 5.00
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 5: contracts
```sql
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(30) UNIQUE NOT NULL, -- AUTO: CNT-2026-0001
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    truck_id INTEGER REFERENCES trucks(id),
    driver_id INTEGER REFERENCES drivers(id),
    contract_type VARCHAR(20) NOT NULL, -- monthly, quarterly, annual, one_time
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT false,
    contract_value DECIMAL(10,2) NOT NULL,
    payment_terms INTEGER DEFAULT 15, -- days
    billing_cycle VARCHAR(20), -- monthly, quarterly, annual
    working_hours INTEGER DEFAULT 8, -- hours per day
    working_days INTEGER DEFAULT 26, -- days per month
    overtime_rate DECIMAL(10,2), -- per hour
    fuel_included BOOLEAN DEFAULT true,
    salik_included BOOLEAN DEFAULT true,
    service_scope TEXT,
    terms_conditions TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, expired, terminated
    lpo_number VARCHAR(50), -- Local Purchase Order
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 6: invoices
```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL, -- AUTO: INV-2026-02-0001
    invoice_type VARCHAR(20) DEFAULT 'standard', -- standard, recurring, credit_note
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    contract_id INTEGER REFERENCES contracts(id),
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    billing_period_start DATE,
    billing_period_end DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    taxable_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    vat_rate DECIMAL(5,2) DEFAULT 5.00, -- 5% UAE VAT
    vat_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AED',
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, partial, overdue, cancelled
    payment_terms INTEGER DEFAULT 15,
    lpo_number VARCHAR(50),
    notes TEXT,
    terms_conditions TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 7: invoice_items
```sql
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    truck_id INTEGER REFERENCES trucks(id),
    driver_id INTEGER REFERENCES drivers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 8: payments
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(30) UNIQUE NOT NULL, -- AUTO: PAY-2026-0001
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- cash, bank_transfer, cheque, card
    reference_number VARCHAR(50), -- Bank ref, Cheque number
    bank_name VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'completed', -- completed, pending, cancelled
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 9: expenses
```sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    expense_number VARCHAR(30) UNIQUE NOT NULL, -- AUTO: EXP-2026-0001
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expense_category VARCHAR(50) NOT NULL, -- fuel, salik, maintenance, salary, insurance, etc.
    truck_id INTEGER REFERENCES trucks(id),
    driver_id INTEGER REFERENCES drivers(id),
    contract_id INTEGER REFERENCES contracts(id),
    amount DECIMAL(10,2) NOT NULL,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20), -- cash, bank_transfer, card
    vendor_name VARCHAR(100),
    description TEXT,
    receipt_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    approved_by INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 10: quotations
```sql
CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    quote_number VARCHAR(30) UNIQUE NOT NULL, -- AUTO: QUO-2026-02-0001
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    quote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    taxable_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    vat_rate DECIMAL(5,2) DEFAULT 5.00,
    vat_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AED',
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
    notes TEXT,
    terms_conditions TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 11: quotation_items
```sql
CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 12: company_settings
```sql
CREATE TABLE company_settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    company_name_arabic VARCHAR(200),
    trn_number VARCHAR(15) NOT NULL, -- Company TRN
    trade_license VARCHAR(50),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'UAE',
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(100),
    logo_url TEXT,
    bank_name VARCHAR(100),
    account_name VARCHAR(200),
    account_number VARCHAR(50),
    iban VARCHAR(50),
    swift_code VARCHAR(20),
    vat_rate DECIMAL(5,2) DEFAULT 5.00,
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    quote_prefix VARCHAR(10) DEFAULT 'QUO',
    payment_terms INTEGER DEFAULT 15,
    currency VARCHAR(3) DEFAULT 'AED',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 Key Relationships

1. **customers → contracts** (One-to-Many)
2. **trucks → contracts** (One-to-Many)
3. **drivers → contracts** (One-to-Many)
4. **customers → invoices** (One-to-Many)
5. **contracts → invoices** (One-to-Many)
6. **invoices → invoice_items** (One-to-Many)
7. **invoices → payments** (One-to-Many)
8. **trucks → expenses** (One-to-Many)
9. **drivers → expenses** (One-to-Many)
10. **customers → quotations** (One-to-Many)
11. **quotations → quotation_items** (One-to-Many)

### 5.4 Invoice Numbering Logic

```javascript
// Invoice Number Format: INV-YYYY-MM-XXXX
// Example: INV-2026-02-0001

function generateInvoiceNumber() {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get last invoice number for current month
    const lastInvoice = await db.query(
        `SELECT invoice_number FROM invoices 
         WHERE invoice_number LIKE '${prefix}-${year}-${month}-%' 
         ORDER BY id DESC LIMIT 1`
    );
    
    let sequence = 1;
    if (lastInvoice.rows.length > 0) {
        const lastNumber = lastInvoice.rows[0].invoice_number;
        sequence = parseInt(lastNumber.split('-')[3]) + 1;
    }
    
    const sequenceStr = String(sequence).padStart(4, '0');
    return `${prefix}-${year}-${month}-${sequenceStr}`;
}

// Examples:
// INV-2026-02-0001
// INV-2026-02-0002
// QUO-2026-02-0001
// PAY-2026-0001
// EXP-2026-0001
```

---

## 6️⃣ TECH STACK RECOMMENDATION

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  React.js + TypeScript + Tailwind CSS + Vite          │
└─────────────────────────────────────────────────────────┘
                          ↕ REST API
┌─────────────────────────────────────────────────────────┐
│                   API LAYER                             │
│  Node.js + Express.js + JWT Authentication             │
└─────────────────────────────────────────────────────────┘
                          ↕ SQL
┌─────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                         │
│  PostgreSQL 14+ (with pg library)                      │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Frontend Stack

**Core Framework:**
- **React.js 18+** - Component-based UI
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router v6** - Client-side routing

**UI Framework:**
- **Tailwind CSS** - Utility-first CSS
- **Headless UI** - Accessible components
- **Heroicons** - Icon library

**State Management:**
- **React Context API** - Global state
- **React Query (TanStack Query)** - Server state management
- **Zustand** (optional) - Lightweight state management

**Form Handling:**
- **React Hook Form** - Form validation
- **Zod** - Schema validation

**Data Visualization:**
- **Recharts** - Charts and graphs
- **React-PDF** - PDF generation

**Additional Libraries:**
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **react-hot-toast** - Notifications
- **jsPDF** - PDF generation
- **html2canvas** - Screenshot for PDF

### 6.3 Backend Stack

**Core Framework:**
- **Node.js 18+** - Runtime
- **Express.js 4+** - Web framework
- **TypeScript** (optional) - Type safety

**Database:**
- **PostgreSQL 14+** - Relational database
- **pg (node-postgres)** - PostgreSQL client
- **pg-promise** (optional) - Promise-based PostgreSQL

**Authentication:**
- **JWT (jsonwebtoken)** - Token-based auth
- **bcrypt** - Password hashing
- **express-validator** - Input validation

**Additional Libraries:**
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **nodemailer** - Email sending
- **node-cron** - Scheduled tasks (recurring invoices)
- **multer** - File uploads

### 6.4 Development Tools

**Version Control:**
- **Git** - Source control
- **GitHub/GitLab** - Repository hosting

**Code Quality:**
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

**Testing:**
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Supertest** - API testing

**Deployment:**
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Process manager (Node.js)
- **Vercel/Netlify** - Frontend hosting (optional)
- **AWS/DigitalOcean** - Backend hosting

### 6.5 Database Choice: PostgreSQL

**Why PostgreSQL?**
1. ✅ **ACID Compliance** - Data integrity for financial transactions
2. ✅ **Complex Queries** - Advanced reporting and analytics
3. ✅ **JSON Support** - Flexible data storage
4. ✅ **Scalability** - Handles growth efficiently
5. ✅ **Open Source** - No licensing costs
6. ✅ **Mature Ecosystem** - Extensive tooling and support
7. ✅ **Triggers & Functions** - Business logic at database level
8. ✅ **Full-text Search** - Search invoices, customers
9. ✅ **Backup & Recovery** - Robust data protection

### 6.6 Recommended Project Structure

```
fusion-star-invoice-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable components
│   │   │   ├── forms/           # Form components
│   │   │   ├── layout/          # Layout components
│   │   │   └── charts/          # Chart components
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Invoices.tsx
│   │   │   ├── Contracts.tsx
│   │   │   └── Reports.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   ├── contexts/            # React contexts
│   │   ├── lib/                 # Utilities
│   │   ├── types/               # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── customers.js
│   │   │   ├── invoices.js
│   │   │   ├── contracts.js
│   │   │   ├── payments.js
│   │   │   └── reports.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── utils/
│   │   │   ├── invoiceNumber.js
│   │   │   ├── pdfGenerator.js
│   │   │   └── emailSender.js
│   │   └── server.js
│   ├── migrations/              # Database migrations
│   ├── package.json
│   └── .env
│
└── database/
    ├── schema.sql               # Database schema
    └── seed.sql                 # Sample data
```

### 6.7 Security Recommendations

1. **Authentication & Authorization:**
   - JWT with refresh tokens
   - Role-based access control (RBAC)
   - Password strength requirements
   - Account lockout after failed attempts

2. **Data Protection:**
   - HTTPS only (SSL/TLS)
   - Input validation and sanitization
   - SQL injection prevention (parameterized queries)
   - XSS protection
   - CSRF protection

3. **API Security:**
   - Rate limiting
   - API key authentication (for integrations)
   - Request size limits
   - CORS configuration

4. **Database Security:**
   - Encrypted connections
   - Regular backups
   - Principle of least privilege
   - Audit logging

5. **Compliance:**
   - GDPR considerations (data privacy)
   - UAE data protection laws
   - Financial data retention policies

---

## 7️⃣ IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-2)
- ✅ Database setup and schema creation
- ✅ Backend API structure
- ✅ Authentication system
- ✅ Frontend project setup
- ✅ Basic UI components

### Phase 2: Core Modules (Weeks 3-6)
- ✅ Customer Management
- ✅ Fleet Management (Trucks)
- ✅ Driver Management
- ✅ Contract Management

### Phase 3: Billing (Weeks 7-10)
- ✅ Invoice Management
- ✅ Quotation Management
- ✅ Payment Tracking
- ✅ VAT Calculations
- ✅ PDF Generation

### Phase 4: Operations (Weeks 11-12)
- ✅ Expense Tracking
- ✅ Recurring Invoice Automation
- ✅ Email/WhatsApp Integration
- ✅ Notifications

### Phase 5: Reporting (Weeks 13-14)
- ✅ Dashboard
- ✅ Financial Reports
- ✅ Operational Reports
- ✅ VAT Reports

### Phase 6: Testing & Deployment (Weeks 15-16)
- ✅ Testing (Unit, Integration, UAT)
- ✅ Bug fixes
- ✅ Documentation
- ✅ Deployment
- ✅ Training

---

## 8️⃣ ESTIMATED COSTS

### Development Costs
- **Backend Development:** 200-250 hours @ $50-80/hour = $10,000-20,000
- **Frontend Development:** 250-300 hours @ $50-80/hour = $12,500-24,000
- **Database Design:** 40-50 hours @ $60-90/hour = $2,400-4,500
- **Testing & QA:** 80-100 hours @ $40-60/hour = $3,200-6,000
- **Project Management:** 60-80 hours @ $60-100/hour = $3,600-8,000

**Total Development:** $31,700 - $62,500

### Infrastructure Costs (Annual)
- **Server Hosting:** $50-200/month = $600-2,400/year
- **Database Hosting:** $30-100/month = $360-1,200/year
- **Domain & SSL:** $50-100/year
- **Email Service:** $10-30/month = $120-360/year
- **Backup Storage:** $20-50/month = $240-600/year

**Total Infrastructure:** $1,370 - $4,660/year

### Maintenance (Annual)
- **Bug Fixes & Updates:** $3,000-6,000/year
- **Feature Enhancements:** $5,000-10,000/year
- **Support:** $2,000-4,000/year

**Total Maintenance:** $10,000 - $20,000/year

---

## 9️⃣ SUCCESS METRICS (KPIs)

1. **Operational Efficiency:**
   - Invoice generation time: < 2 minutes
   - Payment processing time: < 1 minute
   - Report generation time: < 30 seconds

2. **Financial Metrics:**
   - Reduction in overdue invoices: 30%
   - Faster payment collection: 20% improvement
   - Expense tracking accuracy: 95%+

3. **User Adoption:**
   - User satisfaction: 4.5/5
   - System uptime: 99.5%
   - Training completion: 100%

4. **Compliance:**
   - VAT compliance: 100%
   - Invoice accuracy: 99%+
   - Audit trail completeness: 100%

---

## 🔟 CONCLUSION

This comprehensive Invoice Management System will transform Fusion Star General Transport's billing operations from manual to automated, ensuring UAE VAT compliance, improving cash flow, and providing real-time business insights. The recommended React.js + Node.js + PostgreSQL stack offers scalability, security, and maintainability for long-term success.

**Next Steps:**
1. Review and approve BRD
2. Finalize budget and timeline
3. Assemble development team
4. Begin Phase 1 implementation
5. Regular progress reviews

---

**Document Prepared By:**  
Senior Business Analyst & ERP Consultant  
**Date:** February 14, 2026  
**Status:** Draft for Review
