
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManualFormValues } from '@/components/admin/manuals/ManualFormSchema';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { supabase } from '@/integrations/supabase/client';

export interface UseManualFormSubmitProps {
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
  manualId?: string;
}

export const useManualFormSubmit = ({ 
  onOpenChange, 
  onSaveSuccess, 
  manualId 
}: UseManualFormSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: ManualFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (manualId) {
        // Update existing manual
        const { data, error } = await supabase
          .from('manuals')
          .update({
            title: values.title,
            manual_type: values.manual_type,
            make: values.make,
            model: values.model,
            year: values.year,
            motorcycle_id: values.motorcycle_id,
            model_id: values.model_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', manualId)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Manual updated successfully"
        });

        onSaveSuccess(data as ManualWithMotorcycle);
      } else {
        // Create new manual
        const { data, error } = await supabase
          .from('manuals')
          .insert({
            title: values.title,
            manual_type: values.manual_type,
            make: values.make,
            model: values.model,
            year: values.year,
            motorcycle_id: values.motorcycle_id,
            model_id: values.model_id,
            file_url: values.file_url,
            file_size_mb: values.file_size_mb
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Manual created successfully"
        });

        onSaveSuccess(data as ManualWithMotorcycle);
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving manual:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save manual"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
