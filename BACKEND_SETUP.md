# Backend Setup Guide - Node.js + PostgreSQL

## Quick Start (5 minutes)

### 1. Install PostgreSQL

**Windows:**
Download from https://www.postgresql.org/download/windows/

During installation:
- Set password for postgres user (remember this!)
- Port: 5432 (default)
- Locale: Default

### 2. Create Database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE invoicedb;
```

### 3. Setup Backend

```cmd
cd backend
npm install
```

### 4. Configure Environment

The `.env` file is already created. Update the password:

```env
DB_PASSWORD=your_postgres_password
```

### 5. Run Migrations

```cmd
npm run migrate
```

You should see: ✅ Migrations completed successfully!

### 6. Start Backend Server

```cmd
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║   🚀 Invoice Management API Server                   ║
║   Port: 3001                                          ║
╚═══════════════════════════════════════════════════════╝
```

### 7. Start Frontend

Open a NEW terminal:

```cmd
npm run dev
```

Visit http://localhost:5173

## Test the Setup

### 1. Check Backend Health

```cmd
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### 2. Register a User

Go to http://localhost:5173/register and create an account!

## Architecture

```
Frontend (React)          Backend (Node.js)        Database (PostgreSQL)
http://localhost:5173  →  http://localhost:3001  →  localhost:5432
```

## What's Included

### Security ✅
- JWT authentication
- bcrypt password hashing
- Rate limiting (100 req/15min)
- Helmet.js security headers
- Input validation
- SQL injection protection

### Performance ✅
- Connection pooling
- Gzip compression
- Database indexing
- Transaction support

### Production Ready ✅
- Error handling
- Request logging
- Health checks
- Graceful shutdown

## Database Schema

```
users
├── id (PK)
├── email (unique)
├── password (hashed)
└── timestamps

customers
├── id (PK)
├── user_id (FK → users)
├── name, email, phone, etc.
└── timestamps

invoices
├── id (PK)
├── user_id (FK → users)
├── customer_id (FK → customers)
├── invoice_number (unique)
├── amounts, dates, status
└── timestamps

invoice_items
├── id (PK)
├── invoice_id (FK → invoices)
├── description, quantity, rate
└── amount

payments
├── id (PK)
├── user_id (FK → users)
├── invoice_id (FK → invoices)
├── amount, date, method
└── timestamps
```

## Troubleshooting

### "Cannot connect to database"
1. Check PostgreSQL is running
2. Verify password in `backend/.env`
3. Ensure database `invoicedb` exists

### "Port 3001 already in use"
Change PORT in `backend/.env`:
```env
PORT=3002
```

Also update frontend `.env`:
```env
VITE_API_URL=http://localhost:3002/api
```

### "Migration failed"
1. Check database exists
2. Verify credentials
3. Run manually:
```cmd
psql -U postgres -d invoicedb -f backend/migrations/001_initial_schema.sql
```

## Commands

```cmd
# Backend
cd backend
npm run dev          # Development with auto-reload
npm start            # Production
npm run migrate      # Run database migrations

# Frontend
npm run dev          # Development server
npm run build        # Production build
```

## Next Steps

1. ✅ Backend running on port 3001
2. ✅ Frontend running on port 5173
3. ✅ Database connected
4. 🎉 Start using the app!

## Production Deployment

For production, consider:
- **Backend**: Deploy to VPS, Railway, Render, or Heroku
- **Database**: Use managed PostgreSQL (AWS RDS, Railway, Supabase)
- **Frontend**: Deploy to Vercel, Netlify, or Cloudflare Pages

All completely free for small projects!
