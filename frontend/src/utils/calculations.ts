import { LineItem } from '@/types';

/**
 * Calculate line item amount
 * Amount = Quantity × Rate
 */
export function calculateLineAmount(quantity: number, rate: number): number {
  return quantity * rate;
}

/**
 * Calculate subtotal from line items
 * Subtotal = Sum of all line item amounts
 */
export function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Calculate discount amount
 * Discount Amount = Subtotal × (Discount % / 100)
 */
export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return subtotal * (discountPercent / 100);
}

/**
 * Calculate tax amount
 * Tax Amount = (Subtotal - Discount Amount) × (Tax % / 100)
 */
export function calculateTax(subtotal: number, discountAmount: number, taxPercent: number): number {
  return (subtotal - discountAmount) * (taxPercent / 100);
}

/**
 * Calculate grand total
 * Grand Total = Subtotal - Discount Amount + Tax Amount
 */
export function calculateGrandTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number
): number {
  return subtotal - discountAmount + taxAmount;
}

/**
 * Calculate all invoice totals at once
 * Returns all calculated values for an invoice
 */
export function calculateInvoiceTotals(
  lineItems: LineItem[],
  discountPercent: number,
  taxPercent: number
) {
  const subtotal = calculateSubtotal(lineItems);
  const discountAmount = calculateDiscount(subtotal, discountPercent);
  const taxAmount = calculateTax(subtotal, discountAmount, taxPercent);
  const grandTotal = calculateGrandTotal(subtotal, discountAmount, taxAmount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

// Aliases for backward compatibility
export const calculateLineItemAmount = calculateLineAmount;
export const calculateDiscountAmount = calculateDiscount;
export const calculateTaxAmount = calculateTax;
