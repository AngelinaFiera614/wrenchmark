
import React from 'react';
import { Control } from 'react-hook-form';
import SharedTitleField from '../shared/TitleField';
import { ImportManualFormValues } from '../ImportManualFormSchema';

export interface TitleFieldProps {
  control: Control<ImportManualFormValues>;
  disabled?: boolean;
}

const TitleField: React.FC<TitleFieldProps> = ({ control, disabled }) => {
  return <SharedTitleField control={control} disabled={disabled} />;
};

export default TitleField;
