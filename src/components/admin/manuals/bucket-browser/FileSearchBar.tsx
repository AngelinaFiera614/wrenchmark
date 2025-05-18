
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FileSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
}

const FileSearchBar: React.FC<FileSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh
}) => {
  return (
    <div className="flex items-center gap-2">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Button 
        onClick={onRefresh}
        variant="outline"
        size="sm"
      >
        Refresh
      </Button>
    </div>
  );
};

export default FileSearchBar;
