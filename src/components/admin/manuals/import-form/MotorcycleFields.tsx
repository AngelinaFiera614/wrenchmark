
import React from 'react';
import { Control } from 'react-hook-form';
import SharedMotorcycleFields from '../shared/MotorcycleFields';
import { ImportManualFormValues } from '../ImportManualFormSchema';

export interface MotorcycleFieldsProps {
  control: Control<ImportManualFormValues>;
  disabled?: boolean;
}

const MotorcycleFields: React.FC<MotorcycleFieldsProps> = ({ control, disabled }) => {
  return <SharedMotorcycleFields control={control} disabled={disabled} />;
};

export default MotorcycleFields;
