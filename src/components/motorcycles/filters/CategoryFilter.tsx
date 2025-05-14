
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { MotorcycleCategory } from "@/types";
import FilterSection from "./FilterSection";
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
  const idPrefix = isMobile ? "category-" : "category-desktop-";
  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <FilterSection 
      title="Categories" 
      action={hasActiveFilters ? 
        <FilterReset filterType="categories" /> : 
        undefined
      }
    >
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => {
          const isChecked = selectedCategories.includes(category);
          
          return (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`${idPrefix}${category}`} 
                checked={isChecked}
                onCheckedChange={(checked) => 
                  onChange(category, checked as boolean)
                }
              />
              <Label 
                htmlFor={`${idPrefix}${category}`}
                className={isChecked ? "font-medium" : ""}
              >
                {category}
              </Label>
              {isChecked && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </FilterSection>
  );
}
