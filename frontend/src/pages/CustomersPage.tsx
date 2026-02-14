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
      title="Clients"
      actions={
        <Button onClick={handleCreate}>
          + New Client
        </Button>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Customers Table */}
          {filteredCustomers.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">No clients yet</p>
              <Button onClick={handleCreate}>Add your first client</Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id.toString()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.company || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customer Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingCustomer ? 'Edit Client' : 'Add Client'}
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
