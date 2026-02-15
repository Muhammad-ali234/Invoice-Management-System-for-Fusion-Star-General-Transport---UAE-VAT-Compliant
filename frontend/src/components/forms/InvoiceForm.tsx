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
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useCachedTrucks } from '@/contexts/DataLoaderContext';

interface InvoiceFormProps {
  customers: Customer[];
  initialData?: InvoiceFormData;
  onSubmit: (data: InvoiceFormData, status: 'draft' | 'sent') => Promise<void>;
  onCancel: () => void;
}

/**
 * Improved InvoiceForm component with better UX
 * - Cleaner line items table
 * - Live calculations with visual feedback
 * - Payment terms dropdown
 * - Collapsible sections
 * - Sticky summary bar
 * - Better button hierarchy
 * - Currency selector (AED/USD)
 */
export function InvoiceForm({ customers, initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    details: false,
    items: false,
    calculations: false,
    notes: true, // Collapsed by default
  });
  
  const { trucks } = useCachedTrucks(); // Get vehicles for selection
  
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
    setValue,
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
  const invoiceDate = watch('invoiceDate');

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

  // Payment terms handler
  const handlePaymentTerms = (days: number) => {
    if (!invoiceDate) return;
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + days);
    setValue('dueDate', formatDateForInput(date));
  };

  // Handle Enter key to add new line
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && index === fields.length - 1) {
      e.preventDefault();
      append({ description: '', quantity: 1, rate: 0, amount: 0 });
    }
  };

  const toggleSection = (section: keyof typeof sectionsCollapsed) => {
    setSectionsCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Format currency based on selected currency
  const formatCurrencyWithSymbol = (amount: number) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return formatCurrency(amount); // AED (Rs format)
  };

  // Add vehicle to line items
  const addVehicleToLineItems = (vehicleId: string) => {
    const vehicle = trucks.find(t => t.id.toString() === vehicleId);
    if (vehicle) {
      append({
        description: `Monthly Rental - ${vehicle.truck_type} (${vehicle.plate_number})`,
        quantity: 1,
        rate: vehicle.monthly_rate || 0,
        amount: vehicle.monthly_rate || 0,
      });
    }
  };

  const customerOptions = [
    { value: '', label: 'Select Customer / Customer Chunein' },
    ...customers.map((c) => ({ value: c.id.toString(), label: c.name })),
  ];

  const paymentTermsOptions = [
    { value: '0', label: 'Due on Receipt' },
    { value: '7', label: 'Net 7 Days' },
    { value: '15', label: 'Net 15 Days' },
    { value: '30', label: 'Net 30 Days' },
    { value: 'custom', label: 'Custom' },
  ];

  const vehicleOptions = [
    { value: '', label: 'Select Vehicle (Optional)' },
    ...trucks.map(t => ({
      value: t.id.toString(),
      label: `${t.truck_type} - ${t.plate_number} (${formatCurrencyWithSymbol(t.monthly_rate)}/month)`
    }))
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Invoice Details Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('details')}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Invoice Details / Invoice ki Tafseel</h3>
          {sectionsCollapsed.details ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        
        {!sectionsCollapsed.details && (
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Customer / Customer"
                options={customerOptions}
                required
                error={errors.customerId?.message}
                {...register('customerId')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency / Currency
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'AED' | 'USD')}
                >
                  <option value="AED">AED (Dirham) - د.إ</option>
                  <option value="USD">USD (Dollar) - $</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Invoice Date / Tarikh"
                type="date"
                required
                error={errors.invoiceDate?.message}
                {...register('invoiceDate')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value !== 'custom') {
                      handlePaymentTerms(parseInt(value));
                    }
                  }}
                >
                  {paymentTermsOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Due Date / Akhri Tarikh"
                type="date"
                required
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Line Items Section - Improved Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('items')}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Line Items / Items ({fields.length})</h3>
          {sectionsCollapsed.items ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        
        {!sectionsCollapsed.items && (
          <div className="px-6 pb-6">
            {/* Quick Add Vehicle */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Add Vehicle / Vehicle Jaldi Add Karein
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.value) {
                      addVehicleToLineItems(e.target.value);
                      e.target.value = ''; // Reset selection
                    }
                  }}
                >
                  {vehicleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600 self-center whitespace-nowrap">
                  or add manually below
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Description</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700 w-20">Qty</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700 w-32">Rate</th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700 w-32">Amount</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Monthly Rental – 3 Ton Pickup"
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          {...register(`lineItems.${index}.description`)}
                        />
                        {errors.lineItems?.[index]?.description && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.lineItems[index]?.description?.message}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500"
                          {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500"
                          {...register(`lineItems.${index}.rate`, { valueAsNumber: true })}
                        />
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900">
                        {formatCurrencyWithSymbol(
                          calculateLineAmount(
                            lineItems[index]?.quantity || 0,
                            lineItems[index]?.rate || 0
                          )
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md transition-colors"
                            title="Delete item"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Plus size={18} />
              <span>Add Line Item</span>
            </button>
          </div>
        )}
      </div>

      {/* Calculations Section - Improved Layout */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('calculations')}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Calculations / Hisab</h3>
          {sectionsCollapsed.calculations ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        
        {!sectionsCollapsed.calculations && (
          <div className="px-6 pb-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-lg font-semibold">{formatCurrencyWithSymbol(calculatedTotals.subtotal)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center gap-4 py-2 border-t border-gray-200">
              <div className="flex-1">
                <Input
                  label="Discount %"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  error={errors.discountPercent?.message}
                  {...register('discountPercent', { valueAsNumber: true })}
                />
              </div>
              <div className="flex-1 text-right">
                <span className="text-sm text-gray-600">Discount Amount</span>
                <p className="text-lg font-semibold text-red-600">
                  - {formatCurrencyWithSymbol(calculatedTotals.discountAmount)}
                </p>
              </div>
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center gap-4 py-2 border-t border-gray-200">
              <div className="flex-1">
                <Input
                  label="Tax % (VAT)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  error={errors.taxPercent?.message}
                  {...register('taxPercent', { valueAsNumber: true })}
                />
              </div>
              <div className="flex-1 text-right">
                <span className="text-sm text-gray-600">Tax Amount</span>
                <p className="text-lg font-semibold text-green-600">
                  + {formatCurrencyWithSymbol(calculatedTotals.taxAmount)}
                </p>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center py-4 border-t-2 border-gray-300 bg-gradient-to-r from-blue-50 to-transparent px-4 rounded-lg">
              <span className="text-xl font-bold text-gray-900">💰 Grand Total:</span>
              <span className="text-3xl font-bold text-blue-600 animate-pulse">
                {formatCurrencyWithSymbol(calculatedTotals.grandTotal)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section - Collapsed by Default */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('notes')}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold">Notes / Notes (Optional)</h3>
          {sectionsCollapsed.notes ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        
        {!sectionsCollapsed.notes && (
          <div className="px-6 pb-6">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any additional notes / Koi aur note"
              {...register('notes')}
            />
          </div>
        )}
      </div>

      {/* Sticky Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Summary */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="whitespace-nowrap">
                <span className="text-gray-600">Subtotal: </span>
                <span className="font-semibold">{formatCurrencyWithSymbol(calculatedTotals.subtotal)}</span>
              </div>
              <div className="hidden md:block text-gray-300">|</div>
              <div className="whitespace-nowrap">
                <span className="text-gray-600">Grand Total: </span>
                <span className="text-lg md:text-xl font-bold text-blue-600">
                  {formatCurrencyWithSymbol(calculatedTotals.grandTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons - Improved Hierarchy */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onCancel} 
                disabled={submitting}
                className="border-2 border-gray-300 text-sm px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSubmit((data) => handleFormSubmit(data as InvoiceFormData, 'draft'))}
                loading={submitting}
                className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2"
              >
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmit((data) => handleFormSubmit(data as InvoiceFormData, 'sent'))}
                loading={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-base font-semibold shadow-lg"
              >
                Save & Send ✓
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
