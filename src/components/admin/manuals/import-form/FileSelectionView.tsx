
import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import { BucketFile } from '../ManualBucketBrowser';
import ManualBucketBrowser from '../ManualBucketBrowser';
import { Card, CardContent } from '@/components/ui/card';

export interface FileSelectionViewProps {
  onSelectFile: (file: BucketFile) => void;
  file?: BucketFile;
  isLoading?: boolean;
}

const FileSelectionView: React.FC<FileSelectionViewProps> = ({
  onSelectFile,
  file,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-accent-teal" />
            <p className="text-sm text-muted-foreground">Processing file...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (file) {
    return (
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded mb-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-accent-teal" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ManualBucketBrowser onSelect={onSelectFile} />;
};

export default FileSelectionView;
