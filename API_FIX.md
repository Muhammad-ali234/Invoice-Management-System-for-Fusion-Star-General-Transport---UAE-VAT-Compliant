# ✅ API Communication Fixed

## Issue
Invoice creation was failing with 400 error: "Failed to create invoice"

## Root Cause
The API client was converting all field names from camelCase to snake_case before sending to the backend, but the backend validation middleware expects camelCase field names in the request body.

**Example of the problem:**
- Frontend sends: `{ customer_id: 1, invoice_date: "2024-01-01" }`
- Backend expects: `{ customerId: 1, invoiceDate: "2024-01-01" }`
- Backend validation fails because it can't find `customerId`

## What Was Fixed

### 1. API Client (`frontend/src/lib/api.ts`)
- **Removed** the `toSnakeCase()` conversion function
- Now sends data as-is (camelCase) to match backend validation expectations
- Backend handles the conversion to snake_case for database operations

### 2. Validation Schemas (`frontend/src/utils/validation.ts`)
- Changed `taxId` → `tax_id` in customer schema
- Changed date fields from `z.date()` → `z.string()` to match backend ISO8601 string validation
- Updated invoice and payment schemas

## How It Works Now

**Request Flow:**
1. Frontend form collects data in camelCase
2. API client sends data as-is (camelCase)
3. Backend validation checks camelCase fields
4. Backend routes convert to snake_case for database
5. Database returns snake_case
6. Frontend receives snake_case and uses it directly

**Field Name Convention:**
- **Request body (frontend → backend)**: camelCase (`customerId`, `invoiceDate`)
- **Response body (backend → frontend)**: snake_case (`customer_id`, `invoice_date`)
- **Database**: snake_case (`customer_id`, `invoice_date`)

## Test Now

Try creating an invoice again - it should work! The backend will:
1. Accept the camelCase request
2. Validate the fields
3. Convert to snake_case for database
4. Return the created invoice with snake_case fields
