import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Loading } from '@/components/common/Loading';
import { useCustomers } from '@/hooks/useCustomers';
import { useQuotes } from '@/hooks/useQuotes';
import { QuoteFormData, LineItem } from '@/types';
import { calculateLineItemAmount, calculateSubtotal, calculateTaxAmount, calculateDiscountAmount, calculateGrandTotal } from '@/utils/calculations';

export function QuoteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { getQuote, updateQuote } = useQuotes();

  const [formData, setFormData] = useState<QuoteFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [id]);

  const loadQuote = async () => {
    if (!id) return;
    const quote = await getQuote(parseInt(id));
    if (!quote) {
      alert('Quote not found');
      navigate('/quotes');
      return;
    }
    setFormData({
      customerId: quote.customer_id,
      customerName: quote.customer_name,
      quoteDate: quote.quote_date.split('T')[0],
      expiryDate: quote.expiry_date.split('T')[0],
      lineItems: quote.lineItems || [],
      subtotal: Number(quote.subtotal),
      discountPercent: Number(quote.discount_percent),
      discountAmount: Number(quote.discount_amount),
      taxPercent: Number(quote.tax_percent),
      taxAmount: Number(quote.tax_amount),
      grandTotal: Number(quote.grand_total),
      status: quote.status,
      notes: quote.notes || '',
    });
    setLoading(false);
  };

  // Recalculate totals when line items, discount, or tax change
  useEffect(() => {
    if (!formData) return;

    const subtotal = calculateSubtotal(formData.lineItems);
    const discountAmount = calculateDiscountAmount(subtotal, Number(formData.discountPercent));
    const taxAmount = calculateTaxAmount(subtotal, discountAmount, Number(formData.taxPercent));
    const grandTotal = calculateGrandTotal(subtotal, discountAmount, taxAmount);

    setFormData((prev) => prev ? ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
    }) : null);
  }, [formData?.lineItems, formData?.discountPercent, formData?.taxPercent]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return;
    const customerId = parseInt(e.target.value);
    const customer = customers.find((c) => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || '',
    });
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
    if (!formData) return;
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      newLineItems[index].amount = calculateLineItemAmount(
        Number(newLineItems[index].quantity),
        Number(newLineItems[index].rate)
      );
    }

    setFormData({ ...formData, lineItems: newLineItems });
  };

  const addLineItem = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeLineItem = (index: number) => {
    if (!formData || formData.lineItems.length <= 1) return;
    const newLineItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData({ ...formData, lineItems: newLineItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    if (!formData.customerId) {
      alert('Please select a customer');
      return;
    }

    if (formData.lineItems.some((item) => !item.description)) {
      alert('Please fill in all line item descriptions');
      return;
    }

    setSaving(true);
    try {
      await updateQuote(parseInt(id), formData);
      navigate('/quotes');
    } catch (error) {
      alert('Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Edit Quote">
        <Loading />
      </Layout>
    );
  }

  if (!formData) return null;

  const customerOptions = customers.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  return (
    <Layout title="Edit Quote">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Dates */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quote Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer *"
              options={customerOptions}
              value={formData.customerId.toString()}
              onChange={handleCustomerChange}
              required
            />
            <Input
              label="Quote Date *"
              type="date"
              value={formData.quoteDate}
              onChange={(e) => setFormData({ ...formData, quoteDate: e.target.value })}
              required
            />
            <Input
              label="Expiry Date *"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Items</h2>
            <Button type="button" size="sm" onClick={addLineItem}>
              + Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Quantity"
                    type="number"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Rate"
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Amount"
                    type="number"
                    value={item.amount}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  {formData.lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Totals</h2>
          <div className="space-y-4 max-w-md ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">Rs {Number(formData.subtotal || 0).toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Discount %"
                type="number"
                step="0.01"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })}
              />
              <div className="flex items-end">
                <span className="text-sm text-gray-600">- Rs {Number(formData.discountAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tax %"
                type="number"
                step="0.01"
                value={formData.taxPercent}
                onChange={(e) => setFormData({ ...formData, taxPercent: parseFloat(e.target.value) || 0 })}
              />
              <div className="flex items-end">
                <span className="text-sm text-gray-600">+ Rs {Number(formData.taxAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Grand Total:</span>
              <span>Rs {Number(formData.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Additional notes or terms..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/quotes')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
