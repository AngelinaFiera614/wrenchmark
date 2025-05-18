
import React from 'react';
import SharedFormActions from '../shared/FormActions';

export interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting
}) => {
  return (
    <SharedFormActions
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitLabel="Import Manual"
    />
  );
};

export default FormActions;
