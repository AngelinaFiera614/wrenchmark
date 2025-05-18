
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { importSchema, ImportManualFormValues } from '../ImportManualFormSchema';
import { useManualBucket } from '@/hooks/useManualBucket';
import { BucketFile } from '../ManualBucketBrowser';
import { toast } from 'sonner';

export const useManualFormState = (
  onSubmit: (values: ImportManualFormValues) => Promise<void>
) => {
  const [selectedFile, setSelectedFile] = useState<BucketFile | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { parseFileDetails } = useManualBucket();
  
  const form = useForm<ImportManualFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      title: '',
      manual_type: 'owner',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      file_url: '',
      file_name: '',
      file_size_mb: 0,
      tags: []
    },
  });

  // Update form when a file is selected
  useEffect(() => {
    if (!selectedFile) return;
    
    try {
      console.log("Processing selected file:", selectedFile.name);
      
      // Calculate size in MB
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
      
      // Parse file name for motorcycle details
      const { make, model, year, suggestedTags } = parseFileDetails(selectedFile.name);
      console.log(`Parsed details: make=${make}, model=${model}, year=${year}, suggestedTags=${suggestedTags}`);
      
      // Set suggested tags for display
      setSuggestedTags(suggestedTags || []);
      
      // Generate a title from the file name
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const titleCase = baseName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      // Guess manual type based on filename
      const lowerName = selectedFile.name.toLowerCase();
      let manualType = 'owner';
      
      if (lowerName.includes('service') || lowerName.includes('repair') || 
          lowerName.includes('workshop') || lowerName.includes('maintenance')) {
        manualType = 'service';
      } else if (lowerName.includes('wiring') || lowerName.includes('diagram') || 
                lowerName.includes('electric') || lowerName.includes('schematic')) {
        manualType = 'wiring';
      }
      
      console.log(`Detected manual type: ${manualType}`);
      
      // Update form
      form.setValue('title', titleCase);
      form.setValue('manual_type', manualType as any);
      form.setValue('make', make || '');
      form.setValue('model', model || '');
      if (year) {
        form.setValue('year', year);
      }
      form.setValue('file_url', selectedFile.url);
      form.setValue('file_name', selectedFile.name);
      form.setValue('file_size_mb', parseFloat(fileSizeMB.toFixed(2)));
      form.setValue('tags', suggestedTags || []);
    } catch (error) {
      console.error("Error processing selected file:", error);
      toast.error("Failed to process the selected file");
    }
  }, [selectedFile, form, parseFileDetails]);

  const handleSubmit = async (values: ImportManualFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form with values:", values);
      await onSubmit(values);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting import form:", error);
      toast.error("Failed to import manual");
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: BucketFile) => {
    console.log("File selected:", file.name);
    setSelectedFile(file);
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };
  
  return {
    form,
    selectedFile,
    suggestedTags,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleFileSelect,
    setSelectedFile,
    addTag,
    removeTag
  };
};
