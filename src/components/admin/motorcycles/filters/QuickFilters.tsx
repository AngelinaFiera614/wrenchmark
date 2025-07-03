
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RotateCcw } from 'lucide-react';
import EnhancedMotorcycleSearch from '../search/EnhancedMotorcycleSearch';
import { Motorcycle } from '@/types';

interface QuickFiltersProps {
  motorcycles: Motorcycle[];
  searchTerm: string;
  yearRange: [number, number];
  statusFilter: 'all' | 'published' | 'draft';
  activeFiltersCount: number;
  onSearchChange: (term: string) => void;
  onYearRangeChange: (range: [number, number]) => void;
  onStatusChange: (status: 'all' | 'published' | 'draft') => void;
  onClearAll: () => void;
}

const QuickFilters = ({
  motorcycles,
  searchTerm,
  yearRange,
  statusFilter,
  activeFiltersCount,
  onSearchChange,
  onYearRangeChange,
  onStatusChange,
  onClearAll
}: QuickFiltersProps) => {
  const publishedCount = motorcycles.filter(m => !m.is_draft).length;
  const draftCount = motorcycles.filter(m => m.is_draft).length;
  const totalCount = motorcycles.length;

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <EnhancedMotorcycleSearch
            motorcycles={motorcycles}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onAdvancedToggle={() => {}}
            isAdvancedOpen={false}
            activeFiltersCount={0}
          />

          {/* Year Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-explorer-text">
                Production Year
              </label>
              <span className="text-sm text-explorer-text-muted">
                {yearRange[0]} - {yearRange[1]}
              </span>
            </div>
            <Slider
              value={yearRange}
              onValueChange={(value) => onYearRangeChange(value as [number, number])}
              min={1900}
              max={2030}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-explorer-text-muted mt-1">
              <span>1900</span>
              <span>2030</span>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-explorer-text">Status:</span>
              <div className="flex gap-1">
                <Button
                  variant={statusFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange('all')}
                  className={
                    statusFilter === 'all'
                      ? "bg-accent-teal text-black"
                      : "bg-explorer-dark border-explorer-chrome/30"
                  }
                >
                  All ({totalCount})
                </Button>
                <Button
                  variant={statusFilter === 'published' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange('published')}
                  className={
                    statusFilter === 'published'
                      ? "bg-green-600 text-white"
                      : "bg-explorer-dark border-explorer-chrome/30"
                  }
                >
                  Published ({publishedCount})
                </Button>
                <Button
                  variant={statusFilter === 'draft' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange('draft')}
                  className={
                    statusFilter === 'draft'
                      ? "bg-orange-600 text-white"
                      : "bg-explorer-dark border-explorer-chrome/30"
                  }
                >
                  Drafts ({draftCount})
                </Button>
              </div>
            </div>

            {/* Clear All Button */}
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-accent-teal text-black">
                  {activeFiltersCount} active
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                disabled={activeFiltersCount === 0}
                className="bg-explorer-dark border-explorer-chrome/30"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickFilters;
