import { useForm } from 'react-hook-form';
import { useTrucks } from '@/hooks/useTrucks';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Truck, TruckFormData } from '@/types';

interface TruckFormProps {
  truck?: Truck | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const truckTypes = [
  '1-ton pickup',
  '3-ton truck',
  '7-ton truck',
  '10-ton truck',
  'Refrigerated truck',
  'Flatbed truck',
  'Box truck',
  'Other',
];

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented' },
  { value: 'maintenance', label: 'Maintenance' },
];

export default function TruckForm({ truck, onSuccess, onCancel }: TruckFormProps) {
  const { createTruck, updateTruck } = useTrucks();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TruckFormData>({
    defaultValues: truck
      ? {
          plate_number: truck.plate_number,
          truck_type: truck.truck_type,
          status: truck.status,
          monthly_rate: truck.monthly_rate,
          notes: truck.notes || '',
        }
      : {
          plate_number: '',
          truck_type: '1-ton pickup',
          status: 'available',
          monthly_rate: 0,
          notes: '',
        },
  });

  const onSubmit = async (data: TruckFormData) => {
    try {
      if (truck) {
        await updateTruck(truck.id, data);
      } else {
        await createTruck(data);
      }
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save truck');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Plate Number"
        {...register('plate_number', {
          required: 'Plate number is required',
          maxLength: { value: 20, message: 'Plate number must be 20 characters or less' },
        })}
        error={errors.plate_number?.message}
        placeholder="e.g., AD-12345"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Truck Type</label>
        <select
          {...register('truck_type', { required: 'Truck type is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {truckTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.truck_type && (
          <p className="mt-1 text-sm text-red-600">{errors.truck_type.message}</p>
        )}
      </div>

      <Select
        label="Status"
        {...register('status', { required: 'Status is required' })}
        options={statusOptions}
        error={errors.status?.message}
      />

      <Input
        label="Monthly Rate (AED)"
        type="number"
        step="0.01"
        {...register('monthly_rate', {
          required: 'Monthly rate is required',
          min: { value: 0, message: 'Monthly rate must be positive' },
          valueAsNumber: true,
        })}
        error={errors.monthly_rate?.message}
        placeholder="1000.00"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional information about the truck..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : truck ? 'Update Truck' : 'Add Truck'}
        </Button>
      </div>
    </form>
  );
}
