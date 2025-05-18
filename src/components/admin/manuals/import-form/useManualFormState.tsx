
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { importSchema, ImportManualFormValues } from '../ImportManualFormSchema';
import { useManualBucket } from '@/hooks/useManualBucket';
import { BucketFile } from '../ManualBucketBrowser';
import { toast } from 'sonner';

export const useManualFormState = (selectedFile: BucketFile | undefined) => {
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log("Processing selected file:", selectedFile.name);
      
      // Calculate size in MB
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
      
      // Parse file name for motorcycle details
      const details = parseFileDetails(selectedFile.name);
      setFileDetails(details);
      setFileName(selectedFile.name);
      setFileSize(parseFloat(fileSizeMB.toFixed(2)));
      
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
      form.setValue('make', details?.make || '');
      form.setValue('model', details?.model || '');
      if (details?.year) {
        form.setValue('year', details.year);
      }
      form.setValue('file_url', selectedFile.url);
      form.setValue('file_name', selectedFile.name);
      form.setValue('file_size_mb', parseFloat(fileSizeMB.toFixed(2)));
      form.setValue('tags', details?.suggestedTags || []);

    } catch (error) {
      console.error("Error processing selected file:", error);
      setError("Failed to process the selected file");
      toast.error("Failed to process the selected file");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, form, parseFileDetails]);

  return {
    form,
    fileDetails,
    fileName,
    fileSize,
    isProcessing,
    error
  };
};

export default useManualFormState;
