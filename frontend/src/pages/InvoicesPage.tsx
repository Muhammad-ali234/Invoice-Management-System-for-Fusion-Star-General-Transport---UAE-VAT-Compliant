import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { useInvoices } from '@/hooks/useInvoices';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/utils/formatting';
import { shareInvoiceSummaryViaWhatsApp } from '@/utils/whatsappShare';
import { downloadInvoicePDF } from '@/utils/pdfGenerator';
import { getSettings } from './SettingsPage';

export function InvoicesPage() {
  const { invoices, loading, deleteInvoice } = useInvoices();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: any) => {
    if (confirm('Delete this invoice?')) {
      await deleteInvoice(id);
    }
  };

  const handleQuickShare = (e: React.MouseEvent, invoice: any) => {
    e.stopPropagation();
    shareInvoiceSummaryViaWhatsApp(invoice);
  };

  const handleQuickDownload = async (e: React.MouseEvent, invoice: any) => {
    e.stopPropagation();
    try {
      const settings = await getSettings();
      await downloadInvoicePDF(invoice, {
        name: settings.companyName,
        nameArabic: settings.companyNameArabic,
        trn: settings.trnNumber,
        phone: settings.companyPhone,
        email: settings.companyEmail,
        address: settings.companyAddress,
        website: settings.companyWebsite,
        vatRate: settings.vatRate,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  return (
    <Layout
      title="Invoices"
      actions={
        <Button onClick={() => navigate('/invoices/new')}>
          + New Invoice
        </Button>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
            </select>
            <input
              type="text"
              placeholder="Search by customer or invoice number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Invoices Table */}
          {filteredInvoices.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">No invoices found</p>
              <Button onClick={() => navigate('/invoices/new')}>
                Create your first invoice
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id.toString()}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.invoice_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(invoice.invoice_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(invoice.grand_total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Link to={`/invoices/${invoice.id}`} className="text-gray-600 hover:text-gray-900">
                          View
                        </Link>
                        <button
                          onClick={(e) => handleQuickDownload(e, invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download PDF"
                        >
                          📥
                        </button>
                        <button
                          onClick={(e) => handleQuickShare(e, invoice)}
                          className="text-green-600 hover:text-green-900"
                          title="Share via WhatsApp"
                        >
                          💬
                        </button>
                        {invoice.status === 'draft' && (
                          <>
                            <Link to={`/invoices/${invoice.id}/edit`} className="text-gray-600 hover:text-gray-900">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(invoice.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
