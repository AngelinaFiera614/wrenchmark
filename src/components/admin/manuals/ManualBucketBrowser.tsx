
import React, { useState, useEffect } from 'react';
import { useManualBucket } from '@/hooks/useManualBucket';
import FileSearchBar from './bucket-browser/FileSearchBar';
import FileSelectionHeader from './bucket-browser/FileSelectionHeader';
import FilesGrid from './bucket-browser/FilesGrid';
import LoadingState from './bucket-browser/LoadingState';
import ErrorState from './bucket-browser/ErrorState';
import EmptyState from './bucket-browser/EmptyState';

export interface BucketFile {
  name: string;
  id: string;
  url: string;
  size: number;
  createdAt: string;
  selected?: boolean;
}

export interface ManualBucketBrowserProps {
  onSelect: (file: BucketFile) => void;
  onSelectMultiple?: (files: BucketFile[]) => void;
  multiSelect?: boolean;
}

const ManualBucketBrowser: React.FC<ManualBucketBrowserProps> = ({
  onSelect,
  onSelectMultiple,
  multiSelect = false,
}) => {
  const { files, isLoading, error, fetchManualFiles } = useManualBucket();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<BucketFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<BucketFile[]>([]);

  useEffect(() => {
    fetchManualFiles();
  }, []);

  useEffect(() => {
    // Apply search filter
    const filtered = files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Add selected state to files
    setFilteredFiles(filtered.map(file => ({
      ...file,
      selected: selectedFiles.some(selected => selected.id === file.id)
    })));
  }, [files, searchTerm, selectedFiles]);

  const handleSelectFile = (file: BucketFile) => {
    if (multiSelect) {
      // Toggle selection
      const isSelected = selectedFiles.some(selected => selected.id === file.id);
      
      if (isSelected) {
        // Remove from selection
        const updated = selectedFiles.filter(selected => selected.id !== file.id);
        setSelectedFiles(updated);
        if (onSelectMultiple) onSelectMultiple(updated);
      } else {
        // Add to selection
        const updated = [...selectedFiles, file];
        setSelectedFiles(updated);
        if (onSelectMultiple) onSelectMultiple(updated);
      }
    } else {
      // Single select - just call the onSelect callback
      onSelect(file);
    }
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles);
      if (onSelectMultiple) onSelectMultiple(filteredFiles);
    } else {
      setSelectedFiles([]);
      if (onSelectMultiple) onSelectMultiple([]);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchManualFiles} />;
  }

  if (filteredFiles.length === 0) {
    return <EmptyState searchTerm={searchTerm} onRefresh={fetchManualFiles} />;
  }

  return (
    <div className="space-y-4">
      <FileSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={fetchManualFiles}
      />

      <FileSelectionHeader
        multiSelect={multiSelect}
        filteredFiles={filteredFiles}
        selectedFiles={selectedFiles}
        onToggleAll={handleToggleAll}
      />

      <FilesGrid 
        files={filteredFiles}
        multiSelect={multiSelect}
        onFileSelect={handleSelectFile}
      />
    </div>
  );
};

export default ManualBucketBrowser;
