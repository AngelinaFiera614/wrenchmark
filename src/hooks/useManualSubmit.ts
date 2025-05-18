
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { uploadManual, updateManual, importManual } from '@/services/manuals';
import { ManualWithMotorcycle, ManualInfo, ManualUpdateParams } from '@/services/manuals/types';
import { ManualFormValues } from '@/components/admin/manuals/ManualFormSchema';
import { ImportManualFormValues } from '@/components/admin/manuals/ImportManualForm';

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

export const useManualSubmit = ({ onOpenChange, onSaveSuccess, manualId }: UseManualSubmitProps): ManualSubmitHookResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: ManualFormValues) => {
    try {
      setIsSubmitting(true);

      // Check if motorcycle exists or create a placeholder
      let motorcycle = await findMotorcycleByDetails(values.make, values.model, values.year);

      if (!motorcycle) {
        // Create a placeholder motorcycle
        motorcycle = await createPlaceholderMotorcycle({
          make: values.make,
          model: values.model,
          year: values.year,
        });
        
        toast.success(`Created placeholder motorcycle for ${values.make} ${values.model} ${values.year}`);
      }

      // Calculate file size in MB (only for new manual uploads with a file)
      let fileSizeMB;
      if (values.file instanceof File && values.file.size > 0) {
        fileSizeMB = parseFloat((values.file.size / (1024 * 1024)).toFixed(2));
      }

      let savedManual: ManualWithMotorcycle;
      
      if (manualId) {
        // Update existing manual
        const updateData: ManualUpdateParams = {
          id: manualId,
          title: values.title,
          manual_type: values.manual_type,
          motorcycle_id: motorcycle.id,
          year: values.year,
        };
        
        // Only include file size if a new file was uploaded
        if (fileSizeMB !== undefined) {
          updateData.file_size_mb = fileSizeMB;
        }
        
        savedManual = await updateManual(manualId, updateData);
        
        // If a new file was uploaded, update the file
        if (values.file instanceof File && values.file.size > 0) {
          // We need to upload the new file
          const uploadResult = await uploadManual(values.file, {
            id: manualId, // Use existing ID for update
            ...updateData
          });
          
          // If the upload returns data, use it to update savedManual
          if (uploadResult) {
            savedManual = {
              ...savedManual,
              file_url: uploadResult.file_url
            };
          }
        }
        
        toast.success('Manual updated successfully');
      } else {
        // Create new manual
        if (!(values.file instanceof File)) {
          throw new Error('File is required for new manuals');
        }
        
        // Prepare manual data
        const manualData: ManualInfo = {
          title: values.title,
          manual_type: values.manual_type,
          motorcycle_id: motorcycle.id,
          year: values.year,
          file_size_mb: fileSizeMB,
        };
        
        // Upload the new manual
        const uploadResult = await uploadManual(values.file, manualData);
        
        if (!uploadResult) {
          throw new Error('Failed to upload manual file');
        }
        
        savedManual = uploadResult;
        toast.success('Manual uploaded successfully');
      }

      onOpenChange(false);
      onSaveSuccess({
        ...savedManual,
        motorcycle_name: `${values.make} ${values.model} ${values.year}`
      });

      // Navigate to the motorcycle detail page
      setTimeout(() => {
        navigate(`/motorcycles/${motorcycle!.id}`);
      }, 500);
    } catch (error) {
      console.error('Error saving manual:', error);
      toast.error('Failed to save manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = async (values: ImportManualFormValues) => {
    try {
      setIsSubmitting(true);

      // Check if motorcycle exists or create a placeholder
      let motorcycle = await findMotorcycleByDetails(values.make, values.model, values.year);

      if (!motorcycle) {
        // Create a placeholder motorcycle
        motorcycle = await createPlaceholderMotorcycle({
          make: values.make,
          model: values.model,
          year: values.year,
        });
        
        toast.success(`Created placeholder motorcycle for ${values.make} ${values.model} ${values.year}`);
      }

      // Prepare manual data
      const manualData = {
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: motorcycle.id,
        year: values.year,
        file_size_mb: values.file_size_mb || undefined,
        file_url: values.file_url,
        file_name: values.file_name
      };
      
      // Import the manual
      const importResult = await importManual(manualData);
      
      if (!importResult) {
        throw new Error('Failed to import manual file');
      }

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
    } catch (error) {
      console.error('Error importing manual:', error);
      toast.error('Failed to import manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, handleImport, isSubmitting };
};
