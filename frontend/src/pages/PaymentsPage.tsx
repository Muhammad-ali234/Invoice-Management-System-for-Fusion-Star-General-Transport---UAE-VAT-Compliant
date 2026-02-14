import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Loading } from '@/components/common/Loading';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '@/utils/formatting';

export function PaymentsPage() {
  const { payments, loading } = usePayments();
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = payments.filter((p) =>
    methodFilter === 'all' || p.payment_method === methodFilter
  );

  const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout title="Payments / Payments">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Payments Table */}
          {filteredPayments.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No payments recorded yet / Abhi tak koi payment nahi</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id.toString()} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(payment.payment_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/invoices/${payment.invoice_id}`}
                            className="text-gray-900 hover:underline font-medium"
                          >
                            {payment.invoice_number}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getPaymentMethodLabel(payment.payment_method)}</td>
                        <td className="px-6 py-4 text-gray-600">{payment.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Payments / Kul Payments:</span>
                  <span className="text-2xl font-bold">{formatCurrency(totalPayments)}</span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
}
