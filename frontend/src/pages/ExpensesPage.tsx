import { useState } from 'react';
import { Plus, DollarSign, Edit2, Trash2, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Loading } from '@/components/common/Loading';
import ExpenseForm from '../components/forms/ExpenseForm';
import { Expense } from '@/types';

export default function ExpensesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: expenses, isLoading, deleteExpense } = useExpenses({ category: categoryFilter });

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete expense');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      fuel: 'bg-orange-100 text-orange-800',
      salik: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-red-100 text-red-800',
      salary: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return styles[category as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      fuel: 'Fuel',
      salik: 'Salik',
      maintenance: 'Maintenance',
      salary: 'Salary',
      other: 'Other',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount: number) => {
    return `${Number(amount).toFixed(2)} AED`;
  };

  if (isLoading) return <Layout title="Expenses"><Loading /></Layout>;

  // Calculate statistics
  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const fuelExpenses = expenses?.filter(e => e.category === 'fuel').reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const salikExpenses = expenses?.filter(e => e.category === 'salik').reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const maintenanceExpenses = expenses?.filter(e => e.category === 'maintenance').reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const salaryExpenses = expenses?.filter(e => e.category === 'salary').reduce((sum, e) => sum + Number(e.amount), 0) || 0;

  return (
    <Layout title="Expenses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track operational expenses</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Expenses</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Fuel</div>
            <div className="text-xl font-bold text-orange-600">{formatCurrency(fuelExpenses)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Salik</div>
            <div className="text-xl font-bold text-purple-600">{formatCurrency(salikExpenses)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Maintenance</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(maintenanceExpenses)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Salary</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(salaryExpenses)}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="fuel">Fuel</option>
              <option value="salik">Salik</option>
              <option value="maintenance">Maintenance</option>
              <option value="salary">Salary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Truck / Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses && expenses.length > 0 ? (
                expenses.map((expense: Expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatDate(expense.expense_date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(
                          expense.category
                        )}`}
                      >
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{expense.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {expense.truck_plate && `🚛 ${expense.truck_plate}`}
                        {expense.driver_name && `👨‍✈️ ${expense.driver_name}`}
                        {!expense.truck_plate && !expense.driver_name && '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{expense.receipt_number || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No expenses found</p>
                    <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Expense
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
          title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        >
          <ExpenseForm
            expense={editingExpense}
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Expense"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this expense? This action cannot be undone.
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
    </Layout>
  );
}
