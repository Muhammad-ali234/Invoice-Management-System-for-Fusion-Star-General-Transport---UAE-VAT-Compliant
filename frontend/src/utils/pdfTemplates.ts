import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './formatting';
import { generateProfessionalTransportTemplate } from './professionalTemplate';

export interface CompanyInfo {
  name: string;
  nameArabic?: string;
  trn: string; // Tax Registration Number (CRITICAL for UAE VAT)
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  vatRate?: number;
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'custom';

/**
 * Template 1: Modern Blue (Default)
 * Professional blue theme with modern design
 */
export function generateModernTemplate(
  doc: jsPDF,
  invoice: Invoice,
  companyInfo: CompanyInfo
): jsPDF {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors - Modern Blue
  const primaryColor: [number, number, number] = [41, 128, 185]; // Blue
  const accentColor: [number, number, number] = [52, 152, 219]; // Light Blue
  const darkGray: [number, number, number] = [52, 73, 94];
  const lightGray: [number, number, number] = [236, 240, 241];

  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setFillColor(...accentColor);
  doc.rect(0, 35, pageWidth, 10, 'F');
  
  // Company logo/icon
  doc.setFontSize(36);
  doc.text('🚚', 15, 28);
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 40, 22);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Moving & Logistics Services', 40, 30);

  // Company details (right side)
  doc.setFontSize(9);
  let yPos = 18;
  if (companyInfo.phone) {
    doc.text(`📞 ${companyInfo.phone}`, pageWidth - 15, yPos, { align: 'right' });
    yPos += 5;
  }
  if (companyInfo.email) {
    doc.text(`✉️ ${companyInfo.email}`, pageWidth - 15, yPos, { align: 'right' });
    yPos += 5;
  }
  if (companyInfo.website) {
    doc.text(`🌐 ${companyInfo.website}`, pageWidth - 15, yPos, { align: 'right' });
  }

  // Reset text color
  doc.setTextColor(...darkGray);

  // Invoice title with modern styling
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 15, 60);
  
  // Invoice number with accent
  doc.setFillColor(...accentColor);
  doc.roundedRect(15, 65, 50, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.invoice_number, 40, 71.5, { align: 'center' });
  
  doc.setTextColor(...darkGray);

  // Dates section (right side with icons)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('📅 Invoice Date:', pageWidth - 75, 60);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(invoice.invoice_date), pageWidth - 15, 60, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('⏰ Due Date:', pageWidth - 75, 67);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(invoice.due_date), pageWidth - 15, 67, { align: 'right' });

  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    draft: [149, 165, 166],
    sent: [52, 152, 219],
    partially_paid: [241, 196, 15],
    paid: [46, 204, 113],
  };
  
  const statusColor = statusColors[invoice.status] || [149, 165, 166];
  doc.setFillColor(...statusColor);
  doc.roundedRect(pageWidth - 50, 72, 35, 9, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const statusText = invoice.status.replace('_', ' ').toUpperCase();
  doc.text(statusText, pageWidth - 32.5, 77.5, { align: 'center' });
  
  doc.setTextColor(...darkGray);

  // Bill To section with modern card design
  doc.setFillColor(...lightGray);
  doc.roundedRect(15, 88, 90, 38, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('BILL TO:', 20, 96);
  
  doc.setTextColor(...darkGray);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.customer_name, 20, 104);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  // Line items table with modern styling
  const tableStartY = 135;
  
  const tableData = invoice.lineItems?.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate),
    formatCurrency(item.amount),
  ]) || [];

  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'left',
    },
    styles: {
      fontSize: 9,
      cellPadding: 6,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 15, right: 15 },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });

  // Totals section
  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 50;
  const totalsX = pageWidth - 85;
  let totalsY = finalY + 12;

  // Totals box
  doc.setFillColor(...lightGray);
  doc.roundedRect(totalsX - 5, totalsY - 8, 75, 45, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', totalsX, totalsY);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 15, totalsY, { align: 'right' });
  totalsY += 7;

  if (invoice.discount_percent > 0) {
    doc.text(`Discount (${invoice.discount_percent}%):`, totalsX, totalsY);
    doc.text(`-${formatCurrency(invoice.discount_amount)}`, pageWidth - 15, totalsY, { align: 'right' });
    totalsY += 7;
  }

  if (invoice.tax_percent > 0) {
    doc.text(`Tax (${invoice.tax_percent}%):`, totalsX, totalsY);
    doc.text(formatCurrency(invoice.tax_amount), pageWidth - 15, totalsY, { align: 'right' });
    totalsY += 7;
  }

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(totalsX, totalsY, pageWidth - 15, totalsY);
  totalsY += 8;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('TOTAL:', totalsX, totalsY);
  doc.setFontSize(15);
  doc.text(formatCurrency(invoice.grand_total), pageWidth - 15, totalsY, { align: 'right' });

  doc.setTextColor(...darkGray);

  // Notes section
  if (invoice.notes) {
    totalsY += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 15, totalsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 30);
    doc.text(splitNotes, 15, totalsY + 6);
  }

  // Modern footer
  const footerY = pageHeight - 22;
  doc.setFillColor(...primaryColor);
  doc.rect(0, footerY - 5, pageWidth, 27, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Thank you for your business!', pageWidth / 2, footerY + 3, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('For any queries, please contact us at the details above.', pageWidth / 2, footerY + 9, { align: 'center' });

  return doc;
}

/**
 * Template 2: Classic Professional
 * Traditional black and white with elegant design
 */
export function generateClassicTemplate(
  doc: jsPDF,
  invoice: Invoice,
  companyInfo: CompanyInfo
): jsPDF {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors - Classic Black & White
  const black: [number, number, number] = [0, 0, 0];
  const darkGray: [number, number, number] = [60, 60, 60];
  const lightGray: [number, number, number] = [240, 240, 240];
  const borderGray: [number, number, number] = [180, 180, 180];

  // Simple header with border
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(2);
  doc.line(15, 25, pageWidth - 15, 25);

  // Company name - centered and elegant
  doc.setTextColor(...black);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, pageWidth / 2, 20, { align: 'center' });
  
  // Company details - centered
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  let yPos = 32;
  
  const details = [];
  if (companyInfo.address) details.push(companyInfo.address);
  if (companyInfo.phone) details.push(`Phone: ${companyInfo.phone}`);
  if (companyInfo.email) details.push(`Email: ${companyInfo.email}`);
  if (companyInfo.trn) details.push(`TRN: ${companyInfo.trn}`);
  
  details.forEach(detail => {
    doc.text(detail, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
  });

  // Invoice title - classic style
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...black);
  doc.text('INVOICE', pageWidth / 2, yPos + 10, { align: 'center' });

  // Invoice details box
  yPos += 20;
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, pageWidth - 30, 25);
  
  // Left side - Invoice info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 20, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, 55, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date:', 20, yPos + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(invoice.invoice_date), 55, yPos + 15);
  
  // Right side - Due date and status
  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', pageWidth - 70, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(invoice.due_date), pageWidth - 35, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', pageWidth - 70, yPos + 15);
  doc.setFont('helvetica', 'normal');
  const statusText = invoice.status.replace('_', ' ').toUpperCase();
  doc.text(statusText, pageWidth - 35, yPos + 15);

  // Bill To section
  yPos += 35;
  doc.setFillColor(...lightGray);
  doc.rect(15, yPos, 85, 30, 'F');
  doc.rect(15, yPos, 85, 30, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...black);
  doc.text('BILL TO:', 20, yPos + 8);
  
  doc.setFontSize(11);
  doc.text(invoice.customer_name, 20, yPos + 16);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  // Line items table - classic style
  const tableStartY = yPos + 40;
  
  const tableData = invoice.lineItems?.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate),
    formatCurrency(item.amount),
  ]) || [];

  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 10,
      lineWidth: 0.5,
      lineColor: [180, 180, 180],
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      lineWidth: 0.5,
      lineColor: [180, 180, 180],
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 15, right: 15 },
  });

  // Totals section - classic style
  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 50;
  const totalsX = pageWidth - 80;
  let totalsY = finalY + 10;

  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.rect(totalsX - 5, totalsY - 5, 70, 40);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);

  doc.text('Subtotal:', totalsX, totalsY + 3);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 15, totalsY + 3, { align: 'right' });
  totalsY += 7;

  if (invoice.discount_percent > 0) {
    doc.text(`Discount (${invoice.discount_percent}%):`, totalsX, totalsY);
    doc.text(`-${formatCurrency(invoice.discount_amount)}`, pageWidth - 15, totalsY, { align: 'right' });
    totalsY += 7;
  }

  if (invoice.tax_percent > 0) {
    doc.text(`Tax (${invoice.tax_percent}%):`, totalsX, totalsY);
    doc.text(formatCurrency(invoice.tax_amount), pageWidth - 15, totalsY, { align: 'right' });
    totalsY += 7;
  }

  doc.setLineWidth(1);
  doc.line(totalsX, totalsY + 2, pageWidth - 15, totalsY + 2);
  totalsY += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...black);
  doc.text('TOTAL:', totalsX, totalsY);
  doc.setFontSize(14);
  doc.text(formatCurrency(invoice.grand_total), pageWidth - 15, totalsY, { align: 'right' });

  // Notes
  if (invoice.notes) {
    totalsY += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 15, totalsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkGray);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 30);
    doc.text(splitNotes, 15, totalsY + 6);
  }

  // Classic footer
  const footerY = pageHeight - 20;
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(15, footerY, pageWidth - 15, footerY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  doc.text('Thank you for your business.', pageWidth / 2, footerY + 6, { align: 'center' });
  doc.text('For inquiries, please contact us at the details above.', pageWidth / 2, footerY + 11, { align: 'center' });

  return doc;
}

/**
 * Template 3: Minimal Clean
 * Ultra-clean minimalist design with green accents
 */
export function generateMinimalTemplate(
  doc: jsPDF,
  invoice: Invoice,
  companyInfo: CompanyInfo
): jsPDF {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors - Minimal with green accent
  const accentColor: [number, number, number] = [46, 204, 113]; // Green
  const darkText: [number, number, number] = [44, 62, 80];
  const lightText: [number, number, number] = [127, 140, 141];
  const veryLightGray: [number, number, number] = [250, 250, 250];

  // Minimal header - just company name
  doc.setTextColor(...darkText);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 15, 25);
  
  // Thin accent line
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(2);
  doc.line(15, 30, 80, 30);

  // Company details - minimal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  let yPos = 38;
  
  if (companyInfo.phone) {
    doc.text(companyInfo.phone, 15, yPos);
    yPos += 4;
  }
  if (companyInfo.email) {
    doc.text(companyInfo.email, 15, yPos);
    yPos += 4;
  }
  if (companyInfo.website) {
    doc.text(companyInfo.website, 15, yPos);
  }

  // Invoice title - minimal
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  doc.text('INVOICE', pageWidth - 15, 25, { align: 'right' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text(invoice.invoice_number, pageWidth - 15, 33, { align: 'right' });

  // Dates - minimal style
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  doc.text('Date:', pageWidth - 60, 42);
  doc.setTextColor(...darkText);
  doc.text(formatDate(invoice.invoice_date), pageWidth - 15, 42, { align: 'right' });
  
  doc.setTextColor(...lightText);
  doc.text('Due:', pageWidth - 60, 48);
  doc.setTextColor(...darkText);
  doc.text(formatDate(invoice.due_date), pageWidth - 15, 48, { align: 'right' });

  // Status - minimal badge
  const statusColors: Record<string, [number, number, number]> = {
    draft: [149, 165, 166],
    sent: [52, 152, 219],
    partially_paid: [241, 196, 15],
    paid: [46, 204, 113],
  };
  
  const statusColor = statusColors[invoice.status] || [149, 165, 166];
  doc.setFillColor(...statusColor);
  doc.circle(pageWidth - 10, 56, 3, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...darkText);
  const statusText = invoice.status.replace('_', ' ').toUpperCase();
  doc.text(statusText, pageWidth - 15, 56, { align: 'right' });

  // Bill To - minimal
  yPos = 70;
  doc.setFontSize(8);
  doc.setTextColor(...lightText);
  doc.text('BILL TO', 15, yPos);
  
  yPos += 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text(invoice.customer_name, 15, yPos);

  // Line items table - ultra minimal
  const tableStartY = 90;
  
  const tableData = invoice.lineItems?.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate),
    formatCurrency(item.amount),
  ]) || [];

  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: lightText,
      fontStyle: 'normal',
      fontSize: 9,
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: darkText,
    },
    columnStyles: {
      0: { cellWidth: 95 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Add subtle line after header
      doc.setDrawColor(...veryLightGray);
      doc.setLineWidth(0.5);
      doc.line(15, data.cursor!.y - 2, pageWidth - 15, data.cursor!.y - 2);
    },
  });

  // Totals - minimal style
  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 50;
  const totalsX = pageWidth - 70;
  let totalsY = finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);

  doc.text('Subtotal', totalsX, totalsY);
  doc.setTextColor(...darkText);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 15, totalsY, { align: 'right' });
  totalsY += 6;

  if (invoice.discount_percent > 0) {
    doc.setTextColor(...lightText);
    doc.text(`Discount (${invoice.discount_percent}%)`, totalsX, totalsY);
    doc.setTextColor(...darkText);
    doc.text(`-${formatCurrency(invoice.discount_amount)}`, pageWidth - 15, totalsY, { align: 'right' });
    totalsY += 6;
  }

  if (invoice.tax_percent > 0) {
    doc.setTextColor(...lightText);
    doc.text(`Tax (${invoice.tax_percent}%)`, totalsX, totalsY);
    doc.setTextColor(...darkText);
    doc.text(formatCurrency(invoice.tax_amount), pageWidth - 15, totalsY, { align: 'right' });
    totalsY += 6;
  }

  // Thin line before total
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1);
  doc.line(totalsX, totalsY + 2, pageWidth - 15, totalsY + 2);
  totalsY += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text('TOTAL', totalsX, totalsY);
  doc.setFontSize(16);
  doc.setTextColor(...accentColor);
  doc.text(formatCurrency(invoice.grand_total), pageWidth - 15, totalsY, { align: 'right' });

  // Notes - minimal
  if (invoice.notes) {
    totalsY += 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...lightText);
    doc.text('NOTES', 15, totalsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 30);
    doc.text(splitNotes, 15, totalsY + 5);
  }

  // Minimal footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  doc.text('Thank you for your business', pageWidth / 2, footerY, { align: 'center' });

  return doc;
}

// Export the professional template function
export { generateProfessionalTransportTemplate as generateCustomTransportTemplate };
