@echo off
echo ========================================
echo   TESTING SETTINGS PAGE
echo ========================================
echo.
echo This will start both servers so you can test the Settings page.
echo.
echo WHAT TO TEST:
echo 1. Go to Settings page (click Settings in sidebar)
echo 2. Enter your company information
echo 3. Select a template (Modern, Classic, or Minimal)
echo 4. Click Save Settings
echo 5. Go to an invoice and download PDF
echo 6. Verify your company info appears on PDF
echo.
echo ========================================
echo Starting Backend Server (Port 3001)...
echo ========================================
cd backend
start cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend Server (Port 5173)...
echo ========================================
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Wait 10 seconds for servers to start, then:
echo 1. Open http://localhost:5173 in your browser
echo 2. Login to the application
echo 3. Click Settings in the sidebar
echo 4. Follow the test guide in SETTINGS_TEST_GUIDE.md
echo.
echo Press any key to exit this window...
pause >nul
