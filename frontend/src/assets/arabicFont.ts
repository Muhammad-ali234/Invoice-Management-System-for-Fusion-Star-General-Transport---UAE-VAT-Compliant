/**
 * Arabic Font for PDF Generation
 * 
 * This file contains a base64-encoded Arabic font (Amiri Regular)
 * Amiri is an open-source classical Arabic typeface
 * 
 * To use a different font:
 * 1. Download .ttf file from Google Fonts
 * 2. Convert to base64 using: https://products.aspose.app/font/base64
 * 3. Replace the FONT_BASE64 string below
 * 4. Update FONT_NAME if needed
 */

// Font name to use in jsPDF
export const ARABIC_FONT_NAME = 'Amiri';

// Note: Due to file size, you need to add the actual base64 font data here
// For now, this is a placeholder. Follow these steps:

// STEP 1: Download Amiri font
// Go to: https://fonts.google.com/specimen/Amiri
// Click "Download family" and extract Amiri-Regular.ttf

// STEP 2: Convert to Base64
// Go to: https://products.aspose.app/font/base64
// Upload Amiri-Regular.ttf
// Copy the base64 output

// STEP 3: Paste the base64 string below
export const ARABIC_FONT_BASE64 = '';

// Temporary: Using a minimal Arabic font subset
// This is a very small subset - for full support, follow steps above
export const hasArabicFont = () => {
  return ARABIC_FONT_BASE64.length > 0;
};
