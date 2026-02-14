import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { IncomeChart } from '@/components/charts/IncomeChart';
import { StatusPieChart } from '@/components/charts/StatusPieChart';
import { Loading } from '@/components/common/Loading';
import { useInvoices } from '@/hooks/useInvoices';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency } from '@/utils/formatting';
import { format } from 'date-fns';

export function ReportsPage() {
  const { invoices, loading } = useInvoices();
  const { payments } = usePayments();

  if (loading) {
    return (
      <Layout title="Reports / Reports">
        <Loading />
      </Layout>
    );
  }

  // Calculate metrics
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.grand_total, 0);

  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'paid');
  const pendingAmount = unpaidInvoices.reduce((sum, inv) => {
    const invoicePayments = payments.filter((p) => p.invoice_id.toString() === inv.id.toString());
    const paid = invoicePayments.reduce((s, p) => s + p.amount, 0);
    return sum + (inv.grand_total - paid);
  }, 0);

  const avgInvoice = invoices.length > 0 ? totalIncome / paidInvoices.length : 0;

  // Monthly data
  const monthlyData: Record<string, number> = {};
  paidInvoices.forEach((inv) => {
    const month = format(new Date(inv.invoice_date), 'yyyy-MM');
    monthlyData[month] = (monthlyData[month] || 0) + inv.grand_total;
  });

  // Status counts
  const statusCounts = {
    draft: invoices.filter((i) => i.status === 'draft').length,
    sent: invoices.filter((i) => i.status === 'sent').length,
    partially_paid: invoices.filter((i) => i.status === 'partially_paid').length,
    paid: paidInvoices.length,
  };

  // Top customers
  const customerTotals: Record<string, number> = {};
  paidInvoices.forEach((inv) => {
    customerTotals[inv.customer_name] = (customerTotals[inv.customer_name] || 0) + inv.grand_total;
  });
  const topCustomers = Object.entries(customerTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Payment methods
  const methodTotals = {
    cash: payments.filter((p) => p.payment_method === 'cash').reduce((s, p) => s + p.amount, 0),
    bank_transfer: payments.filter((p) => p.payment_method === 'bank_transfer').reduce((s, p) => s + p.amount, 0),
    other: payments.filter((p) => p.payment_method === 'other').reduce((s, p) => s + p.amount, 0),
  };

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalIncome)}
            subtitle={`${paidInvoices.length} paid invoices`}
            icon="💰"
          />
          <StatCard
            title="Pending Amount"
            value={formatCurrency(pendingAmount)}
            subtitle={`${unpaidInvoices.length} unpaid invoices`}
            icon="⏳"
          />
          <StatCard
            title="Average Invoice"
            value={formatCurrency(avgInvoice)}
            subtitle={`From ${invoices.length} total invoices`}
            icon="📊"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IncomeChart data={monthlyData} />
          </div>
          <div>
            <StatusPieChart data={statusCounts} />
          </div>
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Customers */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Top Clients</h3>
            {topCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-2">
                {topCustomers.map(([name, total], idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">{name}</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Cash</span>
                <span className="font-semibold">{formatCurrency(methodTotals.cash)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Bank Transfer</span>
                <span className="font-semibold">{formatCurrency(methodTotals.bank_transfer)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Other</span>
                <span className="font-semibold">{formatCurrency(methodTotals.other)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
