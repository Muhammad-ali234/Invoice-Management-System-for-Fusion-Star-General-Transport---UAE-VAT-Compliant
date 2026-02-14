import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '@/types';
import { CompanyInfo } from './pdfTemplates';
import { COMPANY_LOGO } from '@/assets/logo';

// ===== ARABIC SUPPORT – uncomment if you have installed the libraries =====
// import 'jspdf-arabic';
// import arabicReshaper from 'arabic-reshaper';
// =========================================================================

/**
 * Generate Professional Transport Invoice PDF – exact replica of the provided image.
 */
export function generateProfessionalTransportTemplate(
  doc: jsPDF,
  invoice: Invoice,
  companyInfo: CompanyInfo
): jsPDF {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors – from original image
  const darkGrey: [number, number, number] = [38, 38, 38];   // #262626
  const red: [number, number, number] = [220, 38, 38];      // #DC2626

  // ===== TOP HEADER LINES =====
  doc.setLineWidth(1.5);
  doc.setDrawColor(red[0], red[1], red[2]);
  doc.line(15, 12, pageWidth - 15, 12); // Top red line

  doc.setLineWidth(1);
  doc.setDrawColor(darkGrey[0], darkGrey[1], darkGrey[2]);
  doc.line(15, 60, pageWidth - 15, 60); // Bottom dark grey line

  // ===== LOGO – Circle with red border =====
  const logoX = 15;
  const logoY = 17;
  const logoSize = 35;
  const centerX = logoX + logoSize / 2;
  const centerY = logoY + logoSize / 2;

  // Outer red circle
  doc.setFillColor(red[0], red[1], red[2]);
  doc.circle(centerX, centerY, logoSize / 2, 'F');

  // White inner circle
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, centerY, logoSize / 2 - 2.5, 'F');

  // Logo image (your base64)
  if (COMPANY_LOGO && COMPANY_LOGO.startsWith('data:image/')) {
    try {
      doc.addImage(
        COMPANY_LOGO,
        'PNG',
        logoX + 2.5,
        logoY + 2.5,
        logoSize - 5,
        logoSize - 5,
        undefined,
        'NONE'
      );
    } catch (error) {
      console.warn('Header logo failed to load:', error);
      // fallback: subtle circle
      doc.setFillColor(red[0], red[1], red[2]);
      doc.circle(centerX, centerY, 5, 'F');
    }
  }

  // ===== BACKGROUND WATERMARK =====
  if (COMPANY_LOGO && COMPANY_LOGO.startsWith('data:image/')) {
    try {
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.05 })); // Very faded
      doc.addImage(
        COMPANY_LOGO,
        'PNG',
        pageWidth / 4,
        pageHeight / 3,
        pageWidth / 2,
        pageWidth / 2,
        undefined,
        'FAST'
      );
      doc.restoreGraphicsState();
    } catch (e) {
      console.warn('Watermark failed to load:', e);
    }
  }

  // ===== COMPANY NAME (English) =====
  const namesX = logoX + logoSize + 12;

  // "FUSION STAR" (bold, 30pt)
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('FUSION STAR', namesX, logoY + 18);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('GENERAL TRANSPORT - L.L.C - O.P.C', namesX, logoY + 27);

  // ===== ARABIC TEXT – TOP RIGHT =====
  // doc.text('فيوسان ستار للنقليات العامة - ذ.م.م - ش.ش.و', pageWidth - 20, logoY + 8, { align: 'right' });

  // ===== INVOICE TITLE =====
  doc.setTextColor(0, 0, 0); // Pure black
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, 75, { align: 'center' });

  // ===== DATE & INVOICE INFO =====
  const infoY = 95;

  // Dated (left)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Dated:', 20, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.invoice_date).toLocaleDateString('en-GB'), 45, infoY);

  // Invoice No & Month (right, stacked)
  const rightX = pageWidth - 20;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice No:', rightX - 85, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, rightX, infoY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Month:', rightX - 85, infoY + 8);
  doc.setFont('helvetica', 'normal');
  const monthYear = new Date(invoice.invoice_date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  doc.text(monthYear, rightX, infoY + 8, { align: 'right' });

  // ===== CUSTOMER INFO – "Ref To:" =====
  const customerY = 125;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Ref To:', 20, customerY);

  // Customer name (bold)
  doc.text(invoice.customer_name, 20, customerY + 10);

  // Customer address – exactly as in the image
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const address = invoice.customer_address || 'Abdra BRT Stop, Peshawar, KPK';
  doc.text(address, 20, customerY + 18);

  // ===== ITEMS TABLE – single row, AED on same line =====
  const tableStartY = 155;

  const tableData = invoice.lineItems!.map((item, index) => [
    (index + 1).toString(),
    item.description,
    Number(item.quantity).toString().padStart(2, '0'),
    `${Number(item.amount).toLocaleString()}\nAED`,   // AED on new line as in image
  ]);

  // Ensure at least two rows as in the image for better layout
  if (tableData.length === 1) {
    tableData.push(['2', '', '', '']);
  }

  autoTable(doc, {
    startY: tableStartY,
    head: [['S/No', 'Description', 'Quantity', 'Amount']],
    body: tableData,
    foot: [[{
      content: `${numberToWords(Number(invoice.grand_total))} Dirhams Only`,
      colSpan: 4,
      styles: { halign: 'center', fontStyle: 'bold', fontSize: 11, minCellHeight: 15, valign: 'middle' }
    }]],
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.8,
      lineColor: [0, 0, 0],
      halign: 'center',
      fontSize: 11,
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      lineWidth: 0.8,
      lineColor: [0, 0, 0],
      halign: 'center',
      valign: 'middle',
      minCellHeight: 20,
      fontSize: 10,
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.8,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 'auto', halign: 'left', cellPadding: { left: 10 } },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 50, halign: 'center' },
    },
    margin: { left: 20, right: 20 },
  });

  // ===== FOOTER (Fixed at the bottom) =====
  const bottomRedLineY = pageHeight - 15;
  const paddingAboveLine = 2;

  const contactData = [
    companyInfo.address,
    companyInfo.website,
    companyInfo.email,
    companyInfo.phone
  ].filter(Boolean);

  // Calculate total height of contact info block
  let totalContactHeight = 0;
  contactData.forEach((item, index) => {
    const lines = doc.splitTextToSize(item!, 80);
    totalContactHeight += lines.length * 4.5;
    if (index < contactData.length - 1) totalContactHeight += 1;
  });

  // Calculate start Y for contact info so it "sticks" to the red line
  let contactY = bottomRedLineY - totalContactHeight - paddingAboveLine + 2; // +2 to adjust for baseline
  const contactX = pageWidth - 20;

  // "Sign & Stamp" (left)
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Sign & Stamp', 20, bottomRedLineY - 10);

  // Contact info (right)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  contactData.forEach((item) => {
    const lines = doc.splitTextToSize(item!, 80);
    lines.forEach((line: string) => {
      doc.text(line, contactX, contactY, { align: 'right' });
      contactY += 4.5;
    });
    contactY += 1;
  });

  // ===== BOTTOM LINES =====
  doc.setLineWidth(2);
  doc.setDrawColor(red[0], red[1], red[2]);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15); // Bottom red line

  return doc;
}

/**
 * Convert number to English words (supports up to millions)
 */
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
  return num.toFixed(0);
}