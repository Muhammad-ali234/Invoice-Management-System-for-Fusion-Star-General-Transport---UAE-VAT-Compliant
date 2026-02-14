# How to Add Your Company Logo to PDF Invoices

Your invoice system is now set up to display your company logo in the professional PDF template!

## Quick Steps

### 1. Convert Your Logo to Base64

**Option A: Online Tool (Easiest)**
1. Go to https://www.base64-image.de/
2. Click "Choose File" and select your logo (PNG recommended)
3. Click "Convert image"
4. Copy the entire base64 string (it will start with `data:image/png;base64,`)

**Option B: Command Line**

Windows PowerShell:
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\your\logo.png"))
```

Linux/Mac:
```bash
base64 -i /path/to/your/logo.png
```

### 2. Add Logo to Your Project

1. Open the file: `frontend/src/assets/logo.ts`
2. Replace `YOUR_BASE64_STRING_HERE` with your actual base64 string
3. Make sure to keep the `data:image/png;base64,` prefix

Example:
```typescript
export const COMPANY_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...';
```

### 3. Test Your Logo

1. Make sure your frontend is running: `npm run dev` (in frontend folder)
2. Go to any invoice
3. Select "Custom Transport" template
4. Click "Download PDF" or "Print"
5. Your logo should appear in the red circle at the top left!

## Logo Recommendations

- **Format**: PNG (supports transparency)
- **Size**: 200x200 pixels or larger (square)
- **Background**: Transparent or white
- **File Size**: Keep under 100KB for best performance

## Troubleshooting

**Logo not showing?**
- Check that the base64 string is complete (no line breaks)
- Make sure it starts with `data:image/png;base64,`
- Try a smaller image file
- Check browser console for errors

**Logo looks distorted?**
- Use a square image (same width and height)
- Try a higher resolution image

**Logo is too large?**
- Compress your image before converting to base64
- Use tools like TinyPNG.com to reduce file size

## Alternative: Use Image File Instead

If you prefer to use an image file instead of base64:

1. Place your logo in `frontend/public/logo.png`
2. In `frontend/src/assets/logo.ts`, change:
   ```typescript
   export const COMPANY_LOGO = '/logo.png';
   ```

Note: Base64 is recommended because it embeds the logo directly in the PDF, making it more portable.

## Need Help?

If you encounter any issues, check:
1. Browser console for error messages
2. Make sure the base64 string is valid
3. Try with a different image format (PNG, JPG)
