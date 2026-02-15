import { useState } from 'react';
import { Plus, User as UserIcon, Edit2, Trash2, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useDrivers } from '@/hooks/useDrivers';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Loading } from '@/components/common/Loading';
import DriverForm from '../components/forms/DriverForm';
import { Driver } from '@/types';

export default function DriversPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: drivers, isLoading, deleteDriver } = useDrivers(statusFilter);

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDriver(id);
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete driver');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDriver(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isLicenseExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  if (isLoading) return <Layout title="Drivers"><Loading /></Layout>;

  return (
    <Layout title="Drivers">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Drivers</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your team of drivers</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Driver</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Total Drivers</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{drivers?.length || 0}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Available</div>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {drivers?.filter((d: Driver) => d.status === 'available').length || 0}
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Assigned</div>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {drivers?.filter((d: Driver) => d.status === 'assigned').length || 0}
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">On Leave</div>
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {drivers?.filter((d: Driver) => d.status === 'on_leave').length || 0}
            </div>
          </div>
        </div>

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
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Phone
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    License Number
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    License Expiry
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
                {drivers && drivers.length > 0 ? (
                  drivers.map((driver: Driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3" />
                          <div>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{driver.full_name}</span>
                            <div className="text-xs text-gray-500 sm:hidden">{driver.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600 hidden sm:table-cell">
                        {driver.phone}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-900 hidden lg:table-cell">
                        {driver.license_number}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-sm hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={
                            isLicenseExpired(driver.license_expiry)
                              ? 'text-red-600 font-semibold'
                              : isLicenseExpiringSoon(driver.license_expiry)
                              ? 'text-orange-600 font-semibold'
                              : 'text-gray-900'
                          }>
                            {formatDate(driver.license_expiry)}
                          </span>
                          {isLicenseExpired(driver.license_expiry) && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              Expired
                            </span>
                          )}
                          {isLicenseExpiringSoon(driver.license_expiry) && !isLicenseExpired(driver.license_expiry) && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              Expiring Soon
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span
                          className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            driver.status
                          )}`}
                        >
                          {driver.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="text-blue-600 hover:text-blue-900 mr-3 md:mr-4"
                        >
                          <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(driver.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm md:text-base">No drivers found</p>
                      <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Driver
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
          title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
        >
          <DriverForm driver={editingDriver} onSuccess={handleCloseForm} onCancel={handleCloseForm} />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Driver"
        >
          <div className="space-y-4">
            <p className="text-gray-600 text-sm md:text-base">
              Are you sure you want to delete this driver? This action cannot be undone.
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
