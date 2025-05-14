
import { useState, useCallback } from 'react';
import type { MotorcycleCategory, MotorcycleFilters } from "@/types";

interface UseFilterCategoriesProps {
  initialCategories: MotorcycleCategory[];
  onFilterChange: (filters: MotorcycleFilters) => void;
  filters: MotorcycleFilters;
}

export function useFilterCategories({
  initialCategories,
  onFilterChange, 
  filters
}: UseFilterCategoriesProps) {
  const [availableCategories] = useState<MotorcycleCategory[]>(initialCategories);

  const handleCategoryChange = useCallback((category: MotorcycleCategory, checked: boolean) => {
    const updatedCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFilterChange({
      ...filters,
      categories: updatedCategories
    });
  }, [filters, onFilterChange]);

  const isCategorySelected = useCallback((category: MotorcycleCategory) => {
    return filters.categories.includes(category);
  }, [filters.categories]);

  return {
    availableCategories,
    selectedCategories: filters.categories,
    handleCategoryChange,
    isCategorySelected
  };
}
