import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { customersApi, invoicesApi, trucksApi, driversApi, contractsApi, paymentsApi } from '@/lib/api';

interface CachedData {
  customers: any[];
  invoices: any[];
  trucks: any[];
  drivers: any[];
  contracts: any[];
  payments: any[];
}

interface DataLoaderContextType {
  data: CachedData;
  loading: boolean;
  error: string | null;
  refetch: (key?: keyof CachedData) => Promise<void>;
  invalidate: (key: keyof CachedData) => void;
}

const DataLoaderContext = createContext<DataLoaderContextType | undefined>(undefined);

export function DataLoaderProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CachedData>({
    customers: [],
    invoices: [],
    trucks: [],
    drivers: [],
    contracts: [],
    payments: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [customers, invoices, trucks, drivers, contracts, payments] = await Promise.all([
        customersApi.getAll().catch(() => []),
        invoicesApi.getAll().catch(() => []),
        trucksApi.getAll().catch(() => []),
        driversApi.getAll().catch(() => []),
        contractsApi.getAll().catch(() => []),
        paymentsApi.getAll().catch(() => []),
      ]);

      setData({
        customers,
        invoices,
        trucks,
        drivers,
        contracts,
        payments,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific data type
  const fetchData = useCallback(async (key: keyof CachedData) => {
    try {
      let result;
      switch (key) {
        case 'customers':
          result = await customersApi.getAll();
          break;
        case 'invoices':
          result = await invoicesApi.getAll();
          break;
        case 'trucks':
          result = await trucksApi.getAll();
          break;
        case 'drivers':
          result = await driversApi.getAll();
          break;
        case 'contracts':
          result = await contractsApi.getAll();
          break;
        case 'payments':
          result = await paymentsApi.getAll();
          break;
        default:
          return;
      }
      
      setData(prev => ({ ...prev, [key]: result }));
    } catch (err) {
      console.error(`Failed to fetch ${key}:`, err);
    }
  }, []);

  // Refetch data
  const refetch = useCallback(async (key?: keyof CachedData) => {
    if (key) {
      await fetchData(key);
    } else {
      await fetchAllData();
    }
  }, [fetchData, fetchAllData]);

  // Invalidate cache for specific key
  const invalidate = useCallback((key: keyof CachedData) => {
    setData(prev => ({ ...prev, [key]: [] }));
    fetchData(key);
  }, [fetchData]);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <DataLoaderContext.Provider value={{ data, loading, error, refetch, invalidate }}>
      {children}
    </DataLoaderContext.Provider>
  );
}

export function useDataLoader() {
  const context = useContext(DataLoaderContext);
  if (!context) {
    throw new Error('useDataLoader must be used within DataLoaderProvider');
  }
  return context;
}

// Convenience hooks for specific data types
export function useCachedCustomers() {
  const { data, loading, refetch, invalidate } = useDataLoader();
  return {
    customers: data.customers,
    loading,
    refetch: () => refetch('customers'),
    invalidate: () => invalidate('customers'),
  };
}

export function useCachedInvoices() {
  const { data, loading, refetch, invalidate } = useDataLoader();
  return {
    invoices: data.invoices,
    loading,
    refetch: () => refetch('invoices'),
    invalidate: () => invalidate('invoices'),
  };
}

export function useCachedTrucks() {
  const { data, loading, refetch, invalidate } = useDataLoader();
  return {
    trucks: data.trucks,
    loading,
    refetch: () => refetch('trucks'),
    invalidate: () => invalidate('trucks'),
  };
}

export function useCachedDrivers() {
  const { data, loading, refetch, invalidate } = useDataLoader();
  return {
    drivers: data.drivers,
    loading,
    refetch: () => refetch('drivers'),
    invalidate: () => invalidate('drivers'),
  };
}

export function useCachedContracts() {
  const { data, loading, refetch, invalidate } = useDataLoader();
  return {
    contracts: data.contracts,
    loading,
    refetch: () => refetch('contracts'),
    invalidate: () => invalidate('contracts'),
  };
}

export function useCachedPayments() {
  const { data, loading, refetch, invalidate } = useDataLoader();
  return {
    payments: data.payments,
    loading,
    refetch: () => refetch('payments'),
    invalidate: () => invalidate('payments'),
  };
}
