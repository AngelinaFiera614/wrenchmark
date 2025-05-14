
import { useState, useCallback } from "react";
import { MotorcycleCategory } from "@/types";

export interface CategoryFilterState {
  categories: MotorcycleCategory[];
}

export function useCategoryFilter(initialCategories: MotorcycleCategory[] = []) {
  const [categories, setCategories] = useState<MotorcycleCategory[]>(initialCategories);

  // Handler for category changes
  const handleCategoryChange = useCallback((category: MotorcycleCategory, checked: boolean) => {
    setCategories(prevCategories => {
      const updatedCategories = checked 
        ? [...prevCategories, category]
        : prevCategories.filter(c => c !== category);
      
      return updatedCategories;
    });
  }, []);

  // Overload to handle setting all categories at once
  const handleCategoriesChange = useCallback((newCategories: MotorcycleCategory[]) => {
    setCategories(newCategories);
  }, []);

  // Combined handler that works with both single category changes and bulk updates
  const combinedHandler = useCallback((categoryOrCategories: MotorcycleCategory | MotorcycleCategory[], checkedOrUndefined?: boolean) => {
    if (Array.isArray(categoryOrCategories)) {
      handleCategoriesChange(categoryOrCategories);
    } else if (typeof checkedOrUndefined === 'boolean') {
      handleCategoryChange(categoryOrCategories, checkedOrUndefined);
    }
  }, [handleCategoryChange, handleCategoriesChange]);

  return {
    categories,
    handleCategoryChange: combinedHandler
  };
}
