
import React from 'react';
import { Control } from 'react-hook-form';
import SharedMotorcycleFields from '../shared/MotorcycleFields';
import { ImportManualFormValues } from '../ImportManualForm';

interface MotorcycleFieldsProps {
  control: Control<ImportManualFormValues>;
}

const MotorcycleFields: React.FC<MotorcycleFieldsProps> = ({ control }) => {
  return <SharedMotorcycleFields control={control} />;
};

export default MotorcycleFields;
