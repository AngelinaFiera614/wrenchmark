
import React from 'react';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  searchTerm: string;
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onRefresh }) => {
  return (
    <div className="text-center py-8">
      <File className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
      <h3 className="text-lg font-medium">No files found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? 'No files match your search.' : 'No files in the manuals bucket.'}
      </p>
      <Button onClick={onRefresh} variant="outline">
        Refresh
      </Button>
    </div>
  );
};

export default EmptyState;
