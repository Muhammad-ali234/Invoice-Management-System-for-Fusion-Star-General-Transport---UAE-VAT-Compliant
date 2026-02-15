import { useState } from 'react';
import { Plus, Truck as TruckIcon, Edit2, Trash2, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useTrucks } from '@/hooks/useTrucks';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Loading } from '@/components/common/Loading';
import TruckForm from '../components/forms/TruckForm';
import { Truck } from '@/types';

export default function TrucksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: trucks, isLoading, deleteTruck } = useTrucks(statusFilter);

  const handleEdit = (truck: Truck) => {
    setEditingTruck(truck);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTruck(id);
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete truck');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTruck(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      rented: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return <Layout title="Vehicles"><Loading /></Layout>;

  return (
    <Layout title="Vehicles">
      <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your fleet of vehicles</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Vehicle</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
          <div className="text-xs md:text-sm text-gray-600">Total Vehicles</div>
          <div className="text-xl md:text-2xl font-bold text-gray-900">{trucks?.length || 0}</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
          <div className="text-xs md:text-sm text-gray-600">Available</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {trucks?.filter((t: Truck) => t.status === 'available').length || 0}
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
          <div className="text-xs md:text-sm text-gray-600">Rented</div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {trucks?.filter((t: Truck) => t.status === 'rented').length || 0}
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
          <div className="text-xs md:text-sm text-gray-600">Maintenance</div>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">
            {trucks?.filter((t: Truck) => t.status === 'maintenance').length || 0}
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
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plate Number
                </th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Monthly Rate
                </th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Notes
                </th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trucks && trucks.length > 0 ? (
                trucks.map((truck: Truck) => (
                  <tr key={truck.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center">
                        <TruckIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3" />
                        <div>
                          <span className="font-medium text-gray-900 text-sm md:text-base">{truck.plate_number}</span>
                          <div className="text-xs text-gray-500 sm:hidden">{truck.truck_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {truck.truck_type}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          truck.status
                        )}`}
                      >
                        {truck.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-900 hidden lg:table-cell">
                      {Number(truck.monthly_rate).toFixed(2)} AED
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600 hidden xl:table-cell">
                      {truck.notes ? (
                        <span className="truncate max-w-xs block">{truck.notes}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(truck)}
                        className="text-blue-600 hover:text-blue-900 mr-3 md:mr-4"
                      >
                        <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(truck.id)}
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
                    <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm md:text-base">No vehicles found</p>
                    <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Vehicle
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
        title={editingTruck ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <TruckForm truck={editingTruck} onSuccess={handleCloseForm} onCancel={handleCloseForm} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Vehicle"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm md:text-base">
            Are you sure you want to delete this vehicle? This action cannot be undone.
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
