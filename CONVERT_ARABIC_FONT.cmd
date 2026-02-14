@echo off
echo ========================================
echo Converting Noto Sans Arabic Font
echo ========================================
echo.

cd frontend

echo Running conversion script...
node convert-font-to-base64.js

echo.
echo ========================================
echo Conversion Complete!
echo ========================================
echo.
echo The font has been converted to base64 and saved to:
echo frontend/src/assets/notoSansArabicFont.ts
echo.
echo Press any key to exit...
pause > nul
