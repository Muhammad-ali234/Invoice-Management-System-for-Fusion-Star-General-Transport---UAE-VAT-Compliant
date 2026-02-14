# 🚀 How to Start the Servers

## Problem: Port 3001 Already in Use

If you see this error:
```
Error: listen EADDRINUSE: address already in use :::3001
```

### Solution 1: Kill the Process (Recommended)

**Option A: Use the script**
```cmd
kill-port-3001.cmd
```

**Option B: Manual kill**
```cmd
REM Find the process
netstat -ano | findstr :3001

REM Kill it (replace XXXX with the PID from above)
taskkill /F /PID XXXX
```

**Option C: Restart your computer** (easiest but slowest)

### Solution 2: Use a Different Port

Edit `backend/.env`:
```env
PORT=3002
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3002/api
```

## ✅ Starting the Servers

### Method 1: Start Both Together (Recommended)

```cmd
npm run dev:all
```

This starts:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173

### Method 2: Start Separately

**Terminal 1 - Backend:**
```cmd
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
npm run dev
```

## 🧪 Verify Everything is Running

### Check Backend
```cmd
curl http://localhost:3001/health
```

Should return:
```json
{"status":"healthy","database":"connected"}
```

### Check Frontend
Open browser: http://localhost:5173

## 🛑 Stopping the Servers

### If using `npm run dev:all`
Press `Ctrl + C` in the terminal

### If running separately
Press `Ctrl + C` in each terminal

## 🔄 Restarting

After making changes:

**Backend**: Nodemon auto-restarts on file changes

**Frontend**: Vite auto-reloads on file changes

**Manual restart**: Press `Ctrl + C` then run the start command again

## 📝 Common Issues

### Backend won't start
1. Check PostgreSQL is running
2. Verify database `invoicedb` exists
3. Check `backend/.env` has correct password
4. Kill any process on port 3001

### Frontend can't connect to backend
1. Check backend is running (curl health endpoint)
2. Verify `.env` has correct API URL
3. Check browser console for errors

### Database connection errors
1. Verify PostgreSQL is running
2. Check credentials in `backend/.env`
3. Ensure database exists: `CREATE DATABASE invoicedb;`
4. Run migrations: `cd backend && npm run migrate`

## 🎯 Quick Start Checklist

- [ ] PostgreSQL running
- [ ] Database `invoicedb` created
- [ ] Migrations run (`cd backend && npm run migrate`)
- [ ] Port 3001 is free
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Run `npm run dev:all`
- [ ] Visit http://localhost:5173

## 💡 Pro Tips

1. **Keep terminals open**: Don't close the terminal running the servers
2. **Check logs**: Watch the terminal output for errors
3. **Browser DevTools**: Open F12 to see network requests
4. **Database GUI**: Use pgAdmin to view data
5. **API Testing**: Use Postman or curl to test endpoints

---

**Need help?** Check `FINAL_SETUP.md` for complete documentation.
