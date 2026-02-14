import jsPDF from 'jspdf';
import { Invoice } from '@/types';
import { generateCustomTransportPDF } from './pdfTemplates-custom';

export interface CompanyInfo {
  name: string;
  nameArabic?: string;
  trn: string; // Tax Registration Number (CRITICAL for UAE VAT)
  address: string;
  phone: string;
  email: string;
  website?: string;
  vatRate?: number;
}

/**
 * Generate professional PDF invoice
 * Uses Custom Transport template (VAT compliant)
 */
export async function generateInvoicePDF(
  invoice: Invoice,
  companyInfo?: CompanyInfo
): Promise<jsPDF> {
  try {
    console.log('📄 Generating PDF...', { 
      invoiceNumber: invoice.invoice_number,
      hasLineItems: !!invoice.lineItems,
      lineItemsCount: invoice.lineItems?.length 
    });
    
    const defaultCompanyInfo: CompanyInfo = {
      name: companyInfo?.name || 'Your Company Name',
      trn: companyInfo?.trn || '000000000000000',
      address: companyInfo?.address || '',
      phone: companyInfo?.phone || '',
      email: companyInfo?.email || '',
      website: companyInfo?.website,
      nameArabic: companyInfo?.nameArabic,
      vatRate: companyInfo?.vatRate || 5.00,
    };

    console.log('✅ Company info prepared:', defaultCompanyInfo);

    // Generate PDF using Custom Transport template (VAT compliant)
    const doc = generateCustomTransportPDF(invoice, defaultCompanyInfo);
    console.log('✅ PDF generated successfully');
    return doc;
  } catch (error) {
    console.error('❌ Error in generateInvoicePDF:', error);
    throw error;
  }
}

/**
 * Download invoice as PDF
 */
export async function downloadInvoicePDF(
  invoice: Invoice,
  companyInfo?: CompanyInfo
): Promise<void> {
  const doc = await generateInvoicePDF(invoice, companyInfo);
  doc.save(`${invoice.invoice_number}.pdf`);
}

/**
 * Get PDF as blob for sharing
 */
export async function getInvoicePDFBlob(
  invoice: Invoice,
  companyInfo?: CompanyInfo
): Promise<Blob> {
  const doc = await generateInvoicePDF(invoice, companyInfo);
  return doc.output('blob');
}

/**
 * Print invoice PDF
 */
export async function printInvoicePDF(
  invoice: Invoice,
  companyInfo?: CompanyInfo
): Promise<void> {
  const doc = await generateInvoicePDF(invoice, companyInfo);
  
  // Open in new window for printing
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// Note: CompanyInfo interface is already exported above
