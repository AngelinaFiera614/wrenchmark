
import React from 'react';
import ManualBucketBrowser, { BucketFile } from '../ManualBucketBrowser';

export interface FileSelectionViewProps {
  onSelectFile: (file: BucketFile) => void;
}

const FileSelectionView: React.FC<FileSelectionViewProps> = ({
  onSelectFile
}) => {
  return <ManualBucketBrowser onSelect={onSelectFile} />;
};

export default FileSelectionView;
