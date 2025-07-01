
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Upload, Plus, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EnhancedSearchBar from './EnhancedSearchBar';

interface ConsolidatedMotorcycleHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  totalCount: number;
  filteredCount: number;
  onRefresh: () => void;
  onExportAll: () => void;
  onImport: () => void;
  onAddMotorcycle: () => void;
  isLoading: boolean;
  searchSuggestions?: string[];
  draftCount?: number;
  publishedCount?: number;
}

const ConsolidatedMotorcycleHeader = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  totalCount,
  filteredCount,
  onRefresh,
  onExportAll,
  onImport,
  onAddMotorcycle,
  isLoading,
  searchSuggestions = [],
  draftCount = 0,
  publishedCount = 0
}: ConsolidatedMotorcycleHeaderProps) => {
  return (
    <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-4 space-y-4">
      {/* Title and Main Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text">Motorcycle Management</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-explorer-text-muted">
              Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} motorcycles
            </span>
            {filteredCount !== totalCount && (
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                Filtered
              </Badge>
            )}
            {/* Status breakdown */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                {publishedCount} Published
              </Badge>
              <Badge variant="outline" className="border-orange-400/30 text-orange-400">
                {draftCount} Drafts
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-explorer-dark border-explorer-chrome/30"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-explorer-dark border-explorer-chrome/30">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-explorer-card border-explorer-chrome/30">
              <DropdownMenuItem onClick={onExportAll} className="text-explorer-text hover:bg-explorer-chrome/20">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImport} className="text-explorer-text hover:bg-explorer-chrome/20">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            size="sm" 
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
            onClick={onAddMotorcycle}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="w-full max-w-2xl">
        <EnhancedSearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search motorcycles by name, brand, type, or year..."
          suggestions={searchSuggestions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ConsolidatedMotorcycleHeader;
