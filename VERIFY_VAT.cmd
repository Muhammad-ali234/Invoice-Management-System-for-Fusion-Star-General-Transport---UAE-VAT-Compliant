@echo off
echo ========================================
echo VAT COMPLIANCE VERIFICATION
echo ========================================
echo.

cd backend
node migrations/verify-vat.js

echo.
echo ========================================
echo.
echo If all checks show YES, you're ready!
echo.
echo Next: Start the system and test
echo   1. cd backend ^&^& npm start
echo   2. cd frontend ^&^& npm run dev
echo   3. Go to Settings and enter TRN
echo   4. Create test invoice
echo.
pause
