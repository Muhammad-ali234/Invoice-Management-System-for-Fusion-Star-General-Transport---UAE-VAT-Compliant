@echo off
echo ========================================
echo UAE VAT COMPLIANCE MIGRATION
echo ========================================
echo.

cd backend
node migrations/run-vat-only.js

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Next steps:
echo 1. Update TRN in Settings page
echo 2. Test invoice generation
echo 3. Verify PDF shows TRN
echo.
pause
