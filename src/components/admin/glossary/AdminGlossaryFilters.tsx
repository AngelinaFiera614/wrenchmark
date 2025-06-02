
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from './MultiSelect';
import { X, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export type SortOption = {
  value: string;
  label: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: 'term-asc', label: 'Term (A-Z)' },
  { value: 'term-desc', label: 'Term (Z-A)' },
  { value: 'updated-desc', label: 'Recently Updated' },
  { value: 'updated-asc', label: 'Oldest Updated' },
  { value: 'category-asc', label: 'Category (A-Z)' }
];

interface AdminGlossaryFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function AdminGlossaryFilters({
  categories,
  selectedCategories,
  onCategoriesChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters
}: AdminGlossaryFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(true); // Changed to true for default open

  return (
    <Card className="border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-4 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters & Sort</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                  Active
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {isOpen ? 'Hide' : 'Show'}
            </div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Categories</label>
                <MultiSelect
                  options={categories}
                  selected={selectedCategories}
                  onChange={onCategoriesChange}
                  placeholder="Select categories..."
                />
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sorting..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Filters:</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(category => (
                    <Badge 
                      key={category} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => {
                          onCategoriesChange(selectedCategories.filter(c => c !== category));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {sortBy !== 'term-asc' && (
                    <Badge variant="outline">
                      Sort: {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
