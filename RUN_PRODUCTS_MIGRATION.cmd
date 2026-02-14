@echo off
echo ========================================
echo   RUNNING PRODUCTS MIGRATION
echo ========================================
echo.
echo This will create the products tables in your database:
echo - product_categories
echo - units
echo - products
echo.
echo Make sure PostgreSQL is running!
echo.
pause

cd backend
echo.
echo Running migrations...
node migrations/run.js

echo.
echo ========================================
echo   MIGRATION COMPLETE
echo ========================================
echo.
echo The products tables have been created.
echo You can now use the Products page!
echo.
echo Next steps:
echo 1. Start the backend: cd backend ^&^& npm start
echo 2. Start the frontend: cd frontend ^&^& npm run dev
echo 3. Go to http://localhost:5173/products
echo.
pause
