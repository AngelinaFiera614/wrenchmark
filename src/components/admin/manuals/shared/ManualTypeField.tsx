
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { manualTypes } from '../ManualFormSchema';

// Generic interface that works for any form with manual_type field
interface ManualTypeFieldProps {
  control: Control<any>;
  name?: string;
}

const ManualTypeField: React.FC<ManualTypeFieldProps> = ({ 
  control, 
  name = "manual_type" // Default field name
}) => {
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
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select manual type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {manualTypes.map((type) => (
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
