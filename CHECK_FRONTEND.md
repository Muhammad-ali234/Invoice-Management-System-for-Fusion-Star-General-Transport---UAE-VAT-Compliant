# 🔍 Frontend Blank Screen - Troubleshooting

## Quick Checks

### 1. Check Browser Console (MOST IMPORTANT)
Press **F12** in your browser, then:
- Click the **Console** tab
- Look for RED error messages
- Take a screenshot or copy the error

Common errors you might see:
- `Failed to fetch` - Backend not running
- `Module not found` - Missing dependency
- `Unexpected token` - Syntax error
- `Cannot read property` - Runtime error

### 2. Check Frontend Terminal
Look at the terminal where you ran `npm run dev`:
- Is it showing errors?
- Is it stuck on "compiling"?
- Does it say "ready" or "compiled successfully"?

### 3. Check the URL
- Are you at `http://localhost:5173`?
- Try going to `http://localhost:5173/login` directly
- Does the login page show?

### 4. Check Backend Terminal
- Is backend running on port 3001?
- Any errors in backend terminal?
- Try: `curl http://localhost:3001/api/customers` (should say "Unauthorized")

---

## Common Issues & Fixes

### Issue 1: "Failed to compile" in terminal
**Fix**: 
1. Stop frontend (Ctrl+C)
2. Delete `node_modules` folder in frontend
3. Run: `npm install`
4. Run: `npm run dev`

### Issue 2: Backend not running
**Fix**:
1. Check backend terminal
2. If not running, go to backend folder
3. Run: `npm start`

### Issue 3: Port already in use
**Fix**:
1. Stop all terminals
2. Run: `kill-port-3001.cmd` (if exists)
3. Restart servers with `QUICK_RUN.cmd`

### Issue 4: Browser cache
**Fix**:
1. Press Ctrl+Shift+R (hard refresh)
2. Or clear browser cache
3. Or try incognito/private window

---

## Step-by-Step Diagnostic

### Step 1: Verify Servers Running
```cmd
# Check if ports are in use
netstat -ano | findstr :5173
netstat -ano | findstr :3001
```

Both should show results. If not, servers aren't running.

### Step 2: Test Backend
Open browser and go to:
```
http://localhost:3001/api/customers
```

Should see: `{"error":"No token provided"}` or similar

If you see "Cannot GET" or connection error, backend is not running.

### Step 3: Test Frontend
Open browser and go to:
```
http://localhost:5173
```

Should see:
- Login page, OR
- Dashboard (if already logged in), OR
- Loading spinner

If you see blank page, check browser console (F12).

---

## What to Tell Me

Please provide:
1. **Browser console errors** (F12 → Console tab)
2. **Frontend terminal output** (last 20 lines)
3. **Backend terminal output** (last 20 lines)
4. **What URL you're trying** (e.g., http://localhost:5173)
5. **What you see** (blank white page, loading spinner, error message)

---

## Quick Fix (Nuclear Option)

If nothing works, try this:

```cmd
# Stop all servers (Ctrl+C in all terminals)

# Frontend
cd frontend
rmdir /s /q node_modules
npm install
npm run dev

# Backend (in new terminal)
cd backend
npm start
```

Then try: http://localhost:5173/login
