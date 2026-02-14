# 🚀 START HERE - Invoice Management System

## New Project Structure

Your project is now organized into separate folders:

```
Invoice-Management-System/
├── frontend/          # React app
├── backend/           # Node.js API
└── package.json       # Root scripts
```

## Quick Setup (5 Minutes)

### Step 1: Install All Dependencies

```cmd
npm run install:all
```

This installs dependencies for root, backend, and frontend.

### Step 2: Create Database

```sql
CREATE DATABASE invoicedb;
```

### Step 3: Configure Backend

Edit `backend/.env`:
```env
DB_PASSWORD=your_postgres_password
```

### Step 4: Run Migrations

```cmd
cd backend
npm run migrate
cd ..
```

✅ You should see: "Migrations completed successfully!"

### Step 5: Start Everything

```cmd
npm run dev
```

This starts:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173

✅ Visit: http://localhost:5173

## Project Structure

### Frontend (`frontend/`)
- React + TypeScript + Vite
- Tailwind CSS
- All UI components and pages
- API client that connects to backend

### Backend (`backend/`)
- Node.js + Express
- PostgreSQL database
- JWT authentication
- RESTful API endpoints

## Available Commands

### From Root Directory

```cmd
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Start frontend only
npm run dev:backend         # Start backend only
npm run install:all         # Install all dependencies
npm run build:frontend      # Build frontend
npm run start:backend       # Start backend in production
```

### From Frontend Directory

```cmd
cd frontend
npm run dev                 # Start Vite dev server
npm run build               # Build for production
npm run preview             # Preview production build
```

### From Backend Directory

```cmd
cd backend
npm run dev                 # Start with nodemon
npm start                   # Start production
npm run migrate             # Run database migrations
```

## Testing

### 1. Check Backend Health

```cmd
curl http://localhost:3001/health
```

Should return:
```json
{"status":"healthy","database":"connected"}
```

### 2. Test Frontend

1. Visit http://localhost:5173
2. Register a new user
3. Create a customer
4. Create an invoice
5. Record a payment

## Troubleshooting

### "Port 3001 already in use"

Run the kill script:
```cmd
kill-port-3001.cmd
```

Or manually:
```cmd
netstat -ano | findstr :3001
taskkill /F /PID <PID>
```

### "Cannot connect to database"

1. Check PostgreSQL is running
2. Verify password in `backend/.env`
3. Ensure database `invoicedb` exists

### Frontend can't connect to backend

1. Check backend is running (curl health endpoint)
2. Verify `frontend/.env` has: `VITE_API_URL=http://localhost:3001/api`
3. Check browser console for errors

## What's Next?

1. ✅ Install dependencies: `npm run install:all`
2. ✅ Create database
3. ✅ Run migrations
4. ✅ Start servers: `npm run dev`
5. 🎉 Start using the app!

## Documentation

- `README.md` - Full project overview
- `QUICK_START.md` - Detailed setup guide
- `BACKEND_SETUP.md` - Backend documentation
- `backend/README.md` - API documentation

---

**Ready?** Run `npm run install:all` then `npm run dev`! 🚀
