
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { uploadManual, updateManual } from '@/services/manuals';
import { associateTagsWithManual, getOrCreateTagsByNames } from '@/services/manuals/tags';
import { ManualFormValues } from '@/components/admin/manuals/ManualFormSchema';
import { ManualWithMotorcycle, ManualUpdateParams } from '@/services/manuals/types';

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
  const navigate = useNavigate();

  /**
   * Find or create a motorcycle based on form values
   */
  const findOrCreateMotorcycle = async (make: string, model: string, year: number) => {
    console.log(`Looking up motorcycle: ${make} ${model} ${year}`);
    let motorcycle = await findMotorcycleByDetails(make, model, year);

    if (!motorcycle) {
      // Create a placeholder motorcycle
      console.log(`Creating placeholder motorcycle for: ${make} ${model} ${year}`);
      motorcycle = await createPlaceholderMotorcycle({
        make,
        model,
        year,
      });
      
      console.log("Created placeholder motorcycle:", motorcycle);
      toast.success(`Created placeholder motorcycle for ${make} ${model} ${year}`);
    } else {
      console.log("Found existing motorcycle:", motorcycle);
    }

    return motorcycle;
  };

  /**
   * Calculate file size in MB
   */
  const calculateFileSizeMB = (file: File | undefined): number | undefined => {
    if (file instanceof File && file.size > 0) {
      const fileSizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      console.log(`File size: ${fileSizeMB} MB`);
      return fileSizeMB;
    }
    return undefined;
  };

  /**
   * Handle tags for a manual
   */
  const processManualTags = async (manualId: string, tags: string[]) => {
    if (tags.length > 0) {
      try {
        // Get or create the tags by name
        const tagObjects = await getOrCreateTagsByNames(tags);
        console.log("Retrieved/created tags:", tagObjects);
        
        // Associate tags with the manual
        await associateTagsWithManual(manualId, tagObjects.map(tag => tag.id));
        console.log("Updated tags for manual");
        
        return tagObjects;
      } catch (tagError) {
        console.error("Error updating tags:", tagError);
        toast.error("Failed to update tags");
        // Don't fail the whole update just because tags failed
        return [];
      }
    } else {
      // Remove all tags if the array is empty
      try {
        await associateTagsWithManual(manualId, []);
        console.log("Removed all tags from manual");
        return [];
      } catch (tagError) {
        console.error("Error removing tags:", tagError);
        return [];
      }
    }
  };

  /**
   * Update an existing manual
   */
  const updateExistingManual = async (
    manualId: string, 
    values: ManualFormValues, 
    motorcycleId: string,
    fileSizeMB?: number
  ): Promise<ManualWithMotorcycle> => {
    console.log(`Updating existing manual with ID: ${manualId}`);
    const updateData: ManualUpdateParams = {
      id: manualId,
      title: values.title,
      manual_type: values.manual_type,
      motorcycle_id: motorcycleId,
      year: values.year,
    };
    
    // Only include file size if a new file was uploaded
    if (fileSizeMB !== undefined) {
      updateData.file_size_mb = fileSizeMB;
    }
    
    const savedManual = await updateManual(manualId, updateData);
    console.log("Updated manual:", savedManual);
    
    // Process tags and get updated tag details
    const tagObjects = await processManualTags(manualId, values.tags || []);
    
    // Add tag details to the saved manual
    savedManual.tag_details = tagObjects;
    
    // If a new file was uploaded, update the file
    if (values.file instanceof File && values.file.size > 0) {
      console.log("Uploading new file for existing manual");
      // We need to upload the new file
      const manualData = {
        id: manualId, // Use existing ID for update
        motorcycle_id: motorcycleId,
        title: values.title, // Ensure title is provided
        manual_type: values.manual_type,
        year: values.year,
        file_size_mb: fileSizeMB,
        tags: values.tags || []
      };
      
      const uploadResult = await uploadManual(values.file, manualData);
      
      // If the upload returns data, use it to update savedManual
      if (uploadResult) {
        console.log("Updated file URL:", uploadResult.file_url);
        savedManual.file_url = uploadResult.file_url;
        if (uploadResult.tag_details) {
          savedManual.tag_details = uploadResult.tag_details;
        }
      }
    }
    
    toast.success('Manual updated successfully');
    return savedManual;
  };

  /**
   * Create a new manual
   */
  const createNewManual = async (
    values: ManualFormValues, 
    motorcycleId: string,
    fileSizeMB?: number
  ): Promise<ManualWithMotorcycle> => {
    if (!(values.file instanceof File)) {
      throw new Error('File is required for new manuals');
    }
    
    console.log("Creating new manual");
    // Prepare manual data - ensure title is provided for new manuals
    const manualData = {
      title: values.title,
      manual_type: values.manual_type,
      motorcycle_id: motorcycleId,
      year: values.year,
      file_size_mb: fileSizeMB,
      tags: values.tags || []
    };
    
    // Upload the new manual
    const uploadResult = await uploadManual(values.file, manualData);
    
    if (!uploadResult) {
      throw new Error('Failed to upload manual file');
    }
    
    console.log("Created new manual:", uploadResult);
    toast.success('Manual uploaded successfully');
    
    return uploadResult;
  };

  /**
   * Main submit handler
   */
  const handleSubmit = async (values: ManualFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Handling manual submission:", values);

      // Find or create the motorcycle
      const motorcycle = await findOrCreateMotorcycle(values.make, values.model, values.year);

      // Calculate file size if needed
      const fileSizeMB = calculateFileSizeMB(values.file);

      let savedManual: ManualWithMotorcycle;
      
      if (manualId) {
        // Update existing manual
        savedManual = await updateExistingManual(manualId, values, motorcycle.id, fileSizeMB);
      } else {
        // Create new manual
        savedManual = await createNewManual(values, motorcycle.id, fileSizeMB);
      }

      // Close the dialog and notify about success
      onOpenChange(false);
      onSaveSuccess({
        ...savedManual,
        motorcycle_name: `${values.make} ${values.model} ${values.year}`
      });

      // Navigate to the motorcycle detail page
      setTimeout(() => {
        navigate(`/motorcycles/${motorcycle!.id}`);
      }, 500);
      
      return savedManual;
    } catch (error) {
      console.error('Error saving manual:', error);
      toast.error(`Failed to save manual: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
