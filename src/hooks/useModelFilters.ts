
import { useState, useMemo } from 'react';
import { MotorcycleModel } from '@/types/motorcycle';

export interface ModelFilters {
  search: string;
  category: string;
  brand: string;
  status: string;
  yearRange: [number, number];
}

export interface ModelSort {
  field: 'name' | 'brand' | 'production_start_year' | 'type' | 'created_at';
  direction: 'asc' | 'desc';
}

export function useModelFilters(models: MotorcycleModel[]) {
  const [filters, setFilters] = useState<ModelFilters>({
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    yearRange: [1900, 2030]
  });

  const [sort, setSort] = useState<ModelSort>({
    field: 'name',
    direction: 'asc'
  });

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models.filter(model => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const brandName = model.brand?.name || '';
        if (!model.name.toLowerCase().includes(searchLower) &&
            !brandName.toLowerCase().includes(searchLower) &&
            !model.type.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && model.type !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand !== 'all' && model.brand_id !== filters.brand) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'draft' && !model.is_draft) return false;
        if (filters.status === 'published' && model.is_draft) return false;
        if (filters.status !== 'draft' && filters.status !== 'published' && 
            model.production_status !== filters.status) return false;
      }

      // Year range filter
      if (model.production_start_year) {
        if (model.production_start_year < filters.yearRange[0] || 
            model.production_start_year > filters.yearRange[1]) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'brand':
          aValue = a.brand?.name || '';
          bValue = b.brand?.name || '';
          break;
        case 'production_start_year':
          aValue = a.production_start_year || 0;
          bValue = b.production_start_year || 0;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || '');
          bValue = new Date(b.created_at || '');
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [models, filters, sort]);

  const updateFilter = (key: keyof ModelFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      brand: 'all',
      status: 'all',
      yearRange: [1900, 2030]
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.brand !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2030) count++;
    return count;
  };

  const getUniqueCategories = () => {
    const categories = Array.from(new Set(models.map(m => m.type))).sort();
    return categories;
  };

  return {
    filters,
    sort,
    filteredAndSortedModels,
    updateFilter,
    setSort,
    clearFilters,
    getActiveFiltersCount,
    getUniqueCategories
  };
}
