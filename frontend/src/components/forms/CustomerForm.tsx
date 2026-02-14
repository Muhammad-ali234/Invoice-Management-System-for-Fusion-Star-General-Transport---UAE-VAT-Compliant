import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '@/utils/validation';
import { CustomerFormData } from '@/types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * CustomerForm component
 * Form for creating/editing customers
 */
export function CustomerForm({ initialData, onSubmit, onCancel }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {},
  });

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      alert(error.message || 'Failed to save customer');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Name / Naam"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone / Phone"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Input
        label="Company / Company"
        error={errors.company?.message}
        {...register('company')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="TRN (Tax Registration Number)"
          placeholder="15 digits (if VAT registered)"
          error={errors.tax_id?.message}
          {...register('tax_id')}
        />

        <div className="flex items-center pt-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              {...register('is_vat_registered')}
            />
            <span className="text-sm text-gray-700">VAT Registered</span>
          </label>
        </div>
      </div>

      <Input
        label="Address / Pata"
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City / Sheher"
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          label="Country / Mulk"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel / Radd
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Save / Bachao
        </Button>
      </div>
    </form>
  );
}
