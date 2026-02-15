import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { Loading } from '@/components/common/Loading';
import { useCustomers } from '@/hooks/useCustomers';
import { CustomerFormData, Customer } from '@/types';

export function CustomersPage() {
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CustomerFormData) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data);
    } else {
      await createCustomer(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      title="Customers"
      actions={
        <Button onClick={handleCreate}>
          <span className="hidden sm:inline">+ New Customer</span>
          <span className="sm:hidden">+ New</span>
        </Button>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Search */}
          <div className="mb-4 md:mb-6">
            <input
              type="text"
              placeholder="Search customers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-md"
            />
          </div>

          {/* Customers Table */}
          {filteredCustomers.length === 0 ? (
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4 text-sm md:text-base">No customers yet</p>
              <Button onClick={handleCreate}>Add your first customer</Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Company</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Email</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id.toString()} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base">
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-xs text-gray-500 md:hidden">{customer.company || '-'}</div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-sm md:text-base hidden md:table-cell">{customer.company || '-'}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-sm md:text-base hidden lg:table-cell">{customer.email || '-'}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-sm md:text-base">{customer.phone || '-'}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-blue-600 hover:text-blue-900 text-sm md:text-base"
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-900 text-sm md:text-base"
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">🗑️</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
          >
            <CustomerForm
              initialData={editingCustomer || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </>
      )}
    </Layout>
  );
}
