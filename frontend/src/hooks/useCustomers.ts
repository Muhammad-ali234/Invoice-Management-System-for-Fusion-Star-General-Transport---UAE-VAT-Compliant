import { useState, useEffect } from 'react';
import { customersApi } from '@/lib/api';
import { Customer, CustomerFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCustomers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const createCustomer = async (data: CustomerFormData) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await customersApi.create(data);
      await fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  };

  const updateCustomer = async (id: number, data: CustomerFormData) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await customersApi.update(id, data);
      await fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new Error('Failed to update customer');
    }
  };

  const deleteCustomer = async (id: number) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await customersApi.delete(id);
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw new Error('Failed to delete customer');
    }
  };

  return {
    customers,
    loading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
  };
}
