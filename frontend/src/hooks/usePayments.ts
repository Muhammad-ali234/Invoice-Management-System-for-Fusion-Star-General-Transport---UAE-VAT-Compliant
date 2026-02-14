import { useState, useEffect } from 'react';
import { paymentsApi } from '@/lib/api';
import { Payment, PaymentFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPayments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await paymentsApi.getAll();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const getPaymentsForInvoice = async (invoiceId: number): Promise<Payment[]> => {
    if (!user) return [];

    try {
      const data = await paymentsApi.getForInvoice(invoiceId);
      return data;
    } catch (error) {
      console.error('Error fetching invoice payments:', error);
      return [];
    }
  };

  const createPayment = async (
    invoiceId: number,
    invoiceNumber: string,
    data: PaymentFormData
  ) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await paymentsApi.create({
        invoiceId,
        invoiceNumber,
        amount: data.amount,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        notes: data.notes || '',
      });

      await fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to record payment');
    }
  };

  const deletePayment = async (id: number, invoiceId: number) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await paymentsApi.delete(id, invoiceId);
      await fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw new Error('Failed to delete payment');
    }
  };

  return {
    payments,
    loading,
    createPayment,
    deletePayment,
    getPaymentsForInvoice,
    refetch: fetchPayments,
  };
}
