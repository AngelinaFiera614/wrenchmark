
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { importManual } from '@/services/manuals';
import { associateTagsWithManual, getOrCreateTagsByNames } from '@/services/manuals/tags';
import { ImportManualFormValues } from '@/components/admin/manuals/ImportManualForm';
import { ManualWithMotorcycle } from '@/services/manuals/types';

export interface UseManualImportProps {
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
}

export const useManualImport = ({
  onOpenChange,
  onSaveSuccess
}: UseManualImportProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImport = async (values: ImportManualFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Handling manual import:", values);

      // Check if motorcycle exists or create a placeholder
      console.log(`Looking up motorcycle: ${values.make} ${values.model} ${values.year}`);
      let motorcycle = await findMotorcycleByDetails(values.make, values.model, values.year);

      if (!motorcycle) {
        // Create a placeholder motorcycle
        console.log(`Creating placeholder motorcycle for: ${values.make} ${values.model} ${values.year}`);
        motorcycle = await createPlaceholderMotorcycle({
          make: values.make,
          model: values.model,
          year: values.year,
        });
        
        console.log("Created placeholder motorcycle:", motorcycle);
        toast.success(`Created placeholder motorcycle for ${values.make} ${values.model} ${values.year}`);
      } else {
        console.log("Found existing motorcycle:", motorcycle);
      }

      // Check for tags
      const tags = values.tags || [];
      console.log("Tags for imported manual:", tags);

      // Prepare manual data
      const manualData = {
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: motorcycle.id,
        year: values.year,
        file_size_mb: values.file_size_mb || undefined,
        file_url: values.file_url,
        file_name: values.file_name,
        tags: tags
      };
      
      console.log("Importing manual with data:", manualData);
      
      // Import the manual
      const importResult = await importManual(manualData);
      
      if (!importResult) {
        throw new Error('Failed to import manual file');
      }

      console.log("Manual imported successfully:", importResult);
      toast.success('Manual imported successfully');
      
      onOpenChange(false);
      onSaveSuccess({
        ...importResult,
        motorcycle_name: `${values.make} ${values.model} ${values.year}`
      });

      // Navigate to the motorcycle detail page
      setTimeout(() => {
        navigate(`/motorcycles/${motorcycle!.id}`);
      }, 500);
      
      return importResult;
    } catch (error) {
      console.error('Error importing manual:', error);
      toast.error(`Failed to import manual: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleImport,
    isSubmitting
  };
};
