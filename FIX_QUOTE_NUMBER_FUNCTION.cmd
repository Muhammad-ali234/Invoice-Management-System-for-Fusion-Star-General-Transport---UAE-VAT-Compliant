@echo off
echo ========================================
echo   FIX QUOTE NUMBER FUNCTION
echo ========================================
echo.
echo This will fix the generate_quote_number function
echo.
pause

cd backend
echo.
echo Fixing quote number function...
node migrations/run-fix.js

echo.
echo ========================================
echo   DONE
echo ========================================
echo.
echo Now try creating a quote again!
echo.
pause
