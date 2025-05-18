
import React from 'react';
import FileCard from './FileCard';
import { BucketFile } from '../ManualBucketBrowser';

export interface FilesGridProps {
  files: BucketFile[];
  multiSelect?: boolean;
  onFileSelect: (file: BucketFile) => void;
}

const FilesGrid: React.FC<FilesGridProps> = ({
  files,
  multiSelect = false,
  onFileSelect
}) => {
  const handleCheckChange = (file: BucketFile, checked: boolean) => {
    // We'll trigger the same selection logic when the checkbox changes
    if (file.selected !== checked) {
      onFileSelect(file);
    }
  };

  return (
    <div className="grid gap-2 max-h-80 overflow-y-auto">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          multiSelect={multiSelect}
          onClick={() => onFileSelect(file)}
          onCheckChange={(checked) => handleCheckChange(file, checked)}
        />
      ))}
    </div>
  );
};

export default FilesGrid;
