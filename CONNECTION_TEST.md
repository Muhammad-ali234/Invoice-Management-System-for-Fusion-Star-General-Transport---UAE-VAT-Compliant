# Frontend-Backend Connection Test

## ✅ What's Been Connected

Your React frontend is now fully connected to the Node.js + PostgreSQL backend!

### Changes Made:

1. **API Client** (`src/lib/api.ts`)
   - Updated endpoints to match backend routes
   - Added snake_case converter for PostgreSQL
   - Proper error handling

2. **Types** (`src/types/index.ts`)
   - Updated to match PostgreSQL schema
   - Changed from MongoDB ObjectId to PostgreSQL integers
   - Snake_case field names (user_id, created_at, etc.)

3. **Hooks** (all updated)
   - `useCustomers.ts` - Customer CRUD operations
   - `useInvoices.ts` - Invoice management with line items
   - `usePayments.ts` - Payment tracking
   - `useAuth.tsx` - JWT authentication

## 🧪 Test the Connection

### Step 1: Start Backend

```cmd
cd backend
npm run dev
```

✅ Should see:
```
╔═══════════════════════════════════════════════════════╗
║   🚀 Invoice Management API Server                   ║
║   Port: 3001                                          ║
╚═══════════════════════════════════════════════════════╝
```

### Step 2: Test Backend Health

Open a new terminal:

```cmd
curl http://localhost:3001/health
```

✅ Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Step 3: Start Frontend

```cmd
npm run dev
```

✅ Visit: http://localhost:5173

### Step 4: Test Registration

1. Go to http://localhost:5173/register
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Register"

✅ Should:
- Create user in PostgreSQL
- Return JWT token
- Redirect to dashboard

### Step 5: Test Customer Creation

1. Go to "Customers" page
2. Click "+ New Customer"
3. Fill in:
   - Name: "Test Customer"
   - Email: "customer@test.com"
4. Click "Save"

✅ Should:
- Save to PostgreSQL `customers` table
- Show in customers list
- Display success message

### Step 6: Test Invoice Creation

1. Go to "Invoices" page
2. Click "+ New Invoice"
3. Select the customer you created
4. Add line items
5. Click "Save Draft"

✅ Should:
- Generate invoice number (INV-0001)
- Save to `invoices` and `invoice_items` tables
- Calculate totals correctly
- Show in invoices list

### Step 7: Test Payment Recording

1. Open the invoice you created
2. Click "+ Record Payment"
3. Enter amount and date
4. Click "Save Payment"

✅ Should:
- Save to `payments` table
- Update invoice status automatically
- Show in payments list

## 🔍 Debugging

### Check Backend Logs

The backend terminal will show all requests:

```
POST /api/auth/register 201 - 234ms
GET /api/customers 200 - 12ms
POST /api/invoices 201 - 45ms
```

### Check Browser Console

Open DevTools (F12) → Console tab to see:
- API requests
- Responses
- Any errors

### Check Database

Connect to PostgreSQL and verify data:

```sql
-- Check users
SELECT * FROM users;

-- Check customers
SELECT * FROM customers;

-- Check invoices
SELECT * FROM invoices;

-- Check invoice items
SELECT * FROM invoice_items;

-- Check payments
SELECT * FROM payments;
```

## 🐛 Common Issues

### "Failed to fetch" Error

**Problem**: Frontend can't reach backend

**Solution**:
1. Check backend is running on port 3001
2. Verify `.env` has: `VITE_API_URL=http://localhost:3001/api`
3. Check CORS is enabled in backend

### "Invalid token" Error

**Problem**: JWT token expired or invalid

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Login again

### "Cannot connect to database" Error

**Problem**: PostgreSQL not running or wrong credentials

**Solution**:
1. Check PostgreSQL is running
2. Verify `backend/.env` has correct password
3. Ensure database `invoicedb` exists

### Data Not Showing

**Problem**: API returns empty arrays

**Solution**:
1. Check you're logged in
2. Verify JWT token in localStorage
3. Check backend logs for errors
4. Verify data exists in database

## 📊 Data Flow

```
┌─────────────┐
│   React     │
│  Component  │
└──────┬──────┘
       │
       ↓
┌──────────────┐
│  Custom Hook │  (useCustomers, useInvoices, etc.)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  API Client  │  (src/lib/api.ts)
└──────┬───────┘
       │
       ↓ HTTP Request (with JWT)
┌──────────────┐
│   Express    │  (backend/server.js)
│   Middleware │  (auth, validation)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   Route      │  (backend/routes/*.js)
│   Handler    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  PostgreSQL  │  (Database)
└──────────────┘
```

## ✅ Success Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Health check returns "healthy"
- [ ] Can register new user
- [ ] Can login
- [ ] Can create customer
- [ ] Can create invoice
- [ ] Can record payment
- [ ] Data persists in PostgreSQL

## 🎉 All Connected!

If all tests pass, your frontend and backend are fully connected and working together!

**Next**: Start building your invoice management workflow!
