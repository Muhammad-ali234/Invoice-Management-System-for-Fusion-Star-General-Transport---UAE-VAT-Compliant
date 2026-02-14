@echo off
echo ========================================
echo Installing PDF and WhatsApp Dependencies
echo ========================================
echo.

cd frontend

echo Installing jsPDF and related packages...
call npm install jspdf jspdf-autotable html2canvas

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo PDF and WhatsApp features are now ready to use.
echo.
echo Next steps:
echo 1. Start the application: npm run dev
echo 2. Test PDF download on any invoice
echo 3. Test WhatsApp sharing
echo.
echo See SETUP_PDF_WHATSAPP.md for detailed instructions.
echo.
pause
