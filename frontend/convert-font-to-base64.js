/**
 * Convert Noto Sans Arabic font to base64 for jsPDF
 * Run this script: node convert-font-to-base64.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontPath = path.join(__dirname, 'src/assets/Noto_Sans_Arabic/NotoSansArabic-VariableFont_wdth,wght.ttf');
const outputPath = path.join(__dirname, 'src/assets/notoSansArabicFont.ts');

console.log('🔄 Converting Noto Sans Arabic font to base64...');
console.log('📁 Reading font file:', fontPath);

try {
  // Read the font file
  const fontBuffer = fs.readFileSync(fontPath);
  const fontBase64 = fontBuffer.toString('base64');
  
  console.log('✅ Font file read successfully');
  console.log('📊 Font size:', (fontBuffer.length / 1024).toFixed(2), 'KB');
  console.log('📊 Base64 size:', (fontBase64.length / 1024).toFixed(2), 'KB');
  
  // Create the TypeScript file
  const tsContent = `/**
 * Noto Sans Arabic Font - Base64 Encoded
 * Auto-generated from NotoSansArabic-VariableFont_wdth,wght.ttf
 * 
 * This font supports Arabic text rendering in PDF documents
 * Font: Noto Sans Arabic (Google Fonts)
 * License: Open Font License
 */

export const NOTO_SANS_ARABIC_FONT = '${fontBase64}';

export const ARABIC_FONT_NAME = 'NotoSansArabic';
`;

  // Write the TypeScript file
  fs.writeFileSync(outputPath, tsContent, 'utf8');
  
  console.log('✅ Font converted successfully!');
  console.log('📝 Output file:', outputPath);
  console.log('');
  console.log('Next steps:');
  console.log('1. The font is now ready to use');
  console.log('2. Import it in pdfTemplates-custom.ts');
  console.log('3. Add it to jsPDF using doc.addFileToVFS()');
  console.log('4. Use doc.setFont("NotoSansArabic") for Arabic text');
  
} catch (error) {
  console.error('❌ Error converting font:', error.message);
  console.error('');
  console.error('Make sure the font file exists at:');
  console.error(fontPath);
}
