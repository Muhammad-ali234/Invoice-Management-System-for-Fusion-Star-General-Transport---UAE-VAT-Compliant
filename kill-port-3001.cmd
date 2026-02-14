@echo off
echo Killing process on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo Found process: %%a
    taskkill /F /PID %%a
)
echo Done!
pause
