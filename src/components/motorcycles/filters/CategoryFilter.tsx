
import React from "react";
import type { MotorcycleCategory } from "@/types";
import FilterSection from "@/components/common/FilterSection";
import CheckboxList from "@/components/common/CheckboxList";
import FilterReset from "./FilterReset";

interface CategoryFilterProps {
  categories: MotorcycleCategory[];
  selectedCategories: MotorcycleCategory[];
  onChange: (category: MotorcycleCategory, checked: boolean) => void;
  isMobile?: boolean;
}

export default function CategoryFilter({ 
  categories,
  selectedCategories,
  onChange,
  isMobile = false
}: CategoryFilterProps) {
  const hasActiveFilters = selectedCategories.length > 0;
  
  const checkboxItems = categories.map(category => ({
    id: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    label: category as string, // Convert to string for display
    value: category as string  // Convert to string for value
  }));

  // Convert the handler to work with strings
  const handleChange = (value: string, checked: boolean) => {
    onChange(value as MotorcycleCategory, checked);
  };

  return (
    <FilterSection 
      title="Categories" 
      action={hasActiveFilters ? 
        <FilterReset filterType="categories" /> : 
        undefined
      }
    >
      <CheckboxList
        items={checkboxItems}
        selectedValues={selectedCategories as string[]}
        onChange={handleChange}
        idPrefix={isMobile ? "category-mobile" : "category-desktop"}
      />
    </FilterSection>
  );
}
