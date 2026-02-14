@echo off
echo ========================================
echo Installing Arabic Font Support for PDF
echo ========================================
echo.

cd frontend

echo Installing jspdf-arabic-font package...
call npm install jspdf-arabic-font

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your frontend dev server (npm run dev)
echo 2. Generate a PDF invoice
echo 3. Arabic text should now display correctly
echo.
echo Press any key to exit...
pause > nul
