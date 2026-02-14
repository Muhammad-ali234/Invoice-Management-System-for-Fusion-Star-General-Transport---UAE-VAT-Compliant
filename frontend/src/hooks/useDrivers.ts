import { useState, useEffect } from 'react';
import { driversApi } from '@/lib/api';
import { Driver, DriverFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useDrivers(status?: string) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDrivers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await driversApi.getAll(status);
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      alert('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [user, status]);

  const createDriver = async (data: DriverFormData) => {
    try {
      await driversApi.create(data);
      await fetchDrivers();
    } catch (error: any) {
      throw error;
    }
  };

  const updateDriver = async (id: number, data: DriverFormData) => {
    try {
      await driversApi.update(id, data);
      await fetchDrivers();
    } catch (error: any) {
      throw error;
    }
  };

  const deleteDriver = async (id: number) => {
    try {
      await driversApi.delete(id);
      await fetchDrivers();
    } catch (error: any) {
      throw error;
    }
  };

  return {
    drivers,
    loading,
    isLoading: loading,
    data: drivers,
    createDriver,
    updateDriver,
    deleteDriver,
    refetch: fetchDrivers,
  };
}

export function useAvailableDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchAvailableDrivers = async () => {
      try {
        setLoading(true);
        const data = await driversApi.getAvailable();
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching available drivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDrivers();
  }, [user]);

  return { drivers, loading, data: drivers, isLoading: loading };
}
