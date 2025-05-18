
import { useState } from 'react';
import { BucketFile } from '../../ManualBucketBrowser';
import { toast } from 'sonner';

export const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState<BucketFile[]>([]);
  
  const handleSelectFiles = (files: BucketFile[]) => {
    setSelectedFiles(files);
  };
  
  const handleSelectSingleFile = (file: BucketFile) => {
    // This function is required by the component props but we don't need it
    // when using multiSelect mode, as we're using onSelectMultiple instead
  };
  
  const validateFileSelection = (): boolean => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to import');
      return false;
    }
    return true;
  };
  
  const resetSelection = () => {
    setSelectedFiles([]);
  };
  
  return {
    selectedFiles,
    handleSelectFiles,
    handleSelectSingleFile,
    validateFileSelection,
    resetSelection
  };
};
