
import { useState, useCallback } from "react";
import { MotorcycleCategory } from "@/types";

export interface CategoryFilterState {
  categories: MotorcycleCategory[];
}

export function useCategoryFilter(initialCategories: MotorcycleCategory[] = []) {
  const [categories, setCategories] = useState<MotorcycleCategory[]>(initialCategories);

  const handleCategoryChange = useCallback((categoryOrCategories: MotorcycleCategory | MotorcycleCategory[], checkedOrUndefined?: boolean) => {
    if (Array.isArray(categoryOrCategories)) {
      // Handle setting all categories at once
      setCategories(categoryOrCategories);
    } else if (typeof checkedOrUndefined === 'boolean') {
      // Handle toggling a single category
      setCategories(prevCategories => {
        if (checkedOrUndefined) {
          return [...prevCategories, categoryOrCategories];
        } else {
          return prevCategories.filter(c => c !== categoryOrCategories);
        }
      });
    }
  }, []);

  return {
    categories,
    handleCategoryChange
  };
}
