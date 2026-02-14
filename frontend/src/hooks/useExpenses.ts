import { useState, useEffect } from 'react';
import { expensesApi } from '@/lib/api';
import { Expense, ExpenseFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ExpenseFilters {
  category?: string;
  truck_id?: number;
  driver_id?: number;
  start_date?: string;
  end_date?: string;
}

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await expensesApi.getAll(filters);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      alert('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user, filters?.category, filters?.truck_id, filters?.driver_id, filters?.start_date, filters?.end_date]);

  const createExpense = async (data: ExpenseFormData) => {
    try {
      await expensesApi.create(data);
      await fetchExpenses();
    } catch (error: any) {
      throw error;
    }
  };

  const updateExpense = async (id: number, data: ExpenseFormData) => {
    try {
      await expensesApi.update(id, data);
      await fetchExpenses();
    } catch (error: any) {
      throw error;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await expensesApi.delete(id);
      await fetchExpenses();
    } catch (error: any) {
      throw error;
    }
  };

  return {
    expenses,
    loading,
    isLoading: loading,
    data: expenses,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}
