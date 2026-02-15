import { useState } from 'react';
import { Plus, FileText, Edit2, Trash2, Filter, AlertCircle, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useContracts } from '@/hooks/useContracts';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Loading } from '@/components/common/Loading';
import ContractForm from '../components/forms/ContractForm';
import { Contract } from '@/types';

export default function ContractsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: contracts, isLoading, deleteContract } = useContracts(statusFilter);

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContract(id);
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete contract');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContract(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount: number) => {
    return `${Number(amount).toFixed(2)} AED`;
  };

  const isExpiringSoon = (endDate: string, status: string) => {
    if (status !== 'active') return false;
    const expiry = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate: string, status: string) => {
    if (status !== 'active') return false;
    const expiry = new Date(endDate);
    const today = new Date();
    return expiry < today;
  };

  const getDaysRemaining = (endDate: string) => {
    const expiry = new Date(endDate);
    const today = new Date();
    const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (isLoading) return <Layout title="Contracts"><Loading /></Layout>;

  const activeContracts = contracts?.filter((c: Contract) => c.status === 'active').length || 0;
  const expiredContracts = contracts?.filter((c: Contract) => c.status === 'expired').length || 0;
  const expiringSoon = contracts?.filter((c: Contract) => 
    isExpiringSoon(c.end_date, c.status)
  ).length || 0;

  const totalMonthlyRevenue = contracts
    ?.filter((c: Contract) => c.status === 'active')
    .reduce((sum, c) => sum + Number(c.monthly_amount), 0) || 0;

  return (
    <Layout title="Contracts">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Contracts</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage rental contracts</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Contract</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Total Contracts</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{contracts?.length || 0}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Active</div>
            <div className="text-xl md:text-2xl font-bold text-green-600">{activeContracts}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Expiring Soon</div>
            <div className="text-xl md:text-2xl font-bold text-orange-600">{expiringSoon}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Expired</div>
            <div className="text-xl md:text-2xl font-bold text-red-600">{expiredContracts}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow col-span-2 md:col-span-1">
            <div className="text-xs md:text-sm text-gray-600">Monthly Revenue</div>
            <div className="text-lg md:text-xl font-bold text-blue-600">{formatCurrency(totalMonthlyRevenue)}</div>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoon > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900 text-sm md:text-base">Contracts Expiring Soon</h3>
              <p className="text-xs md:text-sm text-orange-700 mt-1">
                {expiringSoon} contract{expiringSoon > 1 ? 's' : ''} will expire within 30 days. 
                Review and renew to avoid service interruption.
              </p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
          <div className="flex items-center gap-3 md:gap-4">
            <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-none border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Customer
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Vehicle / Driver
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Period
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts && contracts.length > 0 ? (
                  contracts.map((contract: Contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm md:text-base">{contract.contract_number}</div>
                            <div className="text-xs text-gray-500">Day {contract.billing_day}</div>
                            <div className="text-xs text-gray-500 lg:hidden">{contract.customer_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                        <div className="text-sm font-medium text-gray-900">{contract.customer_name}</div>
                        {contract.customer_email && (
                          <div className="text-xs text-gray-500">{contract.customer_email}</div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 hidden xl:table-cell">
                        <div className="text-sm text-gray-900">
                          {contract.truck_plate ? `🚛 ${contract.truck_plate}` : 'No vehicle'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {contract.driver_name ? `👨‍✈️ ${contract.driver_name}` : 'No driver'}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                        <div className="text-xs md:text-sm text-gray-900">
                          {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                        </div>
                        {contract.status === 'active' && (
                          <div className="text-xs">
                            {isExpired(contract.end_date, contract.status) ? (
                              <span className="text-red-600 font-semibold">Expired</span>
                            ) : isExpiringSoon(contract.end_date, contract.status) ? (
                              <span className="text-orange-600 font-semibold">
                                {getDaysRemaining(contract.end_date)} days left
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                {getDaysRemaining(contract.end_date)} days left
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="text-xs md:text-sm font-medium text-gray-900">
                          {formatCurrency(contract.monthly_amount)}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span
                          className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            contract.status
                          )}`}
                        >
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(contract)}
                          className="text-blue-600 hover:text-blue-900 mr-3 md:mr-4"
                        >
                          <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(contract.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm md:text-base">No contracts found</p>
                      <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Contract
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingContract ? 'Edit Contract' : 'New Contract'}
        >
          <ContractForm
            contract={editingContract}
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Contract"
        >
          <div className="space-y-4">
            <p className="text-gray-600 text-sm md:text-base">
              Are you sure you want to delete this contract? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
