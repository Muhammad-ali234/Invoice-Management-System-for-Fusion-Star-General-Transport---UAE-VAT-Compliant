@echo off
echo ========================================
echo   QUICK START - MOVERS INVOICE PRO
echo ========================================
echo.
echo Starting both servers...
echo.

echo Starting Backend (Port 3001)...
cd backend
start "Backend Server" cmd /k "npm start"
timeout /t 2 /nobreak >nul

echo Starting Frontend (Port 5173)...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Wait 10 seconds, then open:
echo http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
