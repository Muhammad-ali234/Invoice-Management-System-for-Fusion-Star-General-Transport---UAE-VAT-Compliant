// Helper functions to map between frontend (camelCase) and backend (snake_case)

import { Customer, Invoice, Payment } from '@/types';

// Map database customer to frontend format
export function mapCustomer(dbCustomer: any): Customer {
  return {
    id: dbCustomer.id,
    user_id: dbCustomer.user_id,
    name: dbCustomer.name,
    email: dbCustomer.email,
    phone: dbCustomer.phone,
    company: dbCustomer.company,
    tax_id: dbCustomer.tax_id,
    address: dbCustomer.address,
    city: dbCustomer.city,
    country: dbCustomer.country,
    created_at: dbCustomer.created_at,
    updated_at: dbCustomer.updated_at,
  };
}

// Map database invoice to frontend format
export function mapInvoice(dbInvoice: any): Invoice {
  return {
    id: dbInvoice.id,
    user_id: dbInvoice.user_id,
    invoice_number: dbInvoice.invoice_number,
    customer_id: dbInvoice.customer_id,
    customer_name: dbInvoice.customer_name,
    invoice_date: dbInvoice.invoice_date,
    due_date: dbInvoice.due_date,
    lineItems: dbInvoice.lineItems,
    subtotal: dbInvoice.subtotal,
    discount_percent: dbInvoice.discount_percent,
    discount_amount: dbInvoice.discount_amount,
    tax_percent: dbInvoice.tax_percent,
    tax_amount: dbInvoice.tax_amount,
    grand_total: dbInvoice.grand_total,
    status: dbInvoice.status,
    notes: dbInvoice.notes,
    created_at: dbInvoice.created_at,
    updated_at: dbInvoice.updated_at,
  };
}

// Map database payment to frontend format
export function mapPayment(dbPayment: any): Payment {
  return {
    id: dbPayment.id,
    user_id: dbPayment.user_id,
    invoice_id: dbPayment.invoice_id,
    invoice_number: dbPayment.invoice_number,
    amount: dbPayment.amount,
    payment_date: dbPayment.payment_date,
    payment_method: dbPayment.payment_method,
    notes: dbPayment.notes,
    created_at: dbPayment.created_at,
    updated_at: dbPayment.updated_at,
  };
}
