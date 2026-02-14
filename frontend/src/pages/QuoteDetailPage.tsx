import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { useQuotes } from '@/hooks/useQuotes';
import { Quote } from '@/types';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/utils/formatting';

export function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuote, deleteQuote, updateQuoteStatus, convertToInvoice } = useQuotes();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    const quoteData = await getQuote(parseInt(id));
    if (!quoteData) {
      alert('Quote not found');
      navigate('/quotes');
      return;
    }
    setQuote(quoteData);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!quote || !confirm('Delete this quote?')) return;
    await deleteQuote(quote.id);
    navigate('/quotes');
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!quote) return;
    await updateQuoteStatus(quote.id, newStatus);
    await loadData();
  };

  const handleConvertToInvoice = async () => {
    if (!quote || !confirm('Convert this quote to an invoice?')) return;
    
    setConverting(true);
    try {
      const result = await convertToInvoice(quote.id);
      alert('Quote converted to invoice successfully!');
      navigate(`/invoices/${result.invoice.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to convert quote');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Quote">
        <Loading />
      </Layout>
    );
  }

  if (!quote) return null;

  const isExpired = new Date(quote.expiry_date) < new Date() && quote.status !== 'converted' && quote.status !== 'approved';
  const canConvert = quote.status === 'approved' || quote.status === 'sent';
  const canEdit = quote.status === 'draft';

  return (
    <Layout
      title={`Quote ${quote.quote_number}`}
      actions={
        <div className="flex gap-2 flex-wrap items-center">
          {canEdit && (
            <Button variant="secondary" onClick={() => navigate(`/quotes/${id}/edit`)}>
              Edit
            </Button>
          )}
          
          {quote.status === 'draft' && (
            <Button variant="secondary" onClick={() => handleStatusChange('sent')}>
              Mark as Sent
            </Button>
          )}
          
          {quote.status === 'sent' && (
            <>
              <Button variant="secondary" onClick={() => handleStatusChange('approved')}>
                ✓ Approve
              </Button>
              <Button variant="secondary" onClick={() => handleStatusChange('rejected')}>
                ✗ Reject
              </Button>
            </>
          )}
          
          {canConvert && (
            <Button onClick={handleConvertToInvoice} disabled={converting}>
              {converting ? 'Converting...' : '📄 Convert to Invoice'}
            </Button>
          )}
          
          {quote.status === 'draft' && (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quote Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{quote.quote_number}</h2>
              <div className="flex gap-2 mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
                {isExpired && quote.status !== 'expired' && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                    Expired
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Quote Date: {formatDate(quote.quote_date)}</p>
              <p className="text-sm text-gray-600">Expiry Date: {formatDate(quote.expiry_date)}</p>
              {isExpired && (
                <p className="text-sm text-red-600 font-semibold mt-1">⚠️ This quote has expired</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Quote For:</h3>
            <p className="font-medium">{quote.customer_name}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Qty</th>
                <th className="text-right pb-2">Rate</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems?.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-4 text-right">Subtotal:</td>
                <td className="pt-4 text-right font-semibold">{formatCurrency(quote.subtotal)}</td>
              </tr>
              {quote.discount_percent > 0 && (
                <tr>
                  <td colSpan={3} className="text-right">Discount ({quote.discount_percent}%):</td>
                  <td className="text-right">-{formatCurrency(quote.discount_amount)}</td>
                </tr>
              )}
              {quote.tax_percent > 0 && (
                <tr>
                  <td colSpan={3} className="text-right">Tax ({quote.tax_percent}%):</td>
                  <td className="text-right">{formatCurrency(quote.tax_amount)}</td>
                </tr>
              )}
              <tr className="text-lg font-bold border-t-2">
                <td colSpan={3} className="pt-4 text-right">Total Amount:</td>
                <td className="pt-4 text-right">{formatCurrency(quote.grand_total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-700">{quote.notes}</p>
          </div>
        )}

        {/* Status Info */}
        {quote.status === 'converted' && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-purple-800">
              ✓ This quote has been converted to an invoice.
            </p>
          </div>
        )}

        {quote.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-green-800">
              ✓ This quote has been approved. You can now convert it to an invoice.
            </p>
          </div>
        )}

        {quote.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800">
              ✗ This quote has been rejected.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
