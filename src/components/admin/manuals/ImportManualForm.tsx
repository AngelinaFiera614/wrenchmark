
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { importSchema, ImportManualFormValues } from './ImportManualFormSchema';
import TitleField from './import-form/TitleField';
import ManualTypeField from './import-form/ManualTypeField';
import MotorcycleFields from './import-form/MotorcycleFields';
import FormActions from './import-form/FormActions';
import TagsField from './import-form/TagsField';
import FileSelectionView from './import-form/FileSelectionView';
import { BucketFile } from './ManualBucketBrowser';
import useTagManagement from '@/hooks/useTagManagement';
import { useManualFormState } from './import-form/useManualFormState';

interface ImportManualFormProps {
  onSubmit: (values: ImportManualFormValues) => Promise<void>;
  onCancel: () => void;
  defaultSelectedFile?: BucketFile;
  isSubmitting?: boolean;
  error?: string | null;
}

export const ImportManualForm: React.FC<ImportManualFormProps> = ({
  onSubmit,
  onCancel,
  defaultSelectedFile,
  isSubmitting = false,
  error
}) => {
  const [selectedFile, setSelectedFile] = useState<BucketFile | undefined>(defaultSelectedFile);
  const { availableTags, selectedTags, setSelectedTags, isLoading: tagsLoading, error: tagsError } = useTagManagement();
  const { form, isProcessing, fileDetails, fileName, fileSize } = useManualFormState(selectedFile);
  
  const handleSubmit = async (values: ImportManualFormValues) => {
    // Add selected tags to form values
    values.tags = selectedTags;
    await onSubmit(values);
  };

  const handleFileSelect = (file: BucketFile) => {
    setSelectedFile(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FileSelectionView 
          file={selectedFile} 
          onSelectFile={handleFileSelect}
          isLoading={isProcessing}
        />
        
        <TitleField control={form.control} disabled={isSubmitting || isProcessing} />
        <ManualTypeField control={form.control} disabled={isSubmitting || isProcessing} />
        <MotorcycleFields control={form.control} disabled={isSubmitting || isProcessing} />
        
        {/* Tags field */}
        <TagsField 
          tags={selectedTags}
          availableTags={availableTags}
          onAddTag={(tagId) => setSelectedTags([...selectedTags, tagId])}
          onRemoveTag={(tagId) => setSelectedTags(selectedTags.filter(id => id !== tagId))}
          onTagsChange={setSelectedTags}
          isLoading={tagsLoading}
          disabled={isSubmitting || isProcessing}
          error={tagsError || ''}
        />
        
        <FormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting || isProcessing}
          submitLabel="Import Manual"
        />
      </form>
    </Form>
  );
};

// Re-export for backward compatibility
export { importSchema, type ImportManualFormValues } from './ImportManualFormSchema';
export default ImportManualForm;
