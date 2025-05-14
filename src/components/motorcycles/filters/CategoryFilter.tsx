
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { MotorcycleCategory } from "@/types";
import FilterSection from "./FilterSection";

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
  const idPrefix = isMobile ? "category-" : "category-desktop-";

  return (
    <FilterSection title="Categories">
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={`${idPrefix}${category}`} 
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) => 
                onChange(category, checked as boolean)
              }
            />
            <Label htmlFor={`${idPrefix}${category}`}>{category}</Label>
          </div>
        ))}
      </div>
    </FilterSection>
  );
}
