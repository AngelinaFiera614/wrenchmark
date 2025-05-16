
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ManualWithMotorcycle } from '@/services/manuals';
import ManualForm from './ManualForm';
import { useManualSubmit } from '@/hooks/useManualSubmit';
import { ManualFormValues } from './ManualFormSchema';

interface AdminManualDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manual: ManualWithMotorcycle | null;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
}

const AdminManualDialog: React.FC<AdminManualDialogProps> = ({ 
  open, 
  onOpenChange, 
  manual, 
  onSaveSuccess 
}) => {
  const { handleSubmit, isSubmitting } = useManualSubmit({ onOpenChange, onSaveSuccess });
  
  // Extract motorcycle details if editing an existing manual
  const defaultValues = manual 
    ? (() => {
        const [make, ...modelParts] = manual.motorcycle_name?.split(' ') || [];
        // Extract year from the end of the model name
        const yearString = modelParts[modelParts.length - 1];
        const year = !isNaN(Number(yearString)) ? Number(yearString) : new Date().getFullYear();
        // Join the remaining parts as the model name
        const model = modelParts.slice(0, -1).join(' ');
        
        return {
          title: manual.title,
          manual_type: manual.manual_type,
          make,
          model,
          year,
        };
      })()
    : {};
  
  // Close form when dialog is closed
  useEffect(() => {
    if (!open) {
      // Form will be reset by the ManualForm component when it unmounts
    }
  }, [open]);

  const handleFormSubmit = async (values: ManualFormValues) => {
    await handleSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{manual ? 'Edit Manual' : 'Upload Manual'}</DialogTitle>
        </DialogHeader>
        <ManualForm
          defaultValues={defaultValues}
          onSubmit={handleFormSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminManualDialog;
