
import React, { useState, useMemo } from 'react';
import { Motorcycle } from '@/types';
import QuickFilters from './QuickFilters';
import AdvancedFilters from './AdvancedFilters';
import FilterPresets from './FilterPresets';

interface FilterState {
  searchTerm: string;
  yearRange: [number, number];
  statusFilter: 'all' | 'published' | 'draft';
  brands: string[];
  categories: string[];
  engineSizeRange: [number, number];
  hasAbs: 'all' | 'yes' | 'no';
  hasTractionControl: 'all' | 'yes' | 'no';
  dataCompleteness: 'all' | 'complete' | 'incomplete';
}

interface EnhancedFiltersContainerProps {
  motorcycles: Motorcycle[];
  onFilteredMotorcycles: (motorcycles: Motorcycle[]) => void;
}

const EnhancedFiltersContainer = ({
  motorcycles,
  onFilteredMotorcycles
}: EnhancedFiltersContainerProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    yearRange: [1900, 2030],
    statusFilter: 'all',
    brands: [],
    categories: [],
    engineSizeRange: [0, 3000],
    hasAbs: 'all',
    hasTractionControl: 'all',
    dataCompleteness: 'all'
  });

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2030) count++;
    if (filters.statusFilter !== 'all') count++;
    if (filters.brands.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.engineSizeRange[0] !== 0 || filters.engineSizeRange[1] !== 3000) count++;
    if (filters.hasAbs !== 'all') count++;
    if (filters.hasTractionControl !== 'all') count++;
    if (filters.dataCompleteness !== 'all') count++;
    return count;
  }, [filters]);

  // Filter motorcycles based on current filters
  const filteredMotorcycles = useMemo(() => {
    let filtered = motorcycles;

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.brand?.name.toLowerCase().includes(searchLower) ||
        (m.category || m.type || '').toLowerCase().includes(searchLower)
      );
    }

    // Year range filter
    filtered = filtered.filter(m => {
      const year = m.production_start_year || 0;
      return year >= filters.yearRange[0] && year <= filters.yearRange[1];
    });

    // Status filter
    if (filters.statusFilter === 'published') {
      filtered = filtered.filter(m => !m.is_draft);
    } else if (filters.statusFilter === 'draft') {
      filtered = filtered.filter(m => m.is_draft);
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(m => 
        filters.brands.includes(m.brand?.name || '')
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(m => 
        filters.categories.includes(m.category || m.type || '')
      );
    }

    // Engine size filter
    filtered = filtered.filter(m => {
      const engineSize = m.engine_size || 0;
      return engineSize >= filters.engineSizeRange[0] && engineSize <= filters.engineSizeRange[1];
    });

    // ABS filter
    if (filters.hasAbs === 'yes') {
      filtered = filtered.filter(m => m.has_abs === true);
    } else if (filters.hasAbs === 'no') {
      filtered = filtered.filter(m => m.has_abs === false);
    }

    // Data completeness filter
    if (filters.dataCompleteness === 'complete') {
      filtered = filtered.filter(m => 
        m.engine_size && m.horsepower && m.weight_kg && m.seat_height_mm
      );
    } else if (filters.dataCompleteness === 'incomplete') {
      filtered = filtered.filter(m => 
        !m.engine_size || !m.horsepower || !m.weight_kg || !m.seat_height_mm
      );
    }

    return filtered;
  }, [motorcycles, filters]);

  // Update parent component with filtered results
  React.useEffect(() => {
    onFilteredMotorcycles(filteredMotorcycles);
  }, [filteredMotorcycles, onFilteredMotorcycles]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({
      searchTerm: '',
      yearRange: [1900, 2030],
      statusFilter: 'all',
      brands: [],
      categories: [],
      engineSizeRange: [0, 3000],
      hasAbs: 'all',
      hasTractionControl: 'all',
      dataCompleteness: 'all'
    });
  };

  const handleApplyPreset = (preset: any) => {
    setFilters(prev => ({ ...prev, ...preset.filters }));
  };

  return (
    <div className="space-y-4">
      {/* Filter Presets */}
      <FilterPresets
        motorcycles={motorcycles}
        onApplyPreset={handleApplyPreset}
      />

      {/* Quick Filters */}
      <QuickFilters
        motorcycles={motorcycles}
        searchTerm={filters.searchTerm}
        yearRange={filters.yearRange}
        statusFilter={filters.statusFilter}
        activeFiltersCount={activeFiltersCount}
        onSearchChange={(term) => handleFilterChange('searchTerm', term)}
        onYearRangeChange={(range) => handleFilterChange('yearRange', range)}
        onStatusChange={(status) => handleFilterChange('statusFilter', status)}
        onClearAll={handleClearAll}
      />

      {/* Advanced Filters */}
      <AdvancedFilters
        motorcycles={motorcycles}
        isOpen={isAdvancedOpen}
        onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
        filters={{
          brands: filters.brands,
          categories: filters.categories,
          engineSizeRange: filters.engineSizeRange,
          hasAbs: filters.hasAbs,
          hasTractionControl: filters.hasTractionControl,
          dataCompleteness: filters.dataCompleteness
        }}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default EnhancedFiltersContainer;
