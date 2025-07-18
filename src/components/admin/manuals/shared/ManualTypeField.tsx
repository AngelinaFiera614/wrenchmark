
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { manualTypes } from '../ManualFormSchema';
import { SharedManualTypeFieldProps } from './types';

const ManualTypeField: React.FC<SharedManualTypeFieldProps> = ({ 
  control, 
  name = "manual_type", // Default field name
  disabled
}) => {
  // Filter out any entries with empty values to prevent the Radix UI error
  const validManualTypes = manualTypes.filter(type => type.value && type.value.trim() !== '');

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Manual Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select manual type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validManualTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ManualTypeField;
