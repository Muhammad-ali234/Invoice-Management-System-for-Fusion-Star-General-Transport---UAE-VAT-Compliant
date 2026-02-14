# 🚀 Quick Start - Node.js + PostgreSQL Backend

## ✅ What's Done

Your backend is now a **production-ready Node.js + Express + PostgreSQL** API with:
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Connection pooling
- ✅ Transaction support
- ✅ Error handling
- ✅ Request logging

## 📋 Prerequisites

1. **PostgreSQL installed** (you mentioned you have it)
2. **Node.js installed** (you have it)

## 🎯 Setup Steps (5 minutes)

### Step 1: Create Database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE invoicedb;
```

### Step 2: Update Database Password

Edit `backend/.env` and set your PostgreSQL password:

```env
DB_PASSWORD=your_postgres_password
```

### Step 3: Run Migrations

```cmd
cd backend
npm run migrate
```

You should see: ✅ Migrations completed successfully!

### Step 4: Start Backend

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

### Step 5: Start Frontend

Open a **NEW terminal** in the root directory:

```cmd
npm run dev
```

Visit http://localhost:5173

## 🧪 Test It

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

## 📁 Project Structure

```
Invoice-Management-System/
├── backend/                    # Node.js API Server
│   ├── config/
│   │   └── database.js        # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── validation.js      # Input validation
│   │   └── errorHandler.js    # Error handling
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── run.js
│   ├── routes/
│   │   ├── auth.js            # Login/Register
│   │   ├── customers.js       # Customer CRUD
│   │   ├── invoices.js        # Invoice CRUD
│   │   └── payments.js        # Payment CRUD
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Configuration
│
├── src/                        # React Frontend
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
│       └── api.ts             # API client
│
└── package.json
```

## 🔧 Commands

### Backend
```cmd
cd backend
npm run dev          # Development with auto-reload
npm start            # Production
npm run migrate      # Run database migrations
```

### Frontend
```cmd
npm run dev          # Development server
npm run build        # Production build
```

## 🐛 Troubleshooting

### "Cannot connect to database"
1. Check PostgreSQL is running
2. Verify password in `backend/.env`
3. Ensure database `invoicedb` exists

### "Port 3001 already in use"
Change PORT in `backend/.env`:
```env
PORT=3002
```

Also update root `.env`:
```env
VITE_API_URL=http://localhost:3002/api
```

### "Migration failed"
Run manually:
```cmd
psql -U postgres -d invoicedb -f backend/migrations/001_initial_schema.sql
```

## 🎉 What's Different from Vercel?

| Feature | Vercel Serverless | Node.js Backend |
|---------|------------------|-----------------|
| **Control** | Limited | Full control |
| **Debugging** | Harder | Easy with logs |
| **Database** | MongoDB Atlas | PostgreSQL (local) |
| **Cost** | Free (limited) | Free (unlimited locally) |
| **Performance** | Cold starts | Always warm |
| **Deployment** | Auto | Manual (VPS/Railway) |

## 🚀 Production Deployment Options

### Option 1: Railway (Recommended - FREE)
```cmd
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

Railway provides:
- Free PostgreSQL database
- Free hosting (500 hours/month)
- Auto-deploy from Git

### Option 2: Render (FREE)
- Connect GitHub repo
- Auto-deploy on push
- Free PostgreSQL included

### Option 3: VPS (DigitalOcean, Linode)
- Full control
- $5-10/month
- Install PostgreSQL + Node.js

## 📊 Database Schema

```
users → customers → invoices → invoice_items
                  ↓
                payments
```

All tables have:
- Proper indexes
- Foreign key constraints
- Automatic timestamps
- Cascade deletes

## 🔐 Security Features

1. **Password Security**: bcrypt with 10 rounds
2. **JWT Tokens**: 7-day expiration
3. **Rate Limiting**: 100 requests per 15 minutes
4. **Input Validation**: All inputs validated
5. **SQL Injection**: Parameterized queries only
6. **CORS**: Configured for your frontend
7. **Helmet.js**: Security headers

## 📈 Performance Features

1. **Connection Pooling**: Max 20 connections
2. **Compression**: Gzip responses
3. **Transactions**: Data integrity
4. **Indexes**: Fast queries

## ✅ Next Steps

1. ✅ Backend dependencies installed
2. ⏳ Create database
3. ⏳ Run migrations
4. ⏳ Start backend server
5. ⏳ Start frontend
6. 🎉 Use the app!

---

**Ready?** Follow the steps above and you'll be running in 5 minutes! 🚀
