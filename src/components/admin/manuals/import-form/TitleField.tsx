
import React from 'react';
import { Control } from 'react-hook-form';
import SharedTitleField from '../shared/TitleField';
import { ImportManualFormValues } from '../ImportManualForm';

interface TitleFieldProps {
  control: Control<ImportManualFormValues>;
}

const TitleField: React.FC<TitleFieldProps> = ({ control }) => {
  return <SharedTitleField control={control} />;
};

export default TitleField;
