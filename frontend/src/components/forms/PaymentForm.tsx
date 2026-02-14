import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema } from '@/utils/validation';
import { PaymentFormData } from '@/types';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { formatDateForInput } from '@/utils/formatting';

interface PaymentFormProps {
  remainingAmount: number;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * PaymentForm component
 * Form for recording payments
 */
export function PaymentForm({ remainingAmount, onSubmit, onCancel }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: formatDateForInput(new Date()),
      paymentMethod: 'cash',
    },
  });

  const handleFormSubmit = async (data: PaymentFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      alert(error.message || 'Failed to record payment');
    }
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash / Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer / Bank Transfer' },
    { value: 'other', label: 'Other / Aur' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Payment Amount / Raqam"
        type="number"
        step="0.01"
        required
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />
      <p className="text-sm text-gray-600">
        Remaining: {remainingAmount.toFixed(2)} / Baqi: {remainingAmount.toFixed(2)}
      </p>

      <Input
        label="Payment Date / Tarikh"
        type="date"
        required
        error={errors.paymentDate?.message}
        {...register('paymentDate')}
      />

      <Select
        label="Payment Method / Tariqa"
        options={paymentMethods}
        required
        error={errors.paymentMethod?.message}
        {...register('paymentMethod')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes / Notes
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          rows={3}
          {...register('notes')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel / Radd
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Save Payment / Bachao
        </Button>
      </div>
    </form>
  );
}
