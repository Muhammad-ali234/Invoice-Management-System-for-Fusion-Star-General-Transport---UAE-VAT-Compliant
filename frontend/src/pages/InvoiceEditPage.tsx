import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { useCustomers } from '@/hooks/useCustomers';
import { useInvoices } from '@/hooks/useInvoices';
import { Loading } from '@/components/common/Loading';
import { Invoice, InvoiceFormData } from '@/types';

export function InvoiceEditPage() {
  const { id } = useParams();
  const { customers, loading: customersLoading } = useCustomers();
  const { getInvoice, updateInvoice } = useInvoices();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      if (!id) return;
      const inv = await getInvoice(parseInt(id));
      if (!inv) {
        alert('Invoice not found');
        navigate('/invoices');
        return;
      }
      if (inv.status !== 'draft') {
        alert('Only draft invoices can be edited');
        navigate(`/invoices/${id}`);
        return;
      }
      setInvoice(inv);
      setLoading(false);
    }
    loadInvoice();
  }, [id]);

  const handleSubmit = async (data: InvoiceFormData, status: 'draft' | 'sent') => {
    if (!invoice) return;
    const customer = customers.find((c) => c.id.toString() === data.customerId.toString());
    if (!customer) throw new Error('Customer not found');

    await updateInvoice(invoice.id, data, customer.name, status);
    navigate(`/invoices/${id}`);
  };

  if (loading || customersLoading) {
    return (
      <Layout title="Edit Invoice / Invoice Edit Karein">
        <Loading />
      </Layout>
    );
  }

  if (!invoice) return null;

  return (
    <Layout title="Edit Invoice / Invoice Edit Karein">
      <InvoiceForm
        customers={customers}
        initialData={{
          customerId: invoice.customer_id,
          customerName: invoice.customer_name,
          invoiceDate: invoice.invoice_date,
          dueDate: invoice.due_date,
          lineItems: invoice.lineItems || [],
          subtotal: invoice.subtotal,
          discountPercent: invoice.discount_percent,
          discountAmount: invoice.discount_amount,
          taxPercent: invoice.tax_percent,
          taxAmount: invoice.tax_amount,
          grandTotal: invoice.grand_total,
          status: invoice.status,
          notes: invoice.notes,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/invoices/${id}`)}
      />
    </Layout>
  );
}
