
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { BucketFile } from '../ManualBucketBrowser';

interface FileSelectionHeaderProps {
  multiSelect: boolean;
  filteredFiles: BucketFile[];
  selectedFiles: BucketFile[];
  onToggleAll: (checked: boolean) => void;
}

const FileSelectionHeader: React.FC<FileSelectionHeaderProps> = ({
  multiSelect,
  filteredFiles,
  selectedFiles,
  onToggleAll
}) => {
  if (!multiSelect) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox 
        id="select-all"
        checked={selectedFiles.length > 0 && selectedFiles.length === filteredFiles.length}
        onCheckedChange={(checked) => onToggleAll(!!checked)}
      />
      <label htmlFor="select-all" className="text-sm font-medium">
        Select all ({filteredFiles.length})
      </label>
      {selectedFiles.length > 0 && (
        <span className="text-muted-foreground text-sm">
          {selectedFiles.length} selected
        </span>
      )}
    </div>
  );
};

export default FileSelectionHeader;
