
import { useState } from 'react';
import { useManualBucket } from '@/hooks/useManualBucket';
import { useToast } from '@/hooks/use-toast';
import { importManual } from '@/services/manuals';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { ImportManualFormValues } from '@/components/admin/manuals/ImportManualFormSchema';

export interface UseManualImportProps {
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
}

export interface UseManualImportResult {
  handleImport: (values: ImportManualFormValues) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export const useManualImport = ({ 
  onOpenChange, 
  onSaveSuccess 
}: UseManualImportProps): UseManualImportResult => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { parseFileDetails } = useManualBucket();
  const { toast } = useToast();

  const handleImport = async (values: ImportManualFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log("Starting manual import process with values:", values);

      // Import the manual directly with the provided values
      const importedManual = await importManual({
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: "", // This will be generated from make/model/year on the server
        year: values.year,
        file_url: values.file_url,
        file_name: values.file_name,
        file_size_mb: values.file_size_mb,
        tags: values.tags || [],
        // These are passed separately for motorcycle creation if needed
        make: values.make,
        model: values.model
      });
      
      console.log("Manual imported successfully:", importedManual);
      
      // Success!
      toast({
        title: 'Manual Imported',
        description: 'The manual was successfully imported',
      });
      
      onSaveSuccess(importedManual);
      onOpenChange(false);
    } catch (error) {
      console.error("Error in handleImport:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import manual';
      setError(errorMessage);
      toast({
        title: 'Import Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    handleImport, 
    isSubmitting,
    error
  };
};
