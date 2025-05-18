
import { useManualFormSubmit, UseManualFormSubmitProps } from './manuals/useManualFormSubmit';
import { useManualImport, UseManualImportProps } from './manuals/useManualImport';
import { ManualFormValues } from '@/components/admin/manuals/ManualFormSchema';
import { ImportManualFormValues } from '@/components/admin/manuals/ImportManualFormSchema';
import { ManualWithMotorcycle } from '@/services/manuals/types';

export interface UseManualSubmitProps {
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
  manualId?: string;
}

export interface ManualSubmitHookResult {
  handleSubmit: (values: ManualFormValues) => Promise<void>;
  handleImport: (values: ImportManualFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const useManualSubmit = ({ 
  onOpenChange, 
  onSaveSuccess, 
  manualId 
}: UseManualSubmitProps): ManualSubmitHookResult => {
  // Use our specialized hooks
  const { 
    handleSubmit: handleFormSubmit, 
    isSubmitting: isFormSubmitting 
  } = useManualFormSubmit({ 
    onOpenChange, 
    onSaveSuccess, 
    manualId 
  });

  const { 
    handleImport: handleManualImport, 
    isSubmitting: isImportSubmitting 
  } = useManualImport({ 
    onOpenChange, 
    onSaveSuccess 
  });

  // Combined isSubmitting state
  const isSubmitting = isFormSubmitting || isImportSubmitting;

  // Handle form submission
  const handleSubmit = async (values: ManualFormValues) => {
    await handleFormSubmit(values);
  };

  // Handle import submission
  const handleImport = async (values: ImportManualFormValues) => {
    await handleManualImport(values);
  };

  return { 
    handleSubmit, 
    handleImport, 
    isSubmitting 
  };
};
