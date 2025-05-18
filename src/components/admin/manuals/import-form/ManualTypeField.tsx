
import React from 'react';
import { Control } from 'react-hook-form';
import SharedManualTypeField from '../shared/ManualTypeField';
import { ImportManualFormValues } from '../ImportManualFormSchema';

export interface ManualTypeFieldProps {
  control: Control<ImportManualFormValues>;
  disabled?: boolean;
}

const ManualTypeField: React.FC<ManualTypeFieldProps> = ({ control, disabled }) => {
  return <SharedManualTypeField control={control} disabled={disabled} />;
};

export default ManualTypeField;
