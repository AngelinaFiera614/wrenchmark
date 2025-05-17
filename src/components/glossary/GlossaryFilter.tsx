
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface GlossaryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

export function GlossaryFilter({
  categories,
  selectedCategories,
  onCategoryToggle,
  search,
  onSearchChange,
  onClearFilters
}: GlossaryFilterProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search terms..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Categories</h3>
          {(selectedCategories.length > 0 || search) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="h-8 px-2 text-xs"
            >
              Clear filters <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[180px]">
          <div className="flex flex-wrap gap-2 pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent-teal/20"
                onClick={() => onCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
