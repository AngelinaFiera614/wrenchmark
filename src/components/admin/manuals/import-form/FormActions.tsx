
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  submitLabel = "Import Manual"
}) => {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Importing...</span>
          </div>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};

export default FormActions;
