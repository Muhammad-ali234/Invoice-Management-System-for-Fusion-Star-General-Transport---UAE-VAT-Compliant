import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { Loading } from '@/components/common/Loading';
import { useInvoices } from '@/hooks/useInvoices';
import { usePayments } from '@/hooks/usePayments';
import { Invoice, PaymentFormData } from '@/types';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getPaymentMethodLabel } from '@/utils/formatting';
import { downloadInvoicePDF, printInvoicePDF, getInvoicePDFBlob } from '@/utils/pdfGenerator';
import { shareInvoiceViaWhatsApp, sharePaymentReminderViaWhatsApp, shareInvoicePDFViaWhatsApp } from '@/utils/whatsappShare';
import { getSettings } from './SettingsPage';

export function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, deleteInvoice, refetch: refetchInvoices } = useInvoices();
  const { getPaymentsForInvoice, createPayment } = usePayments();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    const inv = await getInvoice(parseInt(id));
    if (!inv) {
      alert('Invoice not found');
      navigate('/invoices');
      return;
    }
    const pmts = await getPaymentsForInvoice(parseInt(id));
    setInvoice(inv);
    setPayments(pmts);
    setLoading(false);
  };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    if (!invoice) return;
    await createPayment(invoice.id, invoice.invoice_number, data);
    await loadData();
    await refetchInvoices();
    setIsPaymentModalOpen(false);
  };

  const handleDelete = async () => {
    if (!invoice || !confirm('Delete this invoice?')) return;
    await deleteInvoice(invoice.id);
    navigate('/invoices');
  };

  const handlePrint = async () => {
    if (!invoice) return;
    try {
      console.log('🖨️ Starting print...', { invoiceId: invoice.id });
      const settings = await getSettings();
      console.log('✅ Settings loaded:', settings);
      
      await printInvoicePDF(invoice, {
        name: settings.companyName,
        nameArabic: settings.companyNameArabic,
        trn: settings.trnNumber,
        phone: settings.companyPhone,
        email: settings.companyEmail,
        address: settings.companyAddress,
        website: settings.companyWebsite,
        vatRate: settings.vatRate,
      });
      console.log('✅ Print completed');
    } catch (error) {
      console.error('❌ Error printing PDF:', error);
      alert(`Failed to print invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    try {
      console.log('📥 Starting download...', { invoiceId: invoice.id, invoiceNumber: invoice.invoice_number });
      const settings = await getSettings();
      console.log('✅ Settings loaded:', settings);
      
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
      console.log('✅ Download completed');
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      alert(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleShareWhatsApp = () => {
    if (!invoice) return;
    shareInvoiceViaWhatsApp(invoice);
  };

  const handleSharePDFWhatsApp = async () => {
    if (!invoice) return;
    try {
      const settings = await getSettings();
      // Generate PDF
      const pdfBlob = await getInvoicePDFBlob(invoice, {
        name: settings.companyName,
        nameArabic: settings.companyNameArabic,
        trn: settings.trnNumber,
        phone: settings.companyPhone,
        email: settings.companyEmail,
        address: settings.companyAddress,
        website: settings.companyWebsite,
        vatRate: settings.vatRate,
      });
      
      // Create a temporary URL for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // For mobile devices, try to share using Web Share API
      if (navigator.share && navigator.canShare) {
        const file = new File([pdfBlob], `${invoice.invoice_number}.pdf`, { type: 'application/pdf' });
        
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Invoice ${invoice.invoice_number}`,
              text: `Invoice for ${invoice.customer_name} - ${formatCurrency(invoice.grand_total)}`,
              files: [file],
            });
            URL.revokeObjectURL(pdfUrl);
            return;
          } catch (error) {
            console.log('Share cancelled or failed:', error);
          }
        }
      }
      
      // Fallback: Download PDF and share details via WhatsApp
      // Download the PDF first
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Then open WhatsApp with instructions
      setTimeout(() => {
        alert('PDF downloaded! Now opening WhatsApp. Please attach the downloaded PDF manually.');
        shareInvoicePDFViaWhatsApp(invoice);
        URL.revokeObjectURL(pdfUrl);
      }, 500);
      
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('Failed to share PDF. Please download and share manually.');
    }
  };

  const handleSendReminder = () => {
    if (!invoice) return;
    sharePaymentReminderViaWhatsApp(invoice, remaining);
  };

  if (loading) {
    return (
      <Layout title="Invoice">
        <Loading />
      </Layout>
    );
  }

  if (!invoice) return null;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = invoice.grand_total - totalPaid;

  return (
    <Layout
      title={`Invoice ${invoice.invoice_number}`}
      actions={
        <div className="flex gap-2 flex-wrap items-center">
          {invoice.status === 'draft' && (
            <Button variant="secondary" onClick={() => navigate(`/invoices/${id}/edit`)}>
              Edit
            </Button>
          )}
          <Button variant="secondary" onClick={handleDownloadPDF}>
            📥 Download PDF
          </Button>
          <Button variant="secondary" onClick={handlePrint}>
            🖨️ Print
          </Button>
          <Button variant="secondary" onClick={handleShareWhatsApp}>
            💬 Share Details
          </Button>
          <Button variant="secondary" onClick={handleSharePDFWhatsApp}>
            📎 Share PDF
          </Button>
          {(invoice.status === 'sent' || invoice.status === 'partially_paid') && remaining > 0 && (
            <Button variant="secondary" onClick={handleSendReminder}>
              🔔 Send Reminder
            </Button>
          )}
          {invoice.status === 'draft' && (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{invoice.invoice_number}</h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(invoice.status)}`}>
                {getStatusLabel(invoice.status)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Invoice Date: {formatDate(invoice.invoice_date)}</p>
              <p className="text-sm text-gray-600">Due Date: {formatDate(invoice.due_date)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p className="font-medium">{invoice.customer_name}</p>
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
              {invoice.lineItems?.map((item, idx) => (
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
                <td className="pt-4 text-right font-semibold">{formatCurrency(invoice.subtotal)}</td>
              </tr>
              {invoice.discount_percent > 0 && (
                <tr>
                  <td colSpan={3} className="text-right">Discount ({invoice.discount_percent}%):</td>
                  <td className="text-right">-{formatCurrency(invoice.discount_amount)}</td>
                </tr>
              )}
              {invoice.tax_percent > 0 && (
                <tr>
                  <td colSpan={3} className="text-right">Tax ({invoice.tax_percent}%):</td>
                  <td className="text-right">{formatCurrency(invoice.tax_amount)}</td>
                </tr>
              )}
              <tr className="text-lg font-bold border-t-2">
                <td colSpan={3} className="pt-4 text-right">Total Amount:</td>
                <td className="pt-4 text-right">{formatCurrency(invoice.grand_total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payments</h3>
            {(invoice.status === 'sent' || invoice.status === 'partially_paid') && (
              <Button size="sm" onClick={() => setIsPaymentModalOpen(true)}>
                + Record Payment
              </Button>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-semibold">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Balance:</span>
              <span className="font-semibold text-orange-600">{formatCurrency(remaining)}</span>
            </div>
          </div>

          {payments.length > 0 && (
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left pb-2">Date</th>
                  <th className="text-left pb-2">Amount</th>
                  <th className="text-left pb-2">Method</th>
                  <th className="text-left pb-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id.toString()} className="border-b">
                    <td className="py-2">{formatDate(payment.paymentDate)}</td>
                    <td className="py-2 font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="py-2">{getPaymentMethodLabel(payment.paymentMethod)}</td>
                    <td className="py-2 text-gray-600">{payment.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
      >
        <PaymentForm
          remainingAmount={remaining}
          onSubmit={handlePaymentSubmit}
          onCancel={() => setIsPaymentModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
