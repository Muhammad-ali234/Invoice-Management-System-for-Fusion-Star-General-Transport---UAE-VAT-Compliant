import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { useQuotes } from '@/hooks/useQuotes';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/utils/formatting';

export function QuotesPage() {
  const { quotes, loading, deleteQuote } = useQuotes();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = quotes.filter((quote) => {
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesSearch =
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    if (confirm('Delete this quote?')) {
      await deleteQuote(id);
    }
  };

  return (
    <Layout
      title="Quotes"
      actions={
        <Button onClick={() => navigate('/quotes/new')}>
          + New Quote
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
              <option value="converted">Converted</option>
            </select>
            <input
              type="text"
              placeholder="Search by customer or quote number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Quotes Table */}
          {filteredQuotes.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">No quotes found</p>
              <Button onClick={() => navigate('/quotes/new')}>
                Create your first quote
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{quote.quote_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{quote.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(quote.quote_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(quote.expiry_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(quote.grand_total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quote.status)}`}>
                          {getStatusLabel(quote.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Link to={`/quotes/${quote.id}`} className="text-gray-600 hover:text-gray-900">
                          View
                        </Link>
                        {quote.status === 'draft' && (
                          <>
                            <Link to={`/quotes/${quote.id}/edit`} className="text-gray-600 hover:text-gray-900">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(quote.id)}
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
