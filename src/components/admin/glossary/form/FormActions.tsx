
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

export function FormActions({ isSubmitting, onCancel, isEditing }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Term' : 'Create Term'}
      </Button>
    </div>
  );
}
