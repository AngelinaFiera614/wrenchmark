
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, ChevronDown, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ModelFilters, ModelSort } from '@/hooks/useModelFilters';

interface EnhancedModelFiltersProps {
  filters: ModelFilters;
  sort: ModelSort;
  onFilterChange: (key: keyof ModelFilters, value: any) => void;
  onSortChange: (sort: ModelSort) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  categories: string[];
  brands: Array<{ id: string; name: string }>;
  isAdvancedOpen: boolean;
  onAdvancedToggle: () => void;
}

const EnhancedModelFilters: React.FC<EnhancedModelFiltersProps> = ({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onClearFilters,
  activeFiltersCount,
  categories,
  brands,
  isAdvancedOpen,
  onAdvancedToggle
}) => {
  const quickFilters = [
    { label: 'Sport', value: 'Sport' },
    { label: 'Cruiser', value: 'Cruiser' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Naked', value: 'Naked' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'brand', label: 'Brand' },
    { value: 'production_start_year', label: 'Year' },
    { value: 'type', label: 'Type' },
    { value: 'created_at', label: 'Date Added' }
  ];

  // Filter out invalid brands to prevent empty string values
  const validBrands = brands?.filter(brand => 
    brand && 
    typeof brand.id === 'string' && 
    brand.id.trim().length > 0 &&
    typeof brand.name === 'string' && 
    brand.name.trim().length > 0
  ) || [];

  // Filter out invalid categories
  const validCategories = categories?.filter(category => 
    category && 
    typeof category === 'string' && 
    category.trim().length > 0
  ) || [];

  const removeFilter = (filterKey: keyof ModelFilters) => {
    switch (filterKey) {
      case 'search':
        onFilterChange('search', '');
        break;
      case 'category':
        onFilterChange('category', 'all');
        break;
      case 'brand':
        onFilterChange('brand', 'all');
        break;
      case 'status':
        onFilterChange('status', 'all');
        break;
      case 'yearRange':
        onFilterChange('yearRange', [1900, 2030]);
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search and Quick Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
              <Input
                placeholder="Search models or brands..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <Select
                value={sort.field}
                onValueChange={(value) => onSortChange({ ...sort, field: value as any })}
              >
                <SelectTrigger className="w-32 bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
                className="bg-explorer-dark border-explorer-chrome/30"
              >
                {sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Advanced Filters Toggle */}
            <Collapsible open={isAdvancedOpen} onOpenChange={onAdvancedToggle}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="bg-explorer-dark border-explorer-chrome/30">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-accent-teal text-black">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {quickFilters.map(filter => (
              <Button
                key={filter.value}
                variant={filters.category === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange('category', filters.category === filter.value ? 'all' : filter.value)}
                className={filters.category === filter.value ? "bg-accent-teal text-black" : "bg-explorer-dark border-explorer-chrome/30"}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={onAdvancedToggle}>
        <CollapsibleContent>
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-explorer-text mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {validCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium text-explorer-text mb-2 block">Brand</label>
                  <Select value={filters.brand} onValueChange={(value) => onFilterChange('brand', value)}>
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {validBrands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-explorer-text mb-2 block">Status</label>
                  <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                      <SelectItem value="active">Active Production</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="text-sm font-medium text-explorer-text mb-2 block">
                    Production Year: {filters.yearRange[0]} - {filters.yearRange[1]}
                  </label>
                  <Slider
                    value={filters.yearRange}
                    onValueChange={(value) => onFilterChange('yearRange', value as [number, number])}
                    min={1900}
                    max={2030}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-explorer-chrome/30">
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  disabled={activeFiltersCount === 0}
                  className="bg-explorer-dark border-explorer-chrome/30"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filter Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Search: "{filters.search}"
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter('search')} />
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Category: {filters.category}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter('category')} />
            </Badge>
          )}
          {filters.brand !== 'all' && (
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Brand: {validBrands.find(b => b.id === filters.brand)?.name}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter('brand')} />
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Status: {filters.status}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter('status')} />
            </Badge>
          )}
          {(filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2030) && (
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Years: {filters.yearRange[0]}-{filters.yearRange[1]}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter('yearRange')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedModelFilters;
