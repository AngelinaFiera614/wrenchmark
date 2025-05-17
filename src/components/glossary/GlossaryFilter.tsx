
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';

interface GlossaryFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
}

const GlossaryFilter: React.FC<GlossaryFilterProps> = ({
  search,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
}) => {
  const hasActiveFilters = search || selectedCategories.length > 0;

  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search glossary terms..."
          className="pl-10"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap pb-1 pt-1" orientation="horizontal">
        <div className="flex gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Badge
                key={category}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer hover:bg-accent-teal/20 ${
                  isSelected ? "bg-accent-teal text-black" : "bg-background border-accent-teal/30 text-accent-teal"
                }`}
                onClick={() => onCategoryToggle(category)}
              >
                {category}
              </Badge>
            );
          })}
        </div>
      </ScrollArea>
      
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default GlossaryFilter;
