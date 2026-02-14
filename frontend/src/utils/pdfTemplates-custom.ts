import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '@/types';
import { COMPANY_LOGO } from '@/assets/logo';
import { NOTO_SANS_ARABIC_FONT, ARABIC_FONT_NAME } from '@/assets/notoSansArabicFont';

interface CompanyInfo {
  name: string;
  nameArabic?: string;
  trn: string; // Tax Registration Number (CRITICAL)
  phone: string;
  email: string;
  address: string;
  website?: string;
  vatRate?: number;
}

/**
 * Convert number to words (for amount in words)
 */
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const numStr = Math.floor(num).toString();
  const len = numStr.length;

  if (len > 9) return 'Amount Too Large';

  const n = ('000000000' + numStr).substr(-9).match(/.{1,3}/g);
  if (!n) return '';

  let str = '';
  const scale = ['', 'Thousand', 'Million'];

  for (let i = 0; i < n.length; i++) {
    const chunk = parseInt(n[i]);
    if (chunk === 0) continue;

    const hundreds = Math.floor(chunk / 100);
    const remainder = chunk % 100;
    const tensDigit = Math.floor(remainder / 10);
    const onesDigit = remainder % 10;

    if (hundreds > 0) {
      str += ones[hundreds] + ' Hundred ';
    }

    if (remainder >= 10 && remainder < 20) {
      str += teens[remainder - 10] + ' ';
    } else {
      if (tensDigit > 0) {
        str += tens[tensDigit] + ' ';
      }
      if (onesDigit > 0) {
        str += ones[onesDigit] + ' ';
      }
    }

    if (scale[2 - i]) {
      str += scale[2 - i] + ' ';
    }
  }

  return str.trim();
}

/**
 * Generate Custom Transport Invoice PDF (Fusion Star Style)
 * UAE VAT Compliant - Shows TAX INVOICE with TRN
 */
export function generateCustomTransportPDF(
  invoice: Invoice,
  companyInfo: CompanyInfo
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add Arabic font to jsPDF
  doc.addFileToVFS(`${ARABIC_FONT_NAME}.ttf`, NOTO_SANS_ARABIC_FONT);
  doc.addFont(`${ARABIC_FONT_NAME}.ttf`, ARABIC_FONT_NAME, 'normal');

  // Professional Colors
  const darkGrey = [64, 64, 64]; // Dark grey instead of black
  const red = [220, 38, 38];
  const white = [255, 255, 255];
  const lightGray = [245, 245, 245];

  // ============================================
  // HEADER - Professional Dark Grey with Red Accent
  // ============================================
  
  // Dark grey header background
  doc.setFillColor(darkGrey[0], darkGrey[1], darkGrey[2]);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Red accent stripe at top
  doc.setFillColor(red[0], red[1], red[2]);
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  // Red accent stripe at bottom of header
  doc.setFillColor(red[0], red[1], red[2]);
  doc.rect(0, 42, pageWidth, 3, 'F');

  // ============================================
  // LOGO - Left side of header
  // ============================================
  try {
    // Add logo (50x50 size, positioned at 15, 10)
    doc.addImage(COMPANY_LOGO, 'PNG', 15, 8, 30, 30);
  } catch (error) {
    console.warn('Logo could not be added:', error);
  }

  // ============================================
  // COMPANY NAME - Center/Right of header
  // ============================================
  
  // Company name in Arabic (if available) - small white text with Arabic font
  if (companyInfo.nameArabic) {
    doc.setFontSize(9);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont(ARABIC_FONT_NAME, 'normal');
    doc.text(companyInfo.nameArabic, pageWidth - 15, 15, { align: 'right' });
  }

  // Company name in English - LARGE BOLD WHITE
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(companyInfo.name.toUpperCase(), pageWidth - 15, 25, { align: 'right' });

  // TRN - White text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(`TRN: ${companyInfo.trn}`, pageWidth - 15, 35, { align: 'right' });

  // ============================================
  // INVOICE TITLE - TAX INVOICE (Red, centered)
  // ============================================
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(red[0], red[1], red[2]);
  doc.text('TAX INVOICE', pageWidth / 2, 60, { align: 'center' });

  // ============================================
  // DATE & INVOICE INFO (Two columns)
  // ============================================
  const infoY = 75;
  
  // Left column - Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGrey[0], darkGrey[1], darkGrey[2]);
  doc.text('Invoice No:', 20, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, 50, infoY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 20, infoY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.invoice_date).toLocaleDateString('en-GB'), 50, infoY + 7);

  // Right column - Due date and month
  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', pageWidth - 80, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.due_date).toLocaleDateString('en-GB'), pageWidth - 40, infoY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Month:', pageWidth - 80, infoY + 7);
  doc.setFont('helvetica', 'normal');
  const monthYear = new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  doc.text(monthYear, pageWidth - 40, infoY + 7);

  // ============================================
  // CUSTOMER INFO (Bill To)
  // ============================================
  const customerY = 95;
  
  // Light gray background box
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, customerY - 5, pageWidth - 40, 20, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGrey[0], darkGrey[1], darkGrey[2]);
  doc.text('Bill To:', 25, customerY + 3);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.customer_name, 25, customerY + 10);
  
  // Customer TRN if available
  if (invoice.customer_trn) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`TRN: ${invoice.customer_trn}`, pageWidth - 25, customerY + 10, { align: 'right' });
  }

  // ============================================
  // ITEMS TABLE WITH VAT BREAKDOWN
  // ============================================
  const tableStartY = 125;

  // Calculate VAT breakdown
  const subtotal = Number(invoice.subtotal);
  const vatRate = Number(invoice.vat_rate || companyInfo.vatRate || 5);
  const vatAmount = Number(invoice.tax_amount);
  const total = Number(invoice.grand_total);

  autoTable(doc, {
    startY: tableStartY,
    head: [['S/No', 'Description', 'Quantity', 'Amount (AED)']],
    body: [
      ...invoice.lineItems!.map((item, index) => [
        (index + 1).toString(),
        item.description,
        Number(item.quantity).toString().padStart(2, '0'),
        Number(item.amount).toFixed(2)
      ]),
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255], // White background
      textColor: [0, 0, 0], // Black text
      fontStyle: 'bold',
      lineWidth: 0.3,
      lineColor: [0, 0, 0], // Black border
      halign: 'center',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      lineWidth: 0.3,
      lineColor: [0, 0, 0], // Black border
      halign: 'center',
      valign: 'middle',
      minCellHeight: 15,
    },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 90, halign: 'left' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  // VAT Breakdown (right-aligned)
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const rightX = pageWidth - 20;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Subtotal
  doc.text('Subtotal:', rightX - 60, finalY);
  doc.text(`${subtotal.toFixed(2)} AED`, rightX, finalY, { align: 'right' });
  
  // VAT
  doc.text(`VAT (${vatRate}%):`, rightX - 60, finalY + 7);
  doc.text(`${vatAmount.toFixed(2)} AED`, rightX, finalY + 7, { align: 'right' });
  
  // Line
  doc.setLineWidth(0.5);
  doc.line(rightX - 65, finalY + 10, rightX, finalY + 10);
  
  // Total (bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', rightX - 60, finalY + 17);
  doc.text(`${total.toFixed(2)} AED`, rightX, finalY + 17, { align: 'right' });
  
  // Amount in words
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(60, 60, 60);
  const amountInWords = numberToWords(total);
  doc.text(`Amount in Words: ${amountInWords} Dirhams Only`, 20, finalY + 25);

  // ============================================
  // SIGNATURE SECTION - Above Footer
  // ============================================
  const signatureY = pageHeight - 65; // Adjusted for taller footer
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGrey[0], darkGrey[1], darkGrey[2]);
  doc.text('Authorized Signature & Stamp', 20, signatureY);
  
  // Draw a line for signature
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, signatureY + 15, 80, signatureY + 15);

  // ============================================
  // FOOTER - Professional Dark Grey with Red Accent
  // ============================================
  const footerStartY = pageHeight - 45; // Taller footer for address
  
  // Dark grey footer background
  doc.setFillColor(darkGrey[0], darkGrey[1], darkGrey[2]);
  doc.rect(0, footerStartY, pageWidth, 45, 'F');
  
  // Red accent stripe at top of footer
  doc.setFillColor(red[0], red[1], red[2]);
  doc.rect(0, footerStartY, pageWidth, 3, 'F');
  
  // Red accent stripe at bottom
  doc.setFillColor(red[0], red[1], red[2]);
  doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');

  // Footer content - White text
  doc.setTextColor(white[0], white[1], white[2]);
  
  let footerY = footerStartY + 10;
  const centerX = pageWidth / 2;
  const leftMargin = 15;
  const rightMargin = pageWidth - 15;
  
  // Line 1: Phone | Email | Website
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  if (companyInfo.phone) {
    doc.text(`Phone: ${companyInfo.phone}`, leftMargin, footerY);
  }
  
  if (companyInfo.email) {
    doc.text(`Email: ${companyInfo.email}`, centerX, footerY, { align: 'center' });
  }
  
  if (companyInfo.website) {
    doc.text(`Web: ${companyInfo.website}`, rightMargin, footerY, { align: 'right' });
  }
  
  // Line 2 & 3: Address (with proper wrapping and spacing)
  if (companyInfo.address) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    
    // Calculate available width (leave margins on both sides)
    const availableWidth = pageWidth - 30;
    
    // Split address into lines that fit
    const addressLines = doc.splitTextToSize(companyInfo.address, availableWidth);
    
    // Start address below contact info
    let addressY = footerY + 6;
    
    // Draw each line centered
    for (let i = 0; i < addressLines.length && i < 3; i++) { // Max 3 lines
      doc.text(addressLines[i], centerX, addressY, { align: 'center' });
      addressY += 4.5; // Spacing between lines
    }
  }

  return doc;
}
