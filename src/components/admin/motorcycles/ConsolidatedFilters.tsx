
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';
import { Motorcycle } from '@/types';
import CheckboxFilterSection from './CheckboxFilterSection';

interface ConsolidatedFiltersProps {
  filters: {
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
  const [openSections, setOpenSections] = useState({
    brands: true,
    categories: true,
    status: false,
    advanced: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    filters.brands.length > 0,
    filters.categories.length > 0,
    filters.statuses.length > 0,
    filters.hasAbs !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-explorer-text">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-accent-teal text-black">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
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
      </div>

      {/* Filter Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <CheckboxFilterSection
          title="Status"
          options={statusOptions}
          selectedValues={filters.statuses}
          onChange={(values) => onFilterChange('statuses', values)}
          isOpen={openSections.status}
          onToggle={() => toggleSection('status')}
        />

        <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-4">
          <h3 className="font-medium text-explorer-text mb-3">Quick Filters</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-explorer-text">ABS Brakes:</span>
              <div className="flex gap-1">
                {['all', 'yes', 'no'].map((option) => (
                  <Button
                    key={option}
                    variant={filters.hasAbs === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange('hasAbs', option)}
                    className={
                      filters.hasAbs === option
                        ? "bg-accent-teal text-black text-xs px-2 py-1"
                        : "bg-explorer-dark border-explorer-chrome/30 text-xs px-2 py-1"
                    }
                  >
                    {option === 'all' ? 'Any' : option === 'yes' ? 'Yes' : 'No'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-explorer-chrome/30">
          {filters.brands.map((brandId) => {
            const brand = allBrands.find(b => b.id === brandId);
            return brand ? (
              <Badge key={brandId} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                {brand.name}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
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
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => onFilterChange('categories', filters.categories.filter(c => c !== category))}
                />
              </Badge>
            ) : null;
          })}
          {filters.statuses.map((status) => (
            <Badge key={status} variant="secondary" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
              {status}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => onFilterChange('statuses', filters.statuses.filter(s => s !== status))}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsolidatedFilters;
