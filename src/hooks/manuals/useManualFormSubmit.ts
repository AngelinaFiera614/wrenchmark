
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

  const handleSubmit = async (values: ManualFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Handling manual submission:", values);

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

      // Calculate file size in MB (only for new manual uploads with a file)
      let fileSizeMB;
      if (values.file instanceof File && values.file.size > 0) {
        fileSizeMB = parseFloat((values.file.size / (1024 * 1024)).toFixed(2));
        console.log(`File size: ${fileSizeMB} MB`);
      }

      // Check for tags
      const tags = values.tags || [];
      console.log("Tags for manual:", tags);

      let savedManual: ManualWithMotorcycle;
      
      if (manualId) {
        // Update existing manual
        console.log(`Updating existing manual with ID: ${manualId}`);
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
        console.log("Updated manual:", savedManual);
        
        // Update tags
        if (tags.length > 0) {
          try {
            // Get or create the tags by name
            const tagObjects = await getOrCreateTagsByNames(tags);
            console.log("Retrieved/created tags:", tagObjects);
            
            // Associate tags with the manual
            await associateTagsWithManual(manualId, tagObjects.map(tag => tag.id));
            console.log("Updated tags for manual");
            
            // Add tag details to the saved manual
            savedManual.tag_details = tagObjects;
          } catch (tagError) {
            console.error("Error updating tags:", tagError);
            toast.error("Failed to update tags");
            // Don't fail the whole update just because tags failed
          }
        } else {
          // Remove all tags if the array is empty
          try {
            await associateTagsWithManual(manualId, []);
            console.log("Removed all tags from manual");
          } catch (tagError) {
            console.error("Error removing tags:", tagError);
          }
        }
        
        // If a new file was uploaded, update the file
        if (values.file instanceof File && values.file.size > 0) {
          console.log("Uploading new file for existing manual");
          // We need to upload the new file
          const manualData = {
            id: manualId, // Use existing ID for update
            motorcycle_id: motorcycle.id,
            title: values.title, // Ensure title is provided
            manual_type: values.manual_type,
            year: values.year,
            file_size_mb: fileSizeMB,
            tags: tags
          };
          
          const uploadResult = await uploadManual(values.file, manualData);
          
          // If the upload returns data, use it to update savedManual
          if (uploadResult) {
            console.log("Updated file URL:", uploadResult.file_url);
            savedManual = {
              ...savedManual,
              file_url: uploadResult.file_url,
              tag_details: uploadResult.tag_details
            };
          }
        }
        
        toast.success('Manual updated successfully');
      } else {
        // Create new manual
        if (!(values.file instanceof File)) {
          throw new Error('File is required for new manuals');
        }
        
        console.log("Creating new manual");
        // Prepare manual data - ensure title is provided for new manuals
        const manualData = {
          title: values.title,
          manual_type: values.manual_type,
          motorcycle_id: motorcycle.id,
          year: values.year,
          file_size_mb: fileSizeMB,
          tags: tags
        };
        
        // Upload the new manual
        const uploadResult = await uploadManual(values.file, manualData);
        
        if (!uploadResult) {
          throw new Error('Failed to upload manual file');
        }
        
        savedManual = uploadResult;
        console.log("Created new manual:", savedManual);
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
