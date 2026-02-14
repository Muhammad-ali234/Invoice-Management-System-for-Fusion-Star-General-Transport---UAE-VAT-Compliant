import { Link } from 'react-router-dom';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/utils/formatting';

interface InvoiceCardProps {
  invoice: Invoice;
}

/**
 * InvoiceCard component
 * Displays invoice summary in a card format
 */
export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className="block bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900">{invoice.invoice_number}</p>
          <p className="text-sm text-gray-600">{invoice.customer_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
          {getStatusLabel(invoice.status)}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{formatDate(invoice.invoice_date)}</span>
        <span className="font-semibold text-gray-900">{formatCurrency(invoice.grand_total)}</span>
      </div>
    </Link>
  );
}
