@echo off
echo ========================================
echo   TESTING PRODUCTS API
echo ========================================
echo.
echo This will test if the products API is working.
echo Make sure backend is running on port 3001.
echo.
pause

echo.
echo Testing products endpoints...
echo.

echo 1. Testing GET /api/products
curl -X GET http://localhost:3001/api/products -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing GET /api/products/categories/all
curl -X GET http://localhost:3001/api/products/categories/all -H "Content-Type: application/json"
echo.
echo.

echo 3. Testing GET /api/products/units/all
curl -X GET http://localhost:3001/api/products/units/all -H "Content-Type: application/json"
echo.
echo.

echo ========================================
echo   TEST COMPLETE
echo ========================================
echo.
echo If you see "Unauthorized" - that's normal, you need to login first.
echo If you see connection errors - check if backend is running.
echo.
pause
