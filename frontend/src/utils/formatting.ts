import { format } from 'date-fns';

/**
 * Format currency in PKR
 * Example: 1000 => "Rs 1,000"
 */
export function formatCurrency(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK', { maximumFractionDigits: 2 })}`;
}

/**
 * Format date for display
 * Example: 2024-01-15 => "15 Jan 2024"
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format date for input fields
 * Example: 2024-01-15 => "2024-01-15"
 */
export function formatDateForInput(date: Date | string): string {
  if (!date) return '';
  try {
    return format(new Date(date), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Get status badge color based on invoice/quote status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-200 text-gray-800';
    case 'sent':
      return 'bg-blue-200 text-blue-800';
    case 'partially_paid':
      return 'bg-yellow-200 text-yellow-800';
    case 'paid':
      return 'bg-green-200 text-green-800';
    case 'overdue':
      return 'bg-red-200 text-red-800';
    // Quote statuses
    case 'approved':
      return 'bg-green-200 text-green-800';
    case 'rejected':
      return 'bg-red-200 text-red-800';
    case 'expired':
      return 'bg-gray-200 text-gray-800';
    case 'converted':
      return 'bg-purple-200 text-purple-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'sent':
      return 'Sent';
    case 'partially_paid':
      return 'Partially Paid';
    case 'paid':
      return 'Paid';
    case 'overdue':
      return 'Overdue';
    // Quote statuses
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'expired':
      return 'Expired';
    case 'converted':
      return 'Converted';
    default:
      return status;
  }
}

/**
 * Get payment method label in bilingual format
 */
export function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'cash':
      return 'Cash / Cash';
    case 'bank_transfer':
      return 'Bank Transfer / Bank Transfer';
    case 'other':
      return 'Other / Aur';
    default:
      return method;
  }
}
