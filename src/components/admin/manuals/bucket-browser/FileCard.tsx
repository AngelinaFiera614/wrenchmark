
import React from 'react';
import { File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatFileSize } from '@/utils/formatters';
import { BucketFile } from '../ManualBucketBrowser';

interface FileCardProps {
  file: BucketFile;
  multiSelect?: boolean;
  onClick: () => void;
  onCheckChange?: (checked: boolean) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  multiSelect = false,
  onClick,
  onCheckChange
}) => {
  return (
    <Card
      className={`p-3 flex items-center cursor-pointer hover:bg-accent/5 ${
        file.selected ? 'border-accent-teal bg-accent/10' : ''
      }`}
      onClick={onClick}
    >
      {multiSelect && (
        <Checkbox
          checked={file.selected}
          className="mr-2"
          onCheckedChange={(checked) => {
            if (onCheckChange) {
              onCheckChange(!!checked);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <File className="h-4 w-4 mr-2 flex-shrink-0" />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium truncate">{file.name}</span>
        <div className="flex text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span className="mx-1">•</span>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default FileCard;
