// Customer types
export interface Customer {
  id: number;
  user_id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  tax_id?: string;
  address?: string;
  city?: string;
  country?: string;
  trn_number?: string;
  is_vat_registered?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  tax_id?: string;
  address?: string;
  city?: string;
  country?: string;
  trn_number?: string;
  is_vat_registered?: boolean;
}

// Truck types
export interface Truck {
  id: number;
  user_id: number;
  plate_number: string;
  truck_type: string;
  status: 'available' | 'rented' | 'maintenance';
  monthly_rate: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TruckFormData {
  plate_number: string;
  truck_type: string;
  status: 'available' | 'rented' | 'maintenance';
  monthly_rate: number;
  notes?: string;
}

// Driver types
export interface Driver {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  status: 'available' | 'assigned' | 'on_leave';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverFormData {
  full_name: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  status: 'available' | 'assigned' | 'on_leave';
  notes?: string;
}

// Invoice types
export interface LineItem {
  id?: number;
  productId?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxPercent?: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid';

export interface Invoice {
  id: number;
  user_id: number;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  customer_address?: string;
  invoice_date: string;
  due_date: string;
  lineItems?: LineItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  grand_total: number;
  status: InvoiceStatus;
  notes?: string;
  company_trn?: string; // Company TRN snapshot
  customer_trn?: string; // Customer TRN snapshot
  vat_rate?: number; // VAT rate snapshot (5%)
  created_at: string;
  updated_at: string;
}

export interface InvoiceFormData {
  customerId: number;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  status: InvoiceStatus;
  notes?: string;
}

// Payment types
export type PaymentMethod = 'cash' | 'bank_transfer' | 'other';

export interface Payment {
  id: number;
  user_id: number;
  invoice_id: number;
  invoice_number: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentFormData {
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Report types
export interface ReportData {
  totalIncome: number;
  pendingAmount: number;
  avgInvoice: number;
  paidInvoiceCount: number;
  unpaidInvoiceCount: number;
  monthlyData: Record<string, number>;
  statusCounts: {
    draft: number;
    sent: number;
    partially_paid: number;
    paid: number;
  };
  topCustomers: Array<{ name: string; total: number }>;
  methodTotals: {
    cash: number;
    bank_transfer: number;
    other: number;
  };
}

// Auth types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// Product types
export * from './product';

// Quote types
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted';

export interface Quote {
  id: number;
  user_id: number;
  quote_number: string;
  customer_id: number;
  customer_name: string;
  quote_date: string;
  expiry_date: string;
  lineItems?: LineItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  grand_total: number;
  status: QuoteStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteFormData {
  customerId: number;
  customerName: string;
  quoteDate: string;
  expiryDate: string;
  lineItems: LineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  status: QuoteStatus;
  notes?: string;
}

