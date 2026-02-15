import { useForm } from 'react-hook-form';
import { useExpenses } from '@/hooks/useExpenses';
import { useCachedTrucks, useCachedDrivers } from '@/contexts/DataLoaderContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Expense, ExpenseFormData } from '@/types';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const categoryOptions = [
  { value: 'fuel', label: 'Fuel' },
  { value: 'salik', label: 'Salik (Toll)' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'salary', label: 'Salary' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
  const { createExpense, updateExpense } = useExpenses();
  const { trucks } = useCachedTrucks();
  const { drivers } = useCachedDrivers();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: expense
      ? {
          expense_date: expense.expense_date.split('T')[0],
          category: expense.category,
          truck_id: expense.truck_id || undefined,
          driver_id: expense.driver_id || undefined,
          amount: expense.amount,
          description: expense.description || '',
          receipt_number: expense.receipt_number || '',
        }
      : {
          expense_date: new Date().toISOString().split('T')[0],
          category: 'fuel',
          truck_id: undefined,
          driver_id: undefined,
          amount: 0,
          description: '',
          receipt_number: '',
        },
  });

  const category = watch('category');

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const formData = {
        ...data,
        truck_id: data.truck_id ? Number(data.truck_id) : undefined,
        driver_id: data.driver_id ? Number(data.driver_id) : undefined,
        amount: Number(data.amount),
      };

      if (expense) {
        await updateExpense(expense.id, formData);
      } else {
        await createExpense(formData);
      }
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save expense');
    }
  };

  // Prepare truck options
  const truckOptions = [
    { value: '', label: 'No truck' },
    ...(trucks?.map((t) => ({
      value: t.id.toString(),
      label: `${t.plate_number} - ${t.truck_type}`,
    })) || []),
  ];

  // Prepare driver options
  const driverOptions = [
    { value: '', label: 'No driver' },
    ...(drivers?.map((d) => ({
      value: d.id.toString(),
      label: `${d.full_name}`,
    })) || []),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expense Date"
          type="date"
          {...register('expense_date', {
            required: 'Expense date is required',
          })}
          error={errors.expense_date?.message}
        />

        <Select
          label="Category"
          {...register('category', { required: 'Category is required' })}
          options={categoryOptions}
          error={errors.category?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(category === 'fuel' || category === 'salik' || category === 'maintenance') && (
          <Select
            label="Truck (Optional)"
            {...register('truck_id')}
            options={truckOptions}
            error={errors.truck_id?.message}
          />
        )}

        {category === 'salary' && (
          <Select
            label="Driver (Optional)"
            {...register('driver_id')}
            options={driverOptions}
            error={errors.driver_id?.message}
          />
        )}

        <Input
          label="Amount (AED)"
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          error={errors.amount?.message}
          placeholder="e.g., 150.00"
        />
      </div>

      <Input
        label="Receipt Number (Optional)"
        {...register('receipt_number', {
          maxLength: { value: 50, message: 'Receipt number must be 50 characters or less' },
        })}
        error={errors.receipt_number?.message}
        placeholder="e.g., REC-12345"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional details about this expense..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
