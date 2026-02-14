@echo off
echo ========================================
echo   FIX QUOTE NUMBER FUNCTION
echo ========================================
echo.
echo This will fix the database function that
echo generates quote numbers.
echo.
pause

cd backend
echo.
echo Running fix...
node fix-quote-function.js

echo.
pause
