
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings } from 'lucide-react';
import { Motorcycle } from '@/types';
import MultiSelectFilter from './MultiSelectFilter';

interface AdvancedFiltersProps {
  motorcycles: Motorcycle[];
  isOpen: boolean;
  onToggle: () => void;
  filters: {
    brands: string[];
    categories: string[];
    engineSizeRange: [number, number];
    hasAbs: 'all' | 'yes' | 'no';
    hasTractionControl: 'all' | 'yes' | 'no';
    dataCompleteness: 'all' | 'complete' | 'incomplete';
  };
  onFilterChange: (key: string, value: any) => void;
}

const AdvancedFilters = ({
  motorcycles,
  isOpen,
  onToggle,
  filters,
  onFilterChange
}: AdvancedFiltersProps) => {
  // Get unique brands and categories
  const brands = Array.from(new Set(motorcycles.map(m => m.brand?.name).filter(Boolean))).sort();
  const categories = Array.from(new Set(motorcycles.map(m => m.category || m.type).filter(Boolean))).sort();

  const brandOptions = brands.map(brand => ({ value: brand, label: brand }));
  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-explorer-dark border-explorer-chrome/30"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Filters
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="bg-explorer-card border-explorer-chrome/30 mt-2">
          <CardHeader>
            <CardTitle className="text-lg text-explorer-text">Advanced Filtering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Multi-Select */}
              <MultiSelectFilter
                label="Brands"
                options={brandOptions}
                selectedValues={filters.brands}
                onChange={(values) => onFilterChange('brands', values)}
                placeholder="Select brands..."
              />

              {/* Category Multi-Select */}
              <MultiSelectFilter
                label="Categories"
                options={categoryOptions}
                selectedValues={filters.categories}
                onChange={(values) => onFilterChange('categories', values)}
                placeholder="Select categories..."
              />
            </div>

            {/* Engine Size Range */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">
                Engine Size: {filters.engineSizeRange[0]}cc - {filters.engineSizeRange[1]}cc
              </label>
              <Slider
                value={filters.engineSizeRange}
                onValueChange={(value) => onFilterChange('engineSizeRange', value as [number, number])}
                min={0}
                max={3000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-explorer-text-muted mt-1">
                <span>0cc</span>
                <span>3000cc</span>
              </div>
            </div>

            {/* Features Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-explorer-text mb-2 block">ABS Brakes</label>
                <div className="flex gap-2">
                  {[
                    { label: 'Any', value: 'all' },
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={filters.hasAbs === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFilterChange('hasAbs', option.value)}
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

              <div>
                <label className="text-sm font-medium text-explorer-text mb-2 block">Traction Control</label>
                <div className="flex gap-2">
                  {[
                    { label: 'Any', value: 'all' },
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={filters.hasTractionControl === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFilterChange('hasTractionControl', option.value)}
                      className={
                        filters.hasTractionControl === option.value
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

            {/* Data Completeness Filter */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">Data Completeness</label>
              <div className="flex gap-2">
                {[
                  { label: 'All Data', value: 'all' },
                  { label: 'Complete', value: 'complete' },
                  { label: 'Incomplete', value: 'incomplete' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={filters.dataCompleteness === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange('dataCompleteness', option.value)}
                    className={
                      filters.dataCompleteness === option.value
                        ? "bg-accent-teal text-black"
                        : "bg-explorer-dark border-explorer-chrome/30"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedFilters;
