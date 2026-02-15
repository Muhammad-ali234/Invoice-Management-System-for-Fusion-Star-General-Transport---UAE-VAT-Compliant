import { useForm } from 'react-hook-form';
import { useContracts } from '@/hooks/useContracts';
import { useCachedCustomers, useCachedTrucks, useCachedDrivers } from '@/contexts/DataLoaderContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Contract, ContractFormData } from '@/types';

interface ContractFormProps {
  contract?: Contract | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ContractForm({ contract, onSuccess, onCancel }: ContractFormProps) {
  const { createContract, updateContract } = useContracts();
  const { customers } = useCachedCustomers();
  const { trucks } = useCachedTrucks();
  const { drivers } = useCachedDrivers();
  
  // Filter available trucks and drivers
  const availableTrucks = trucks.filter(t => t.status === 'available' || t.id === contract?.truck_id);
  const availableDrivers = drivers.filter(d => d.status === 'available' || d.id === contract?.driver_id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormData & { status?: string }>({
    defaultValues: contract
      ? {
          customer_id: contract.customer_id,
          truck_id: contract.truck_id || undefined,
          driver_id: contract.driver_id || undefined,
          start_date: contract.start_date.split('T')[0],
          end_date: contract.end_date.split('T')[0],
          monthly_amount: contract.monthly_amount,
          billing_day: contract.billing_day,
          notes: contract.notes || '',
          status: contract.status,
        }
      : {
          customer_id: 0,
          truck_id: undefined,
          driver_id: undefined,
          start_date: '',
          end_date: '',
          monthly_amount: 0,
          billing_day: 1,
          notes: '',
        },
  });

  const startDate = watch('start_date');

  const onSubmit = async (data: ContractFormData & { status?: string }) => {
    try {
      // Convert string IDs to numbers and handle empty values
      const formData = {
        ...data,
        customer_id: Number(data.customer_id),
        truck_id: data.truck_id ? Number(data.truck_id) : undefined,
        driver_id: data.driver_id ? Number(data.driver_id) : undefined,
        monthly_amount: Number(data.monthly_amount),
        billing_day: Number(data.billing_day),
      };

      if (contract) {
        await updateContract(contract.id, formData);
      } else {
        await createContract(formData);
      }
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save contract');
    }
  };

  // Prepare customer options
  const customerOptions = customers?.map((c: any) => ({
    value: c.id.toString(),
    label: c.name,
  })) || [];

  // Prepare truck options (include current truck if editing)
  const truckOptions = [
    { value: '', label: 'No truck assigned' },
    ...(availableTrucks?.map((t) => ({
      value: t.id.toString(),
      label: `${t.plate_number} - ${t.truck_type}`,
    })) || []),
  ];

  // If editing and truck is assigned, add it to options if not already there
  if (contract?.truck_id && !truckOptions.find(opt => opt.value === contract.truck_id?.toString())) {
    truckOptions.push({
      value: contract.truck_id.toString(),
      label: `${contract.truck_plate} - ${contract.truck_type} (Current)`,
    });
  }

  // Prepare driver options (include current driver if editing)
  const driverOptions = [
    { value: '', label: 'No driver assigned' },
    ...(availableDrivers?.map((d) => ({
      value: d.id.toString(),
      label: `${d.full_name} - ${d.phone}`,
    })) || []),
  ];

  // If editing and driver is assigned, add it to options if not already there
  if (contract?.driver_id && !driverOptions.find(opt => opt.value === contract.driver_id?.toString())) {
    driverOptions.push({
      value: contract.driver_id.toString(),
      label: `${contract.driver_name} - ${contract.driver_phone} (Current)`,
    });
  }

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Customer"
        {...register('customer_id', {
          required: 'Customer is required',
          validate: (value) => Number(value) > 0 || 'Please select a customer',
        })}
        options={customerOptions}
        error={errors.customer_id?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Truck (Optional)"
          {...register('truck_id')}
          options={truckOptions}
          error={errors.truck_id?.message}
        />

        <Select
          label="Driver (Optional)"
          {...register('driver_id')}
          options={driverOptions}
          error={errors.driver_id?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          {...register('start_date', {
            required: 'Start date is required',
          })}
          error={errors.start_date?.message}
        />

        <Input
          label="End Date"
          type="date"
          {...register('end_date', {
            required: 'End date is required',
            validate: (value) => {
              if (!startDate) return true;
              return new Date(value) > new Date(startDate) || 'End date must be after start date';
            },
          })}
          error={errors.end_date?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monthly Amount (AED)"
          type="number"
          step="0.01"
          {...register('monthly_amount', {
            required: 'Monthly amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          error={errors.monthly_amount?.message}
          placeholder="e.g., 1000.00"
        />

        <Input
          label="Billing Day (1-28)"
          type="number"
          {...register('billing_day', {
            required: 'Billing day is required',
            min: { value: 1, message: 'Billing day must be between 1 and 28' },
            max: { value: 28, message: 'Billing day must be between 1 and 28' },
          })}
          error={errors.billing_day?.message}
          placeholder="e.g., 1"
        />
      </div>

      {contract && (
        <Select
          label="Status"
          {...register('status')}
          options={statusOptions}
          error={errors.status?.message}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional contract details..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : contract ? 'Update Contract' : 'Create Contract'}
        </Button>
      </div>
    </form>
  );
}
