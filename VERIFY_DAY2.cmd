@echo off
echo ========================================
echo DAY 2 VERIFICATION - PDF VAT COMPLIANCE
echo ========================================
echo.
echo This will verify:
echo - TypeScript compiles
echo - Database has VAT fields
echo - Settings API works
echo.
pause
echo.

echo Step 1: Checking TypeScript...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ TypeScript compilation failed!
    echo Fix errors and try again.
    pause
    exit /b 1
)
echo ✅ TypeScript OK
echo.

echo Step 2: Checking Database...
cd ..\backend
node migrations/verify-vat.js
echo.

echo ========================================
echo AUTOMATED CHECKS COMPLETE
echo ========================================
echo.
echo Next: MANUAL VERIFICATION
echo.
echo 1. Start backend: cd backend ^&^& npm start
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo 3. Follow DAY2_VERIFICATION.md checklist
echo.
echo When all tests pass, say: "Day 2 verified"
echo.
pause
