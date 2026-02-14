import { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/cards/StatCard';
import { InvoiceCard } from '@/components/cards/InvoiceCard';
import { IncomeChart } from '@/components/charts/IncomeChart';
import { StatusPieChart } from '@/components/charts/StatusPieChart';
import { Loading } from '@/components/common/Loading';
import { useInvoices } from '@/hooks/useInvoices';
import { useCustomers } from '@/hooks/useCustomers';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency } from '@/utils/formatting';
import { format } from 'date-fns';

/**
 * DashboardPage component
 * Shows overview of key metrics and recent activity
 */
export function DashboardPage() {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { customers } = useCustomers();
  const { payments } = usePayments();

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.grand_total, 0);

    const unpaidInvoices = invoices.filter((inv) => inv.status !== 'paid');
    const pendingAmount = unpaidInvoices.reduce((sum, inv) => {
      // Calculate what's been paid for this invoice
      const invoicePayments = payments.filter((p) => p.invoice_id.toString() === inv.id.toString());
      const paid = invoicePayments.reduce((s, p) => s + p.amount, 0);
      return sum + (inv.grand_total - paid);
    }, 0);

    // Monthly data for chart (last 6 months)
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

    return {
      totalIncome,
      pendingAmount,
      totalInvoices: invoices.length,
      totalCustomers: customers.length,
      monthlyData,
      statusCounts,
      recentInvoices: invoices.slice(0, 5),
    };
  }, [invoices, customers, payments]);

  if (invoicesLoading) {
    return (
      <Layout title="Dashboard">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout
      title="Dashboard"
      actions={
        <div className="text-sm text-gray-600">
          🚚 Movers & Logistics Invoice System
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalIncome)}
            icon="💰"
          />
          <StatCard
            title="Pending Payments"
            value={formatCurrency(metrics.pendingAmount)}
            icon="⏳"
          />
          <StatCard
            title="Total Invoices"
            value={metrics.totalInvoices}
            icon="📄"
          />
          <StatCard
            title="Active Clients"
            value={metrics.totalCustomers}
            icon="👥"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IncomeChart data={metrics.monthlyData} />
          </div>
          <div>
            <StatusPieChart data={metrics.statusCounts} />
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
          {metrics.recentInvoices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No invoices yet. Create your first moving job invoice!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.recentInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id.toString()} invoice={invoice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
