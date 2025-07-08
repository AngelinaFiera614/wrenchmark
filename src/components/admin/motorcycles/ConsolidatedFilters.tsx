
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  EyeOff,
  Minimize2,
  X 
} from 'lucide-react';
import { Motorcycle } from '@/types';
import CheckboxFilterSection from './CheckboxFilterSection';

interface ConsolidatedFiltersProps {
  filters: {
    search: string;
    brands: string[];
    categories: string[];
    statuses: string[];
    hasAbs: 'all' | 'yes' | 'no';
  };
  motorcycles: Motorcycle[];
  allBrands: Array<{ id: string; name: string; count: number }>;
  allCategories: Array<{ value: string; label: string; count: number }>;
  onFilterChange: (key: string, values: any) => void;
  onClearFilters: () => void;
}

const ConsolidatedFilters = ({
  filters,
  motorcycles,
  allBrands,
  allCategories,
  onFilterChange,
  onClearFilters
}: ConsolidatedFiltersProps) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [openSections, setOpenSections] = useState({
    brands: false,
    categories: false,
    status: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const collapseAll = () => {
    setOpenSections({
      brands: false,
      categories: false,
      status: false
    });
  };

  const expandAll = () => {
    setOpenSections({
      brands: true,
      categories: true,
      status: true
    });
  };

  // Generate filter options with counts
  const brandOptions = useMemo(() => 
    allBrands.map(brand => ({
      value: brand.id,
      label: brand.name,
      count: brand.count
    })),
    [allBrands]
  );

  const categoryOptions = useMemo(() => 
    allCategories.map(cat => ({
      value: cat.value,
      label: cat.label,
      count: cat.count
    })),
    [allCategories]
  );

  const statusOptions = [
    { value: 'published', label: 'Published', count: motorcycles.filter(m => !m.is_draft).length },
    { value: 'draft', label: 'Draft', count: motorcycles.filter(m => m.is_draft).length }
  ];

  const activeFiltersCount = [
    filters.search !== '',
    filters.brands.length > 0,
    filters.categories.length > 0,
    filters.statuses.length > 0,
    filters.hasAbs !== 'all'
  ].filter(Boolean).length;

  // Quick filter preset options
  const quickFilters = [
    { label: 'Entry Level', action: () => onFilterChange('categories', ['Standard', 'Cruiser']) },
    { label: 'Sport Bikes', action: () => onFilterChange('categories', ['Sport']) },
    { label: 'Adventure', action: () => onFilterChange('categories', ['Adventure', 'Dual-sport']) },
    { label: 'High Performance', action: () => onFilterChange('categories', ['Sport', 'Naked']) },
    { label: 'With ABS', action: () => onFilterChange('hasAbs', 'yes') },
    { label: 'Recent Models', action: () => {
      const currentYear = new Date().getFullYear();
      // Filter by recent production years in the motorcycle data
      const recentIds = motorcycles
        .filter(m => (m.production_start_year || 0) >= currentYear - 5)
        .map(m => m.brand?.id || m.brands?.id)
        .filter(Boolean);
      onFilterChange('brands', Array.from(new Set(recentIds)));
    }}
  ];

  if (!isFiltersVisible) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFiltersVisible(true)}
          className="bg-explorer-dark border-explorer-chrome/30"
        >
          <Eye className="h-4 w-4 mr-2" />
          Show Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-accent-teal text-black ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-accent-teal" />
            <CardTitle className="text-explorer-text">
              Filters & Search
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-accent-teal text-black">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={collapseAll}
              className="bg-explorer-dark border-explorer-chrome/30 text-xs"
              title="Collapse All Sections"
            >
              <Minimize2 className="h-3 w-3 mr-1" />
              Collapse All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={activeFiltersCount === 0}
              className="bg-explorer-dark border-explorer-chrome/30 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersVisible(false)}
              className="bg-explorer-dark border-explorer-chrome/30 text-xs"
              title="Hide Filters"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder="Search motorcycles, brands, or categories..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30 text-explorer-text placeholder:text-explorer-text-muted focus:border-accent-teal"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-explorer-chrome/20"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Quick Status Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-explorer-text-muted font-medium">Quick Status:</span>
          <div className="flex gap-1">
            <Button
              variant={filters.statuses.length === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('statuses', [])}
              className={
                filters.statuses.length === 0
                  ? "bg-accent-teal text-black text-xs px-3 py-1.5 h-auto"
                  : "bg-explorer-dark border-explorer-chrome/30 text-xs px-3 py-1.5 h-auto hover:bg-explorer-chrome/20"
              }
            >
              All ({motorcycles.length})
            </Button>
            <Button
              variant={filters.statuses.includes('published') && filters.statuses.length === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('statuses', ['published'])}
              className={
                filters.statuses.includes('published') && filters.statuses.length === 1
                  ? "bg-green-600 text-white text-xs px-3 py-1.5 h-auto"
                  : "bg-explorer-dark border-explorer-chrome/30 text-xs px-3 py-1.5 h-auto hover:bg-explorer-chrome/20"
              }
            >
              Published ({statusOptions.find(s => s.value === 'published')?.count || 0})
            </Button>
            <Button
              variant={filters.statuses.includes('draft') && filters.statuses.length === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('statuses', ['draft'])}
              className={
                filters.statuses.includes('draft') && filters.statuses.length === 1
                  ? "bg-orange-600 text-white text-xs px-3 py-1.5 h-auto"
                  : "bg-explorer-dark border-explorer-chrome/30 text-xs px-3 py-1.5 h-auto hover:bg-explorer-chrome/20"
              }
            >
              Drafts ({statusOptions.find(s => s.value === 'draft')?.count || 0})
            </Button>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-explorer-text-muted font-medium">Quick Filters:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={expandAll}
              className="bg-explorer-dark border-explorer-chrome/30 text-xs"
              title="Expand All Sections"
            >
              Expand All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={filter.action}
                className="bg-explorer-dark border-explorer-chrome/30 text-xs px-2 py-1.5 h-auto hover:bg-accent-teal/20"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Detailed Filter Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-explorer-chrome/30">
          <CheckboxFilterSection
            title="Brands"
            options={brandOptions}
            selectedValues={filters.brands}
            onChange={(values) => onFilterChange('brands', values)}
            isOpen={openSections.brands}
            onToggle={() => toggleSection('brands')}
            maxHeight="250px"
          />

          <CheckboxFilterSection
            title="Categories"
            options={categoryOptions}
            selectedValues={filters.categories}
            onChange={(values) => onFilterChange('categories', values)}
            isOpen={openSections.categories}
            onToggle={() => toggleSection('categories')}
          />

          <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg">
            <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto font-medium text-explorer-text hover:bg-explorer-chrome/10"
                >
                  <div className="flex items-center gap-2">
                    <span>Advanced Options</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.status ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-explorer-text mb-2 block">ABS Brakes</label>
                    <div className="flex gap-1">
                      {['all', 'yes', 'no'].map((option) => (
                        <Button
                          key={option}
                          variant={filters.hasAbs === option ? "default" : "outline"}
                          size="sm"
                          onClick={() => onFilterChange('hasAbs', option)}
                          className={
                            filters.hasAbs === option
                              ? "bg-accent-teal text-black text-xs px-2 py-1.5 h-auto"
                              : "bg-explorer-dark border-explorer-chrome/30 text-xs px-2 py-1.5 h-auto hover:bg-explorer-chrome/20"
                          }
                        >
                          {option === 'all' ? 'Any' : option === 'yes' ? 'Yes' : 'No'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Active Filter Pills */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-explorer-chrome/30">
            {filters.search && (
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                Search: "{filters.search}"
                <X
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-accent-teal/80"
                  onClick={() => onFilterChange('search', '')}
                />
              </Badge>
            )}
            {filters.brands.map((brandId) => {
              const brand = allBrands.find(b => b.id === brandId);
              return brand ? (
                <Badge key={brandId} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                  {brand.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-accent-teal/80"
                    onClick={() => onFilterChange('brands', filters.brands.filter(id => id !== brandId))}
                  />
                </Badge>
              ) : null;
            })}
            {filters.categories.map((category) => {
              const cat = allCategories.find(c => c.value === category);
              return cat ? (
                <Badge key={category} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                  {cat.label}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-accent-teal/80"
                    onClick={() => onFilterChange('categories', filters.categories.filter(c => c !== category))}
                  />
                </Badge>
              ) : null;
            })}
            {filters.statuses.map((status) => (
              <Badge key={status} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                {status}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-accent-teal/80"
                  onClick={() => onFilterChange('statuses', filters.statuses.filter(s => s !== status))}
                />
              </Badge>
            ))}
            {filters.hasAbs !== 'all' && (
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                ABS: {filters.hasAbs === 'yes' ? 'Yes' : 'No'}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-accent-teal/80"
                  onClick={() => onFilterChange('hasAbs', 'all')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsolidatedFilters;
