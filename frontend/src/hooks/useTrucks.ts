import { useState, useEffect } from 'react';
import { trucksApi } from '@/lib/api';
import { Truck, TruckFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useTrucks(status?: string) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTrucks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await trucksApi.getAll(status);
      setTrucks(data);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      alert('Failed to load trucks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, [user, status]);

  const createTruck = async (data: TruckFormData) => {
    try {
      await trucksApi.create(data);
      await fetchTrucks();
    } catch (error: any) {
      throw error;
    }
  };

  const updateTruck = async (id: number, data: TruckFormData) => {
    try {
      await trucksApi.update(id, data);
      await fetchTrucks();
    } catch (error: any) {
      throw error;
    }
  };

  const deleteTruck = async (id: number) => {
    try {
      await trucksApi.delete(id);
      await fetchTrucks();
    } catch (error: any) {
      throw error;
    }
  };

  return {
    trucks,
    loading,
    isLoading: loading,
    data: trucks,
    createTruck,
    updateTruck,
    deleteTruck,
    refetch: fetchTrucks,
  };
}

export function useAvailableTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchAvailableTrucks = async () => {
      try {
        setLoading(true);
        const data = await trucksApi.getAvailable();
        setTrucks(data);
      } catch (error) {
        console.error('Error fetching available trucks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTrucks();
  }, [user]);

  return { trucks, loading, data: trucks, isLoading: loading };
}
