# Install Arabic Font Support for PDF

## Step 1: Install Required Package

Run this command in the frontend directory:

```cmd
cd frontend
npm install jspdf-arabic-font
```

## Step 2: Restart Frontend Dev Server

After installation, restart your frontend development server:

```cmd
npm run dev
```

## What This Does

The `jspdf-arabic-font` package adds Arabic font support to jsPDF, allowing proper rendering of Arabic text in PDFs with:
- Correct right-to-left (RTL) text direction
- Proper Arabic character shaping
- Connected letters as they should appear

## Verification

After installation and restart:
1. Generate a PDF invoice
2. Check that Arabic text displays correctly in the header
3. Arabic text should appear properly shaped and connected

## Package Info

- Package: `jspdf-arabic-font`
- Purpose: Adds Arabic/RTL language support to jsPDF
- Size: ~200KB (includes Arabic font)
