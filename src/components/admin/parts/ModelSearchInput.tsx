
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

interface ModelSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const ModelSearchInput = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search models, brands, or types...",
  className = ""
}: ModelSearchInputProps) => {
  const debouncedSearch = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    // Handle keyboard shortcut to focus search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const searchInput = document.getElementById('model-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
        <Input
          id="model-search-input"
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 bg-explorer-card border-explorer-chrome/30 text-explorer-text placeholder:text-explorer-text-muted focus:border-accent-teal"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-explorer-chrome/20"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <div className="text-xs text-explorer-text-muted mt-1">
          Press "/" to focus search • Enter to search
        </div>
      )}
    </div>
  );
};

export default ModelSearchInput;
