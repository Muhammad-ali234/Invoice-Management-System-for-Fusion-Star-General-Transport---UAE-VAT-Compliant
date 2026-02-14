import { useState, useEffect } from 'react';
import { invoicesApi } from '@/lib/api';
import { Invoice, InvoiceFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { calculateInvoiceTotals } from '@/utils/calculations';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await invoicesApi.getAll();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const createInvoice = async (data: InvoiceFormData, customerName: string, status: 'draft' | 'sent') => {
    if (!user) throw new Error('Not authenticated');

    try {
      const totals = calculateInvoiceTotals(data.lineItems, data.discountPercent, data.taxPercent);

      const invoiceData: InvoiceFormData = {
        customerId: data.customerId,
        customerName,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        lineItems: data.lineItems,
        ...totals,
        discountPercent: data.discountPercent,
        taxPercent: data.taxPercent,
        status,
        notes: data.notes || '',
      };

      await invoicesApi.create(invoiceData);
      await fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  };

  const updateInvoice = async (id: number, data: InvoiceFormData, customerName: string, status: 'draft' | 'sent') => {
    if (!user) throw new Error('Not authenticated');

    try {
      const totals = calculateInvoiceTotals(data.lineItems, data.discountPercent, data.taxPercent);

      const invoiceData: InvoiceFormData = {
        customerId: data.customerId,
        customerName,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        lineItems: data.lineItems,
        ...totals,
        discountPercent: data.discountPercent,
        taxPercent: data.taxPercent,
        status,
        notes: data.notes || '',
      };

      await invoicesApi.update(id, invoiceData);
      await fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw new Error('Failed to update invoice');
    }
  };

  const deleteInvoice = async (id: number) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await invoicesApi.delete(id);
      await fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw new Error('Failed to delete invoice');
    }
  };

  const getInvoice = async (id: number): Promise<Invoice | null> => {
    if (!user) throw new Error('Not authenticated');

    try {
      const invoice = await invoicesApi.getOne(id);
      return invoice;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }
  };

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    refetch: fetchInvoices,
  };
}
