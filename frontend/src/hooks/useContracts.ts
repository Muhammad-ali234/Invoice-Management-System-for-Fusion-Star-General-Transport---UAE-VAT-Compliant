import { useState, useEffect } from 'react';
import { contractsApi } from '@/lib/api';
import { Contract, ContractFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useContracts(status?: string, customer_id?: number) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchContracts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await contractsApi.getAll(status, customer_id);
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      alert('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user, status, customer_id]);

  const createContract = async (data: ContractFormData) => {
    try {
      await contractsApi.create(data);
      await fetchContracts();
    } catch (error: any) {
      throw error;
    }
  };

  const updateContract = async (id: number, data: ContractFormData & { status?: string }) => {
    try {
      await contractsApi.update(id, data);
      await fetchContracts();
    } catch (error: any) {
      throw error;
    }
  };

  const deleteContract = async (id: number) => {
    try {
      await contractsApi.delete(id);
      await fetchContracts();
    } catch (error: any) {
      throw error;
    }
  };

  return {
    contracts,
    loading,
    isLoading: loading,
    data: contracts,
    createContract,
    updateContract,
    deleteContract,
    refetch: fetchContracts,
  };
}

export function useExpiringSoonContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchExpiringSoon = async () => {
      try {
        setLoading(true);
        const data = await contractsApi.getExpiringSoon();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching expiring contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringSoon();
  }, [user]);

  return { contracts, loading, data: contracts, isLoading: loading };
}
