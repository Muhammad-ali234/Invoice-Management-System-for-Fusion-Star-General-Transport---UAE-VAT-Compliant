# Setup Arabic Font for PDF - Step by Step

## ✅ You've Already Done:
- Added Noto Sans Arabic font to `frontend/src/assets/Noto_Sans_Arabic/`

## Next Steps:

### Step 1: Convert Font to Base64
Run the conversion script:

```cmd
CONVERT_ARABIC_FONT.cmd
```

OR manually:
```cmd
cd frontend
node convert-font-to-base64.js
```

This will create: `frontend/src/assets/notoSansArabicFont.ts`

### Step 2: I'll Update the PDF Template
Once the font is converted, I'll update `pdfTemplates-custom.ts` to:
1. Import the font
2. Add it to jsPDF
3. Use it for Arabic text rendering

### Step 3: Test
Generate a PDF and verify Arabic text displays correctly!

## What the Script Does:
1. Reads the `.ttf` font file
2. Converts it to base64 string
3. Creates a TypeScript file with the font data
4. Ready to import and use in PDF generation

## File Size Note:
- Original font: ~400-500KB
- Base64 encoded: ~550-650KB
- This is normal and acceptable for professional PDFs

## Run the conversion now!
Double-click: `CONVERT_ARABIC_FONT.cmd`

Then let me know when it's done, and I'll update the PDF template code.
