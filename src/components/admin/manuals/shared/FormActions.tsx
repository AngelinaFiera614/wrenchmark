
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SharedFormActionsProps } from './types';

const FormActions: React.FC<SharedFormActionsProps> = ({
  onCancel,
  isSubmitting,
  submitLabel = "Save"
}) => {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;
