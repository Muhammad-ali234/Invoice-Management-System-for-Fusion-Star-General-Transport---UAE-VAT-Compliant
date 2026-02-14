import { useForm } from 'react-hook-form';
import { useDrivers } from '@/hooks/useDrivers';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Driver, DriverFormData } from '@/types';

interface DriverFormProps {
  driver?: Driver | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'on_leave', label: 'On Leave' },
];

export default function DriverForm({ driver, onSuccess, onCancel }: DriverFormProps) {
  const { createDriver, updateDriver } = useDrivers();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    defaultValues: driver
      ? {
          full_name: driver.full_name,
          phone: driver.phone,
          license_number: driver.license_number,
          license_expiry: driver.license_expiry.split('T')[0], // Format for date input
          status: driver.status,
          notes: driver.notes || '',
        }
      : {
          full_name: '',
          phone: '',
          license_number: '',
          license_expiry: '',
          status: 'available',
          notes: '',
        },
  });

  const onSubmit = async (data: DriverFormData) => {
    try {
      if (driver) {
        await updateDriver(driver.id, data);
      } else {
        await createDriver(data);
      }
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save driver');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        {...register('full_name', {
          required: 'Full name is required',
          maxLength: { value: 100, message: 'Full name must be 100 characters or less' },
        })}
        error={errors.full_name?.message}
        placeholder="e.g., Ahmed Mohammed"
      />

      <Input
        label="Phone Number"
        {...register('phone', {
          required: 'Phone number is required',
          maxLength: { value: 20, message: 'Phone number must be 20 characters or less' },
        })}
        error={errors.phone?.message}
        placeholder="e.g., +971501234567"
      />

      <Input
        label="License Number"
        {...register('license_number', {
          required: 'License number is required',
          maxLength: { value: 50, message: 'License number must be 50 characters or less' },
        })}
        error={errors.license_number?.message}
        placeholder="e.g., DL-123456"
      />

      <Input
        label="License Expiry Date"
        type="date"
        {...register('license_expiry', {
          required: 'License expiry date is required',
        })}
        error={errors.license_expiry?.message}
      />

      <Select
        label="Status"
        {...register('status', { required: 'Status is required' })}
        options={statusOptions}
        error={errors.status?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional information about the driver..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : driver ? 'Update Driver' : 'Add Driver'}
        </Button>
      </div>
    </form>
  );
}
