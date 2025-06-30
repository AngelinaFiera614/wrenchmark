
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Filter, RotateCcw, Bookmark } from 'lucide-react';
import { Motorcycle } from '@/types';
import EnhancedSearchBar from './EnhancedSearchBar';
import MultiSelectFilter from './MultiSelectFilter';

interface EnhancedFilters {
  search: string;
  brands: string[];
  categories: string[];
  statuses: string[];
  yearRange: [number, number];
  engineSizeRange: [number, number];
  hasAbs: 'all' | 'yes' | 'no';
}

interface EnhancedMotorcycleFiltersProps {
  filters: EnhancedFilters;
  motorcycles: Motorcycle[];
  onFilterChange: (filters: EnhancedFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const EnhancedMotorcycleFilters = ({
  filters,
  motorcycles,
  onFilterChange,
  onClearFilters,
  isLoading = false
}: EnhancedMotorcycleFiltersProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Generate filter options from motorcycle data
  const filterOptions = useMemo(() => {
    const brands = Array.from(new Set(
      motorcycles.map(m => m.brand?.name || m.brands?.name).filter(Boolean)
    )).sort().map(brand => ({ value: brand, label: brand }));

    const categories = Array.from(new Set(
      motorcycles.map(m => m.type).filter(Boolean)
    )).sort().map(cat => ({ value: cat, label: cat }));

    const statuses = [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' }
    ];

    return { brands, categories, statuses };
  }, [motorcycles]);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    motorcycles.forEach(m => {
      if (m.name) suggestions.add(m.name);
      if (m.brand?.name) suggestions.add(m.brand.name);
      if (m.brands?.name) suggestions.add(m.brands.name);
      if (m.type) suggestions.add(m.type);
    });
    return Array.from(suggestions).sort();
  }, [motorcycles]);

  const activeFiltersCount = [
    filters.search !== '',
    filters.brands.length > 0,
    filters.categories.length > 0,
    filters.statuses.length > 0,
    filters.hasAbs !== 'all'
  ].filter(Boolean).length;

  const handleFilterUpdate = (key: keyof EnhancedFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const filterPresets = [
    {
      name: 'My Drafts',
      description: 'Show only draft motorcycles',
      filters: { ...filters, statuses: ['draft'] }
    },
    {
      name: 'Published Only',
      description: 'Show only published motorcycles',
      filters: { ...filters, statuses: ['published'] }
    },
    {
      name: 'Sport Bikes',
      description: 'Show sport motorcycles',
      filters: { ...filters, categories: ['Sport'] }
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <EnhancedSearchBar
            value={filters.search}
            onChange={(value) => handleFilterUpdate('search', value)}
            onClear={() => handleFilterUpdate('search', '')}
            suggestions={searchSuggestions}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Filter Presets */}
      <div className="flex flex-wrap gap-2">
        {filterPresets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => onFilterChange(preset.filters)}
            className="bg-explorer-dark border-explorer-chrome/30 hover:bg-accent-teal/20"
          >
            <Bookmark className="h-4 w-4 mr-1" />
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Advanced Filters */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-accent-teal text-black">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                disabled={activeFiltersCount === 0}
                className="bg-explorer-dark border-explorer-chrome/30"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear All
              </Button>
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-explorer-dark border-explorer-chrome/30"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>
        </CardHeader>

        {/* Quick Filters - Always Visible */}
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MultiSelectFilter
              title="Brands"
              options={filterOptions.brands}
              selectedValues={filters.brands}
              onChange={(values) => handleFilterUpdate('brands', values)}
              placeholder="All brands"
            />
            
            <MultiSelectFilter
              title="Categories"
              options={filterOptions.categories}
              selectedValues={filters.categories}
              onChange={(values) => handleFilterUpdate('categories', values)}
              placeholder="All categories"
            />
            
            <MultiSelectFilter
              title="Status"
              options={filterOptions.statuses}
              selectedValues={filters.statuses}
              onChange={(values) => handleFilterUpdate('statuses', values)}
              placeholder="All statuses"
            />
          </div>

          {/* Advanced Options */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleContent className="space-y-4 pt-4 border-t border-explorer-chrome/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-explorer-text mb-2 block">ABS Brakes</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'all', label: 'Any' },
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.hasAbs === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterUpdate('hasAbs', option.value)}
                        className={
                          filters.hasAbs === option.value
                            ? "bg-accent-teal text-black"
                            : "bg-explorer-dark border-explorer-chrome/30"
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Active Filter Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Search: "{filters.search}"
            </Badge>
          )}
          {filters.brands.map((brand) => (
            <Badge key={brand} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Brand: {brand}
            </Badge>
          ))}
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Type: {category}
            </Badge>
          ))}
          {filters.statuses.map((status) => (
            <Badge key={status} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              Status: {status}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedMotorcycleFilters;
