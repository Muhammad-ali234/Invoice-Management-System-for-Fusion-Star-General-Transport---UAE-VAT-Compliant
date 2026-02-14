@echo off
echo ========================================
echo Testing Invoice Management System Setup
echo ========================================
echo.

echo [1/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

echo [2/4] Checking PostgreSQL...
psql --version
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL not found or not in PATH
    echo Make sure PostgreSQL is installed
)
echo.

echo [3/4] Checking dependencies...
if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not installed
    echo Run: cd frontend && npm install
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

if not exist "backend\node_modules" (
    echo ERROR: Backend dependencies not installed
    echo Run: cd backend && npm install
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [4/4] Checking configuration...
if not exist "backend\.env" (
    echo ERROR: backend\.env not found
    echo Copy backend\.env.example to backend\.env
    pause
    exit /b 1
)
echo ✓ Backend .env found

if not exist "frontend\.env" (
    echo ERROR: frontend\.env not found
    echo Copy frontend\.env.example to frontend\.env
    pause
    exit /b 1
)
echo ✓ Frontend .env found
echo.

echo ========================================
echo ✓ Setup looks good!
echo ========================================
echo.
echo Next steps:
echo 1. Create database: CREATE DATABASE invoicedb;
echo 2. Update backend\.env with your PostgreSQL password
echo 3. Run migrations: cd backend ^&^& npm run migrate
echo 4. Start servers: npm run dev
echo.
pause
