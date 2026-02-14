import { useState, useEffect } from 'react';
import { Calendar, Play, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { billingApi } from '@/lib/api';

interface BillingStatus {
  running: boolean;
  schedule: string;
  timezone: string;
}

interface ContractDue {
  id: number;
  contract_number: string;
  customer_name: string;
  monthly_amount: number;
  billing_day: number;
}

interface BillingResult {
  contract_number: string;
  invoice_number?: string;
  status: 'success' | 'skipped' | 'failed';
  amount?: number;
  reason?: string;
  error?: string;
}

interface ProcessResult {
  success: boolean;
  message: string;
  processed: number;
  skipped: number;
  failed: number;
  results: BillingResult[];
}

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [contractsDue, setContractsDue] = useState<ContractDue[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const data = await billingApi.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching billing status:', error);
    }
  };

  const fetchContractsDue = async () => {
    try {
      const data = await billingApi.getContractsDue();
      setContractsDue(data.contracts || []);
    } catch (error) {
      console.error('Error fetching contracts due:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchStatus(), fetchContractsDue()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcessBilling = async () => {
    if (!confirm('Are you sure you want to process recurring billing now? This will generate invoices for all contracts due today.')) {
      return;
    }

    setProcessing(true);
    setProcessResult(null);

    try {
      const result = await billingApi.processBilling();
      setProcessResult(result);
      
      // Refresh contracts due list
      await fetchContractsDue();
      
      alert(`Billing processed successfully!\n\nProcessed: ${result.processed}\nSkipped: ${result.skipped}\nFailed: ${result.failed}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to process billing');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${Number(amount).toFixed(2)} AED`;
  };

  if (loading) return <Layout title="Recurring Billing"><Loading /></Layout>;

  return (
    <Layout title="Recurring Billing">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recurring Billing</h1>
            <p className="text-gray-600 mt-1">Automated monthly invoice generation</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={handleProcessBilling} 
              disabled={processing || contractsDue.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              {processing ? 'Processing...' : 'Process Now'}
            </Button>
          </div>
        </div>

        {/* Cron Job Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${status?.running ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Clock className={`w-6 h-6 ${status?.running ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Automatic Billing Status</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    status?.running 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {status?.running ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="text-gray-900 font-medium">{status?.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Timezone:</span>
                  <span className="text-gray-900">{status?.timezone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Due Today */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Contracts Due for Billing Today
                </h2>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {contractsDue.length} contract{contractsDue.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {contractsDue.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billing Day
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contractsDue.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{contract.contract_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{contract.customer_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">Day {contract.billing_day}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(contract.monthly_amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No contracts due for billing today</p>
              <p className="text-sm text-gray-400 mt-2">
                Contracts will appear here on their billing day
              </p>
            </div>
          )}
        </div>

        {/* Processing Results */}
        {processResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Results</h2>
            
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Processed</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{processResult.processed}</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-600 font-medium">Skipped</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">{processResult.skipped}</div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Failed</span>
                </div>
                <div className="text-2xl font-bold text-red-900">{processResult.failed}</div>
              </div>
            </div>

            {/* Detailed Results */}
            {processResult.results.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Details:</h3>
                {processResult.results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      result.status === 'success'
                        ? 'bg-green-50'
                        : result.status === 'skipped'
                        ? 'bg-yellow-50'
                        : 'bg-red-50'
                    }`}
                  >
                    {result.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    )}
                    {result.status === 'skipped' && (
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    )}
                    {result.status === 'failed' && (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {result.contract_number}
                      </div>
                      {result.status === 'success' && (
                        <div className="text-sm text-gray-600">
                          Invoice {result.invoice_number} generated ({formatCurrency(result.amount!)})
                        </div>
                      )}
                      {result.status === 'skipped' && (
                        <div className="text-sm text-gray-600">{result.reason}</div>
                      )}
                      {result.status === 'failed' && (
                        <div className="text-sm text-red-600">{result.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">How Recurring Billing Works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>The system automatically runs daily at 9:00 AM UAE time</li>
                <li>Invoices are generated for contracts where the billing day matches today's date</li>
                <li>Each contract is billed once per month (duplicates are prevented)</li>
                <li>Invoices include truck and driver details from the contract</li>
                <li>VAT is calculated automatically at the configured rate</li>
                <li>You can manually trigger billing using the "Process Now" button</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
