
import React from 'react';
import { Control } from 'react-hook-form';
import SharedManualTypeField from '../shared/ManualTypeField';
import { ImportManualFormValues } from '../ImportManualForm';

export interface ManualTypeFieldProps {
  control: Control<ImportManualFormValues>;
}

const ManualTypeField: React.FC<ManualTypeFieldProps> = ({ control }) => {
  return <SharedManualTypeField control={control} />;
};

export default ManualTypeField;
