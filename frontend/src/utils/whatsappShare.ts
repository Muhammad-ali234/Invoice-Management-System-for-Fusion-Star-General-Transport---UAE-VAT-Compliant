import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './formatting';

/**
 * Share invoice PDF via WhatsApp
 * Note: WhatsApp Web API doesn't support file attachments directly.
 * This function will share the invoice details and provide instructions to download PDF.
 */
export function shareInvoicePDFViaWhatsApp(
  invoice: Invoice,
  pdfUrl?: string,
  phoneNumber?: string
): void {
  // Format message with PDF download instructions
  const message = formatInvoiceWithPDFLink(invoice, pdfUrl);
  
  const encodedMessage = encodeURIComponent(message);
  
  let whatsappUrl: string;
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  } else {
    whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  }
  
  window.open(whatsappUrl, '_blank');
}

/**
 * Format invoice message with PDF download link
 */
function formatInvoiceWithPDFLink(invoice: Invoice, pdfUrl?: string): string {
  const lines: string[] = [];
  
  lines.push('🚚 *INVOICE FROM MOVERS INVOICE PRO*');
  lines.push('');
  lines.push(`📄 *Invoice:* ${invoice.invoice_number}`);
  lines.push(`👤 *Client:* ${invoice.customer_name}`);
  lines.push(`💰 *Amount:* ${formatCurrency(invoice.grand_total)}`);
  lines.push(`📅 *Due Date:* ${formatDate(invoice.due_date)}`);
  lines.push('');
  
  if (pdfUrl) {
    lines.push('📥 *Download PDF Invoice:*');
    lines.push(pdfUrl);
    lines.push('');
  } else {
    lines.push('📥 *PDF Invoice attached separately*');
    lines.push('');
  }
  
  lines.push('*SERVICES:*');
  lines.push('─────────────────');
  
  invoice.lineItems?.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.description}`);
    lines.push(`   ${item.quantity} × ${formatCurrency(item.rate)} = ${formatCurrency(item.amount)}`);
  });
  
  lines.push('');
  lines.push('*TOTAL:*');
  lines.push(`💰 ${formatCurrency(invoice.grand_total)}`);
  lines.push('');
  lines.push('Thank you for your business! 🙏');
  
  return lines.join('\n');
}

/**
 * Share invoice details via WhatsApp
 */
export function shareInvoiceViaWhatsApp(
  invoice: Invoice,
  phoneNumber?: string,
  includeLink?: boolean
): void {
  // Format invoice message
  const message = formatInvoiceMessage(invoice, includeLink);
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  let whatsappUrl: string;
  
  if (phoneNumber) {
    // Remove all non-numeric characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    // WhatsApp API URL with phone number
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  } else {
    // WhatsApp Web URL without specific number
    whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  }
  
  // Open WhatsApp in new window
  window.open(whatsappUrl, '_blank');
}

/**
 * Format invoice details as WhatsApp message
 */
function formatInvoiceMessage(invoice: Invoice, includeLink?: boolean): string {
  const lines: string[] = [];
  
  // Header
  lines.push('🚚 *INVOICE FROM MOVERS INVOICE PRO*');
  lines.push('');
  
  // Invoice details
  lines.push(`📄 *Invoice:* ${invoice.invoice_number}`);
  lines.push(`📅 *Date:* ${formatDate(invoice.invoice_date)}`);
  lines.push(`⏰ *Due Date:* ${formatDate(invoice.due_date)}`);
  lines.push(`👤 *Client:* ${invoice.customer_name}`);
  lines.push('');
  
  // Status
  const statusEmoji = {
    draft: '📝',
    sent: '📤',
    partially_paid: '💵',
    paid: '✅',
  };
  const emoji = statusEmoji[invoice.status] || '📄';
  const statusText = invoice.status.replace('_', ' ').toUpperCase();
  lines.push(`${emoji} *Status:* ${statusText}`);
  lines.push('');
  
  // Line items
  lines.push('*SERVICES:*');
  lines.push('─────────────────');
  
  invoice.lineItems?.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.description}`);
    lines.push(`   Qty: ${item.quantity} × ${formatCurrency(item.rate)} = ${formatCurrency(item.amount)}`);
  });
  
  lines.push('');
  
  // Totals
  lines.push('*AMOUNT BREAKDOWN:*');
  lines.push('─────────────────');
  lines.push(`Subtotal: ${formatCurrency(invoice.subtotal)}`);
  
  if (invoice.discount_percent > 0) {
    lines.push(`Discount (${invoice.discount_percent}%): -${formatCurrency(invoice.discount_amount)}`);
  }
  
  if (invoice.tax_percent > 0) {
    lines.push(`Tax (${invoice.tax_percent}%): ${formatCurrency(invoice.tax_amount)}`);
  }
  
  lines.push('');
  lines.push(`💰 *TOTAL AMOUNT: ${formatCurrency(invoice.grand_total)}*`);
  
  // Notes
  if (invoice.notes) {
    lines.push('');
    lines.push('*NOTES:*');
    lines.push(invoice.notes);
  }
  
  // Footer
  lines.push('');
  lines.push('─────────────────');
  lines.push('Thank you for your business! 🙏');
  
  if (includeLink) {
    lines.push('');
    lines.push('View invoice online: [Your website URL]');
  }
  
  return lines.join('\n');
}

/**
 * Share invoice summary (shorter version)
 */
export function shareInvoiceSummaryViaWhatsApp(
  invoice: Invoice,
  phoneNumber?: string
): void {
  const message = `🚚 *Invoice ${invoice.invoice_number}*\n\n` +
    `Client: ${invoice.customer_name}\n` +
    `Amount: ${formatCurrency(invoice.grand_total)}\n` +
    `Due: ${formatDate(invoice.due_date)}\n` +
    `Status: ${invoice.status.replace('_', ' ').toUpperCase()}\n\n` +
    `Thank you for your business!`;
  
  const encodedMessage = encodeURIComponent(message);
  
  let whatsappUrl: string;
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  } else {
    whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  }
  
  window.open(whatsappUrl, '_blank');
}

/**
 * Share payment reminder via WhatsApp
 */
export function sharePaymentReminderViaWhatsApp(
  invoice: Invoice,
  remainingAmount: number,
  phoneNumber?: string
): void {
  const message = `🚚 *Payment Reminder*\n\n` +
    `Dear ${invoice.customer_name},\n\n` +
    `This is a friendly reminder about invoice ${invoice.invoice_number}.\n\n` +
    `📄 Invoice Amount: ${formatCurrency(invoice.grand_total)}\n` +
    `💰 Remaining Balance: ${formatCurrency(remainingAmount)}\n` +
    `📅 Due Date: ${formatDate(invoice.due_date)}\n\n` +
    `Please make the payment at your earliest convenience.\n\n` +
    `Thank you! 🙏`;
  
  const encodedMessage = encodeURIComponent(message);
  
  let whatsappUrl: string;
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  } else {
    whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  }
  
  window.open(whatsappUrl, '_blank');
}
