@echo off
echo ========================================
echo   FIX PRODUCTS PAGE - RUN MIGRATION
echo ========================================
echo.
echo This will create the missing products tables:
echo - product_categories
echo - units  
echo - products
echo.
echo Your servers will keep running.
echo.
pause

cd backend
echo.
echo Running products migration...
node migrations/run-products-only.js

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS! PRODUCTS TABLES CREATED
    echo ========================================
    echo.
    echo Now refresh your browser at:
    echo http://localhost:5173/products
    echo.
    echo The white screen should be fixed!
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
