import { useState } from 'react';
import { Plus, Truck as TruckIcon, Edit2, Trash2, Filter } from 'lucide-react';
import { useTrucks } from '@/hooks/useTrucks';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Loading } from '@/components/common/Loading';
import TruckForm from '@/components/forms/TruckForm';
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

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trucks</h1>
          <p className="text-gray-600 mt-1">Manage your fleet of trucks</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Truck
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Trucks</div>
          <div className="text-2xl font-bold text-gray-900">{trucks?.length || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Available</div>
          <div className="text-2xl font-bold text-green-600">
            {trucks?.filter((t: Truck) => t.status === 'available').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Rented</div>
          <div className="text-2xl font-bold text-blue-600">
            {trucks?.filter((t: Truck) => t.status === 'rented').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Maintenance</div>
          <div className="text-2xl font-bold text-yellow-600">
            {trucks?.filter((t: Truck) => t.status === 'maintenance').length || 0}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Trucks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plate Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trucks && trucks.length > 0 ? (
              trucks.map((truck: Truck) => (
                <tr key={truck.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TruckIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{truck.plate_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {truck.truck_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        truck.status
                      )}`}
                    >
                      {truck.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {truck.monthly_rate.toFixed(2)} AED
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {truck.notes ? (
                      <span className="truncate max-w-xs block">{truck.notes}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(truck)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(truck.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No trucks found</p>
                  <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Truck
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTruck ? 'Edit Truck' : 'Add New Truck'}
      >
        <TruckForm truck={editingTruck} onSuccess={handleCloseForm} onCancel={handleCloseForm} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Truck"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this truck? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
