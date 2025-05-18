
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
}

export const useManualImport = ({ 
  onOpenChange, 
  onSaveSuccess 
}: UseManualImportProps): UseManualImportResult => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { files, fetchManualFiles, organizeFiles, parseFileDetails, deleteFile, getMotorcycleId } = useManualBucket();
  const { toast } = useToast();

  const handleImport = async (values: ImportManualFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Starting manual import process with values:", values);

      // Get motorcycle ID from make, model, year
      const motorcycleId = await getMotorcycleId(
        values.make, 
        values.model,
        values.year
      );
      
      if (!motorcycleId) {
        console.error("Failed to find or create motorcycle record");
        toast({
          title: 'Import Failed',
          description: 'Could not associate manual with a motorcycle',
          variant: 'destructive',
        });
        return;
      }
      
      console.log("Importing manual for motorcycle ID:", motorcycleId);
      
      // Prepare manual data
      const importData = {
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: motorcycleId,
        file_url: values.file_url,
        file_name: values.file_name,
        file_size_mb: values.file_size_mb,
        year: values.year,
        tags: values.tags
      };
      
      // Import the manual
      const importedManual = await importManual(importData);
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
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import manual',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    handleImport, 
    isSubmitting 
  };
};
