import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { useCachedCustomers } from '@/contexts/DataLoaderContext';
import { useInvoices } from '@/hooks/useInvoices';
import { Loading } from '@/components/common/Loading';
import { InvoiceFormData } from '@/types';

export function InvoiceCreatePage() {
  const { customers, loading } = useCachedCustomers();
  const { createInvoice } = useInvoices();
  const navigate = useNavigate();

  const handleSubmit = async (data: InvoiceFormData, status: 'draft' | 'sent') => {
    const customer = customers.find((c) => c.id.toString() === data.customerId.toString());
    if (!customer) throw new Error('Customer not found');

    await createInvoice(data, customer.name, status);
    navigate('/invoices');
  };

  if (loading) {
    return (
      <Layout title="Create Invoice / Naya Invoice">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Create Invoice / Naya Invoice">
      <InvoiceForm
        customers={customers}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/invoices')}
      />
    </Layout>
  );
}
