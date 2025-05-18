
import React, { useState, useEffect } from 'react';
import { useManualBucket } from '@/hooks/useManualBucket';
import { Loader2, Search, File } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatFileSize } from '@/utils/formatters';

export interface BucketFile {
  name: string;
  id: string;
  url: string;
  size: number;
  createdAt: string;
  selected?: boolean;
}

interface ManualBucketBrowserProps {
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
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <Button 
          onClick={() => fetchManualFiles()} 
          variant="outline" 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (filteredFiles.length === 0) {
    return (
      <div className="text-center py-8">
        <File className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No files found</h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm ? 'No files match your search.' : 'No files in the manuals bucket.'}
        </p>
        <Button onClick={() => fetchManualFiles()} variant="outline">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={() => fetchManualFiles()}
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {multiSelect && (
        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="select-all"
            checked={selectedFiles.length > 0 && selectedFiles.length === filteredFiles.length}
            onCheckedChange={(checked) => handleToggleAll(!!checked)}
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
      )}

      <div className="grid gap-2 max-h-80 overflow-y-auto">
        {filteredFiles.map((file) => (
          <Card
            key={file.id}
            className={`p-3 flex items-center cursor-pointer hover:bg-accent/5 ${
              file.selected ? 'border-accent-teal bg-accent/10' : ''
            }`}
            onClick={() => handleSelectFile(file)}
          >
            {multiSelect && (
              <Checkbox
                checked={file.selected}
                className="mr-2"
                onCheckedChange={(checked) => {
                  if (checked !== file.selected) {
                    handleSelectFile(file);
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
        ))}
      </div>
    </div>
  );
};

export default ManualBucketBrowser;
