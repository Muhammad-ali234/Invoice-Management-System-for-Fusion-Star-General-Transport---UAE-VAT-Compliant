import { useState, useEffect } from 'react';
import { Quote, QuoteFormData } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<Quote[]>('/quotes', {});
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const getQuote = async (id: number): Promise<Quote | null> => {
    try {
      const data = await fetchApi<Quote>(`/quotes/${id}`, {});
      return data;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
  };

  const createQuote = async (quoteData: QuoteFormData): Promise<Quote | null> => {
    try {
      const data = await fetchApi<Quote>('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData),
      });
      await fetchQuotes();
      return data;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  };

  const updateQuote = async (id: number, quoteData: QuoteFormData): Promise<Quote | null> => {
    try {
      const data = await fetchApi<Quote>(`/quotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(quoteData),
      });
      await fetchQuotes();
      return data;
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  };

  const deleteQuote = async (id: number): Promise<void> => {
    try {
      await fetchApi(`/quotes/${id}`, {
        method: 'DELETE',
      });
      await fetchQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  };

  const updateQuoteStatus = async (id: number, status: string): Promise<void> => {
    try {
      await fetchApi(`/quotes/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await fetchQuotes();
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  };

  const convertToInvoice = async (id: number): Promise<any> => {
    try {
      const data = await fetchApi(`/quotes/${id}/convert`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      await fetchQuotes();
      return data;
    } catch (error) {
      console.error('Error converting quote:', error);
      throw error;
    }
  };

  return {
    quotes,
    loading,
    getQuote,
    createQuote,
    updateQuote,
    deleteQuote,
    updateQuoteStatus,
    convertToInvoice,
    refetch: fetchQuotes,
  };
}
