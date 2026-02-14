// API client for backend communication

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
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
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

// Note: Backend expects camelCase in request body, returns snake_case from database
// No conversion needed for requests

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Customers API
export const customersApi = {
  getAll: () => fetchApi('/customers'),
  
  create: (data: any) =>
    fetchApi('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    fetchApi(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi(`/customers/${id}`, {
      method: 'DELETE',
    }),
};

// Invoices API
export const invoicesApi = {
  getAll: () => fetchApi('/invoices'),
  
  getOne: (id: number) => fetchApi(`/invoices/${id}`),

  create: (data: any) =>
    fetchApi('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    fetchApi(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi(`/invoices/${id}`, {
      method: 'DELETE',
    }),
};

// Payments API
export const paymentsApi = {
  getAll: () => fetchApi('/payments'),
  
  getForInvoice: (invoiceId: number) =>
    fetchApi(`/payments?invoiceId=${invoiceId}`),

  create: (data: any) =>
    fetchApi('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: number, invoiceId: number) =>
    fetchApi(`/payments/${id}?invoiceId=${invoiceId}`, {
      method: 'DELETE',
    }),
};

// Trucks API
export const trucksApi = {
  getAll: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return fetchApi(`/trucks${params}`);
  },
  
  getOne: (id: number) => fetchApi(`/trucks/${id}`),
  
  getAvailable: () => fetchApi('/trucks/filter/available'),

  create: (data: any) =>
    fetchApi('/trucks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    fetchApi(`/trucks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi(`/trucks/${id}`, {
      method: 'DELETE',
    }),
};

// Drivers API
export const driversApi = {
  getAll: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return fetchApi(`/drivers${params}`);
  },
  
  getOne: (id: number) => fetchApi(`/drivers/${id}`),
  
  getAvailable: () => fetchApi('/drivers/filter/available'),

  create: (data: any) =>
    fetchApi('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    fetchApi(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi(`/drivers/${id}`, {
      method: 'DELETE',
    }),
};

// Contracts API
export const contractsApi = {
  getAll: (status?: string, customer_id?: number) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (customer_id) params.append('customer_id', customer_id.toString());
    const queryString = params.toString();
    return fetchApi(`/contracts${queryString ? `?${queryString}` : ''}`);
  },
  
  getOne: (id: number) => fetchApi(`/contracts/${id}`),
  
  getExpiringSoon: () => fetchApi('/contracts/filter/expiring-soon'),

  create: (data: any) =>
    fetchApi('/contracts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    fetchApi(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi(`/contracts/${id}`, {
      method: 'DELETE',
    }),
    
  updateStatus: () =>
    fetchApi('/contracts/update-status', {
      method: 'POST',
    }),
};

// Billing API
export const billingApi = {
  getStatus: () => fetchApi('/billing/status'),
  
  getContractsDue: () => fetchApi('/billing/contracts-due'),
  
  processBilling: () =>
    fetchApi('/billing/process', {
      method: 'POST',
    }),
  
  getHistory: (limit = 50) =>
    fetchApi(`/billing/history?limit=${limit}`),
};

// Expenses API
export const expensesApi = {
  getAll: (filters?: { category?: string; truck_id?: number; driver_id?: number; start_date?: string; end_date?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.truck_id) params.append('truck_id', filters.truck_id.toString());
    if (filters?.driver_id) params.append('driver_id', filters.driver_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    const queryString = params.toString();
    return fetchApi(`/expenses${queryString ? `?${queryString}` : ''}`);
  },
  
  getOne: (id: number) => fetchApi(`/expenses/${id}`),
  
  getSummaryByCategory: (start_date?: string, end_date?: string) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    const queryString = params.toString();
    return fetchApi(`/expenses/summary/by-category${queryString ? `?${queryString}` : ''}`);
  },
  
  getSummaryByTruck: (start_date?: string, end_date?: string) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    const queryString = params.toString();
    return fetchApi(`/expenses/summary/by-truck${queryString ? `?${queryString}` : ''}`);
  },

  create: (data: any) =>
    fetchApi('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    fetchApi(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi(`/expenses/${id}`, {
      method: 'DELETE',
    }),
};
