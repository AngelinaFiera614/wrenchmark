
import React from 'react';
import { Button } from '@/components/ui/button';
import { BucketFile } from '../ManualBucketBrowser';

export interface SelectedFileHeaderProps {
  selectedFile: BucketFile;
  onChangeFile: () => void;
}

const SelectedFileHeader: React.FC<SelectedFileHeaderProps> = ({
  selectedFile,
  onChangeFile
}) => {
  return (
    <div className="flex items-center justify-between bg-muted/50 p-2 rounded mb-4">
      <div className="text-sm">
        <span className="font-medium">Selected file:</span> {selectedFile.name}
      </div>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={onChangeFile}
      >
        Change
      </Button>
    </div>
  );
};

export default SelectedFileHeader;
