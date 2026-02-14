import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { useCustomers } from '@/hooks/useCustomers';
import { useQuotes } from '@/hooks/useQuotes';
import { QuoteFormData, LineItem } from '@/types';
import { calculateLineItemAmount, calculateSubtotal, calculateTaxAmount, calculateDiscountAmount, calculateGrandTotal } from '@/utils/calculations';

export function QuoteCreatePage() {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { createQuote } = useQuotes();

  const [formData, setFormData] = useState<QuoteFormData>({
    customerId: 0,
    customerName: '',
    quoteDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    lineItems: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 0,
    status: 'draft',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  // Recalculate totals when line items, discount, or tax change
  useEffect(() => {
    const subtotal = calculateSubtotal(formData.lineItems);
    const discountAmount = calculateDiscountAmount(subtotal, formData.discountPercent);
    const taxAmount = calculateTaxAmount(subtotal, discountAmount, formData.taxPercent);
    const grandTotal = calculateGrandTotal(subtotal, discountAmount, taxAmount);

    setFormData((prev) => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
    }));
  }, [formData.lineItems, formData.discountPercent, formData.taxPercent]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find((c) => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || '',
    });
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };

    // Recalculate amount for this line item
    if (field === 'quantity' || field === 'rate') {
      newLineItems[index].amount = calculateLineItemAmount(
        newLineItems[index].quantity,
        newLineItems[index].rate
      );
    }

    setFormData({ ...formData, lineItems: newLineItems });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeLineItem = (index: number) => {
    if (formData.lineItems.length > 1) {
      const newLineItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData({ ...formData, lineItems: newLineItems });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || formData.customerId === 0) {
      alert('Please select a customer');
      return;
    }

    if (formData.lineItems.some((item) => !item.description)) {
      alert('Please fill in all line item descriptions');
      return;
    }

    setLoading(true);
    try {
      await createQuote(formData);
      navigate('/quotes');
    } catch (error) {
      alert('Failed to create quote');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setFormData({ ...formData, status: 'draft' });
    await handleSubmit(new Event('submit') as any);
  };

  const handleSaveAndSend = async () => {
    setFormData({ ...formData, status: 'sent' });
    await handleSubmit(new Event('submit') as any);
  };

  const customerOptions = [
    { value: '0', label: 'Select a customer...' },
    ...customers.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    }))
  ];

  return (
    <Layout title="Create Quote">
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
              <span className="font-semibold">Rs {formData.subtotal.toFixed(2)}</span>
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
                <span className="text-sm text-gray-600">- Rs {formData.discountAmount.toFixed(2)}</span>
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
                <span className="text-sm text-gray-600">+ Rs {formData.taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Grand Total:</span>
              <span>Rs {formData.grandTotal.toFixed(2)}</span>
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
          <Button type="button" variant="secondary" onClick={handleSaveAsDraft} disabled={loading}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quote'}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
