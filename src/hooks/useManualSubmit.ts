
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { uploadManual } from '@/services/manuals';
import { ManualWithMotorcycle } from '@/services/manuals';
import { ManualFormValues } from '@/components/admin/manuals/ManualFormSchema';

interface UseManualSubmitProps {
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
}

export const useManualSubmit = ({ onOpenChange, onSaveSuccess }: UseManualSubmitProps) => {
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

      // Calculate file size in MB
      const fileSizeMB = parseFloat((values.file.size / (1024 * 1024)).toFixed(2));

      // Upload the manual
      await uploadManual(values.file, {
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: motorcycle.id,
        year: values.year,
        file_size_mb: fileSizeMB,
      });

      toast.success('Manual uploaded successfully');
      onOpenChange(false);
      onSaveSuccess({
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: motorcycle.id,
        year: values.year,
        file_size_mb: fileSizeMB,
        motorcycle_name: `${values.make} ${values.model} ${values.year}`
      });

      // Navigate to the motorcycle detail page
      setTimeout(() => {
        navigate(`/motorcycles/${motorcycle!.id}`);
      }, 500);
    } catch (error) {
      console.error('Error uploading manual:', error);
      toast.error('Failed to upload manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
