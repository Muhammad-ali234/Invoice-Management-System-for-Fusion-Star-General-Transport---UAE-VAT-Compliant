# Add Arabic Font to PDF - Complete Guide

## Overview
To display Arabic text in PDF, we need to:
1. Download an Arabic font (Google Fonts)
2. Convert it to base64 format
3. Add it to jsPDF
4. Use it in the PDF template

## Step 1: Download Arabic Font

### Recommended Fonts:
- **Cairo** - Modern, clean, professional
- **Tajawal** - Clean and readable
- **Amiri** - Traditional, elegant
- **Noto Sans Arabic** - Google's universal font

### Download Cairo Font (Recommended):
1. Go to: https://fonts.google.com/specimen/Cairo
2. Click "Download family"
3. Extract the ZIP file
4. Find `Cairo-Regular.ttf` or `Cairo-Bold.ttf`

## Step 2: Convert Font to Base64

### Option A: Online Converter (Easiest)
1. Go to: https://products.aspose.app/font/base64
2. Upload your `.ttf` font file
3. Click "Convert"
4. Copy the base64 string

### Option B: Using Node.js
Create a file `convert-font.js`:
```javascript
const fs = require('fs');

const fontPath = './Cairo-Regular.ttf';
const fontBase64 = fs.readFileSync(fontPath).toString('base64');

fs.writeFileSync('cairo-font-base64.txt', fontBase64);
console.log('Font converted! Check cairo-font-base64.txt');
```

Run: `node convert-font.js`

## Step 3: Create Font File

Create `frontend/src/assets/arabicFont.ts`:

```typescript
// Cairo Arabic Font - Base64 encoded
export const CAIRO_FONT_BASE64 = 'YOUR_BASE64_STRING_HERE';

// Font name to use in jsPDF
export const ARABIC_FONT_NAME = 'Cairo';
```

## Step 4: Update PDF Template

I'll update the code to use this font automatically.

## Quick Start (I'll do this for you)

Just provide me with:
1. The font file (Cairo-Regular.ttf) OR
2. Tell me to use a default Arabic font

I'll handle the rest!

## What I'll Do:
1. Create the font file with base64
2. Update pdfTemplates-custom.ts to load the font
3. Add Arabic text rendering
4. Test and verify

## Alternative: Use Amiri Font (Smaller)

Amiri is a smaller font file (~200KB vs ~500KB for Cairo).
Good for traditional Arabic text.

Let me know which font you prefer, or I can use Cairo (most popular).
