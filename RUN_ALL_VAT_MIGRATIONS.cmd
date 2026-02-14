@echo off
echo ========================================
echo UAE VAT COMPLIANCE - FULL SETUP
echo ========================================
echo.

cd backend

echo Step 1: Creating company_settings table...
node migrations/run-vat-only.js
echo.

echo Step 2: Applying critical fixes...
node migrations/run-vat-fixes.js
echo.

echo ========================================
echo ✅ VAT COMPLIANCE COMPLETE!
echo ========================================
echo.
echo What was done:
echo - Company settings table created
echo - TRN fields added
echo - Invoice number UNIQUE constraint
echo - VAT rate storage per invoice
echo - Settings connected to database
echo.
echo Next steps:
echo 1. Start backend: npm start
echo 2. Start frontend: npm run dev
echo 3. Go to Settings and enter TRN
echo 4. Create test invoice
echo.
pause
