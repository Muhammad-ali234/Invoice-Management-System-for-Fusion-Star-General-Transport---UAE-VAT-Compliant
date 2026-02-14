@echo off
echo ========================================
echo   ADD QUOTES SYSTEM - RUN MIGRATION
echo ========================================
echo.
echo This will create the quotes tables:
echo - quotes
echo - quote_items
echo.
echo Make sure PostgreSQL is running!
echo.
pause

cd backend
echo.
echo Running quotes migration only...
node migrations/run-quotes-only.js

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS! QUOTES SYSTEM READY
    echo ========================================
    echo.
    echo Quotes tables created successfully!
    echo.
    echo Now restart your servers:
    echo 1. Stop backend (Ctrl+C in backend terminal)
    echo 2. Stop frontend (Ctrl+C in frontend terminal)
    echo 3. Run: QUICK_RUN.cmd
    echo.
    echo Then go to: http://localhost:5173/quotes
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR! MIGRATION FAILED
    echo ========================================
    echo.
    echo Check if PostgreSQL is running.
    echo Check your database connection in backend/.env
    echo.
)

pause
