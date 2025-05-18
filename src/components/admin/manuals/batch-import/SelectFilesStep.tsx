
import React from 'react';
import { Button } from "@/components/ui/button";
import ManualBucketBrowser, { BucketFile } from "../ManualBucketBrowser";

interface SelectFilesStepProps {
  selectedFiles: BucketFile[];
  onSelectFiles: (files: BucketFile[]) => void;
  onSelectSingleFile: (file: BucketFile) => void;
  onCancel: () => void;
  onContinue: () => void;
}

const SelectFilesStep: React.FC<SelectFilesStepProps> = ({
  selectedFiles,
  onSelectFiles,
  onSelectSingleFile,
  onCancel,
  onContinue
}) => {
  return (
    <>
      <ManualBucketBrowser 
        onSelectMultiple={onSelectFiles}
        onSelect={onSelectSingleFile}
        multiSelect={true} 
      />
      
      <div className="flex justify-end mt-6">
        <Button
          variant="outline"
          className="mr-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={onContinue}
          disabled={selectedFiles.length === 0}
        >
          Continue ({selectedFiles.length} selected)
        </Button>
      </div>
    </>
  );
};

export default SelectFilesStep;
