
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { manualTypes } from './ManualFormSchema';
import { useManualBucket } from '@/hooks/useManualBucket';
import FileSelectionView from './import-form/FileSelectionView';
import SelectedFileHeader from './import-form/SelectedFileHeader';
import TitleField from './import-form/TitleField';
import ManualTypeField from './import-form/ManualTypeField';
import MotorcycleFields from './import-form/MotorcycleFields';
import FormActions from './import-form/FormActions';
import { BucketFile } from './ManualBucketBrowser';
import { toast } from 'sonner';

// Schema specifically for importing existing manual files
export const importSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  manual_type: z.enum(['owner', 'service', 'wiring']),
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model must be at least 1 character'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  file_url: z.string().url('Invalid file URL'),
  file_name: z.string(),
  file_size_mb: z.number().optional(),
});

export type ImportManualFormValues = z.infer<typeof importSchema>;

export interface ImportManualFormProps {
  onSubmit: (values: ImportManualFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ImportManualForm: React.FC<ImportManualFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [selectedFile, setSelectedFile] = useState<BucketFile | null>(null);
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
      file_size_mb: 0
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
      const { make, model, year } = parseFileDetails(selectedFile.name);
      console.log(`Parsed details: make=${make}, model=${model}, year=${year}`);
      
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
    } catch (error) {
      console.error("Error processing selected file:", error);
      toast.error("Failed to process the selected file");
    }
  }, [selectedFile, form, parseFileDetails]);

  const handleSubmit = async (values: ImportManualFormValues) => {
    try {
      console.log("Submitting form with values:", values);
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting import form:", error);
      toast.error("Failed to import manual");
    }
  };

  const handleFileSelect = (file: BucketFile) => {
    console.log("File selected:", file.name);
    setSelectedFile(file);
  };

  if (!selectedFile) {
    return <FileSelectionView onSelectFile={handleFileSelect} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <SelectedFileHeader 
          selectedFile={selectedFile}
          onChangeFile={() => setSelectedFile(null)}
        />
        
        <TitleField control={form.control} />
        <ManualTypeField control={form.control} />
        <MotorcycleFields control={form.control} />
        
        <input type="hidden" {...form.register('file_url')} />
        <input type="hidden" {...form.register('file_name')} />
        <input type="hidden" {...form.register('file_size_mb')} />

        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default ImportManualForm;
