
import React from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { importSchema, ImportManualFormValues } from './ImportManualFormSchema';
import TitleField from './import-form/TitleField';
import ManualTypeField from './import-form/ManualTypeField';
import MotorcycleFields from './import-form/MotorcycleFields';
import FormActions from './import-form/FormActions';
import TagsField from './import-form/TagsField';
import FileSelectionView from './import-form/FileSelectionView';
import { BucketFile } from './ManualBucketBrowser';
import { useManualFormState } from './import-form/useManualFormState';
import useTagManagement from '@/hooks/useTagManagement';
import { getTags } from '@/services/manuals/tags';

interface ImportManualFormProps {
  onSubmit: (values: ImportManualFormValues) => Promise<void>;
  onCancel: () => void;
  defaultSelectedFile?: BucketFile;
  isSubmitting?: boolean;
}

export const ImportManualForm: React.FC<ImportManualFormProps> = ({
  onSubmit,
  onCancel,
  defaultSelectedFile,
  isSubmitting = false
}) => {
  const { availableTags, selectedTags, setSelectedTags } = useTagManagement();
  const { fileDetails, fileName, fileSize } = useManualFormState(defaultSelectedFile);
  
  const form = useForm<ImportManualFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      title: fileDetails?.title || '',
      manual_type: fileDetails?.manualType || 'owner',
      make: fileDetails?.make || '',
      model: fileDetails?.model || '',
      year: fileDetails?.year || new Date().getFullYear(),
      file_url: defaultSelectedFile?.url || '',
      file_name: fileName || '',
      file_size_mb: fileSize,
      tags: []
    }
  });

  const handleSubmit = async (values: ImportManualFormValues) => {
    // Add selected tags to form values
    values.tags = selectedTags;
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FileSelectionView file={defaultSelectedFile} />
        
        <TitleField control={form.control} />
        <ManualTypeField control={form.control} />
        <MotorcycleFields control={form.control} />
        
        {/* Tags field */}
        <TagsField 
          tags={selectedTags}
          availableTags={availableTags}
          onAddTag={(tagId) => setSelectedTags([...selectedTags, tagId])}
          onRemoveTag={(tagId) => setSelectedTags(selectedTags.filter(id => id !== tagId))}
          onTagsChange={setSelectedTags}
        />
        
        <FormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel="Import Manual"
        />
      </form>
    </Form>
  );
};

// Re-export for backward compatibility
export { importSchema, type ImportManualFormValues } from './ImportManualFormSchema';
export default ImportManualForm;
