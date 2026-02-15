import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSchema } from '@/utils/validation';
import { InvoiceFormData, Customer } from '@/types';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { formatDateForInput, formatCurrency } from '@/utils/formatting';
import { calculateLineAmount, calculateInvoiceTotals } from '@/utils/calculations';

interface InvoiceFormProps {
  customers: Customer[];
  initialData?: InvoiceFormData;
  onSubmit: (data: InvoiceFormData, status: 'draft' | 'sent') => Promise<void>;
  onCancel: () => void;
}

/**
 * InvoiceForm component
 * Complex form for creating/editing invoices with real-time calculations
 */
export function InvoiceForm({ customers, initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [calculatedTotals, setCalculatedTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      customerId: 0,
      customerName: '',
      invoiceDate: formatDateForInput(new Date()),
      dueDate: formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      lineItems: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5, // UAE VAT rate
      taxAmount: 0,
      grandTotal: 0,
      status: 'draft',
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  // Watch form values for real-time calculation
  const lineItems = watch('lineItems');
  const discountPercent = watch('discountPercent') || 0;
  const taxPercent = watch('taxPercent') || 0;

  // Recalculate totals whenever line items or percentages change
  useEffect(() => {
    const updatedLineItems = lineItems.map((item) => ({
      ...item,
      amount: calculateLineAmount(item.quantity || 0, item.rate || 0),
    }));

    const totals = calculateInvoiceTotals(updatedLineItems, discountPercent, taxPercent);
    setCalculatedTotals(totals);
  }, [lineItems, discountPercent, taxPercent]);

  const handleFormSubmit = async (data: InvoiceFormData, status: 'draft' | 'sent') => {
    try {
      setSubmitting(true);
      // Update line item amounts before submitting
      const updatedData = {
        ...data,
        lineItems: data.lineItems.map((item) => ({
          ...item,
          amount: calculateLineAmount(item.quantity, item.rate),
        })),
      };
      await onSubmit(updatedData, status);
    } catch (error: any) {
      alert(error.message || 'Failed to save invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const customerOptions = [
    { value: '', label: 'Select Customer / Customer Chunein' },
    ...customers.map((c) => ({ value: c.id.toString(), label: c.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Invoice Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Invoice Details / Invoice ki Tafseel</h3>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Customer / Customer"
            options={customerOptions}
            required
            error={errors.customerId?.message}
            {...register('customerId')}
          />

          <Input
            label="Invoice Date / Tarikh"
            type="date"
            required
            defaultValue={formatDateForInput(new Date())}
            error={errors.invoiceDate?.message}
            {...register('invoiceDate')}
          />

          <Input
            label="Due Date / Akhri Tarikh"
            type="date"
            required
            defaultValue={formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Line Items / Items</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Description / Tafseel</th>
                <th className="text-left pb-2 w-24">Qty / Tadad</th>
                <th className="text-left pb-2 w-32">Rate / Rate</th>
                <th className="text-left pb-2 w-32">Amount / Raqam</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b">
                  <td className="py-2 pr-2">
                    <input
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="Item description"
                      {...register(`lineItems.${index}.description`)}
                    />
                    {errors.lineItems?.[index]?.description && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.lineItems[index]?.description?.message}
                      </p>
                    )}
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min="1"
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      {...register(`lineItems.${index}.rate`, { valueAsNumber: true })}
                    />
                  </td>
                  <td className="py-2 pr-2 font-semibold">
                    {formatCurrency(
                      calculateLineAmount(
                        lineItems[index]?.quantity || 0,
                        lineItems[index]?.rate || 0
                      )
                    )}
                  </td>
                  <td className="py-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}
        >
          + Add Line / Aur Item
        </Button>
      </div>

      {/* Calculations Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Calculations / Hisab</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">{formatCurrency(calculatedTotals.subtotal)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Discount %"
              type="number"
              step="0.01"
              min="0"
              max="100"
              error={errors.discountPercent?.message}
              {...register('discountPercent', { valueAsNumber: true })}
            />
            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                Discount Amount: {formatCurrency(calculatedTotals.discountAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tax %"
              type="number"
              step="0.01"
              min="0"
              max="100"
              error={errors.taxPercent?.message}
              {...register('taxPercent', { valueAsNumber: true })}
            />
            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                Tax Amount: {formatCurrency(calculatedTotals.taxAmount)}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t-2 border-gray-300">
            <span className="text-lg font-bold">Grand Total / Kul Raqam:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(calculatedTotals.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Notes / Notes</h3>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          rows={3}
          placeholder="Add any additional notes / Koi aur note"
          {...register('notes')}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel / Radd
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit((data) => handleFormSubmit(data as InvoiceFormData, 'draft'))}
          loading={submitting}
        >
          Save Draft / Bachao
        </Button>
        <Button
          type="button"
          onClick={handleSubmit((data) => handleFormSubmit(data as InvoiceFormData, 'sent'))}
          loading={submitting}
        >
          Save & Send / Bhejo
        </Button>
      </div>
    </div>
  );
}
