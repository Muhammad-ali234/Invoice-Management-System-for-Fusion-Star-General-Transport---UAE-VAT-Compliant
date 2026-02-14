@echo off
echo ========================================
echo   MOVERS INVOICE PRO - SETUP AND RUN
echo ========================================
echo.
echo This script will:
echo 1. Run database migrations (including products)
echo 2. Start the backend server
echo 3. Start the frontend server
echo.
echo Make sure PostgreSQL is running!
echo.
pause

echo.
echo ========================================
echo   STEP 1: Running Database Migrations
echo ========================================
cd backend
node migrations/run.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Migration failed! Check your database connection.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   STEP 2: Starting Backend Server
echo ========================================
echo Backend will run on http://localhost:3001
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   STEP 3: Starting Frontend Server
echo ========================================
cd ..\frontend
echo Frontend will run on http://localhost:5173
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   ALL SERVERS STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Wait 10 seconds for servers to fully start, then:
echo.
echo 1. Open http://localhost:5173 in your browser
echo 2. Login to the application
echo 3. You can now access all pages including:
echo    - Dashboard
echo    - Invoices
echo    - Clients
echo    - Products (NEW!)
echo    - Payments
echo    - Reports
echo    - Settings
echo.
echo ========================================
echo   PRODUCTS PAGE IS NOW AVAILABLE!
echo ========================================
echo.
echo The Products page allows you to:
echo - Create product catalog
echo - Manage categories
echo - Set up units of measurement
echo - Quick add products to invoices
echo.
echo Press any key to close this window...
pause >nul
