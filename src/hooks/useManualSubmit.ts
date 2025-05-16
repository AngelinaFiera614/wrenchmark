
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { uploadManual, updateManual } from '@/services/manuals';
import { ManualWithMotorcycle } from '@/services/manuals';
import { ManualFormValues } from '@/components/admin/manuals/ManualFormSchema';

interface UseManualSubmitProps {
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
  manualId?: string;
}

export const useManualSubmit = ({ onOpenChange, onSaveSuccess, manualId }: UseManualSubmitProps) => {
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
        const updateData = {
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
          await uploadManual(values.file, {
            id: manualId, // Use existing ID for update
            ...updateData
          });
        }
        
        toast.success('Manual updated successfully');
      } else {
        // Create new manual
        if (!(values.file instanceof File)) {
          throw new Error('File is required for new manuals');
        }
        
        // Upload the new manual
        savedManual = await uploadManual(values.file, {
          title: values.title,
          manual_type: values.manual_type,
          motorcycle_id: motorcycle.id,
          year: values.year,
          file_size_mb: fileSizeMB,
        });
        
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

  return { handleSubmit, isSubmitting };
};
