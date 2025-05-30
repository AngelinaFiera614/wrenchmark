
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MotorcycleFilters, MotorcycleCategory } from "@/types";

interface QuickFiltersProps {
  filters: MotorcycleFilters;
  onFilterChange: (filters: MotorcycleFilters) => void;
}

export default function QuickFilters({ filters, onFilterChange }: QuickFiltersProps) {
  const quickFilterOptions = [
    {
      label: "Beginner Friendly",
      active: filters.isEntryLevel === true,
      action: () => onFilterChange({
        ...filters,
        isEntryLevel: filters.isEntryLevel === true ? null : true,
        difficultyLevel: filters.isEntryLevel === true ? 5 : 2
      })
    },
    {
      label: "ABS",
      active: filters.abs === true,
      action: () => onFilterChange({
        ...filters,
        abs: filters.abs === true ? null : true
      })
    },
    {
      label: "Smart Features",
      active: filters.hasSmartFeatures === true,
      action: () => onFilterChange({
        ...filters,
        hasSmartFeatures: filters.hasSmartFeatures === true ? null : true
      })
    },
    {
      label: "Sport",
      active: filters.categories.includes("Sport"),
      action: () => {
        const newCategories = filters.categories.includes("Sport")
          ? filters.categories.filter(c => c !== "Sport")
          : [...filters.categories, "Sport" as MotorcycleCategory];
        onFilterChange({
          ...filters,
          categories: newCategories
        });
      }
    },
    {
      label: "Touring",
      active: filters.categories.includes("Touring"),
      action: () => {
        const newCategories = filters.categories.includes("Touring")
          ? filters.categories.filter(c => c !== "Touring")
          : [...filters.categories, "Touring" as MotorcycleCategory];
        onFilterChange({
          ...filters,
          categories: newCategories
        });
      }
    },
    {
      label: "Adventure",
      active: filters.categories.includes("Adventure"),
      action: () => {
        const newCategories = filters.categories.includes("Adventure")
          ? filters.categories.filter(c => c !== "Adventure")
          : [...filters.categories, "Adventure" as MotorcycleCategory];
        onFilterChange({
          ...filters,
          categories: newCategories
        });
      }
    },
    {
      label: "Under 300cc",
      active: filters.engineSizeRange[1] <= 300,
      action: () => onFilterChange({
        ...filters,
        engineSizeRange: filters.engineSizeRange[1] <= 300 
          ? [0, 2000] 
          : [0, 300]
      })
    },
    {
      label: "High Performance",
      active: filters.powerToWeightRange && filters.powerToWeightRange[0] >= 1.0,
      action: () => onFilterChange({
        ...filters,
        powerToWeightRange: filters.powerToWeightRange && filters.powerToWeightRange[0] >= 1.0
          ? [0, 2.0]
          : [1.0, 2.0]
      })
    }
  ];

  const activeCount = quickFilterOptions.filter(option => option.active).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Quick Filters</h3>
        {activeCount > 0 && (
          <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal text-xs">
            {activeCount} active
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {quickFilterOptions.map((option) => (
          <Button
            key={option.label}
            variant={option.active ? "default" : "outline"}
            size="sm"
            onClick={option.action}
            className={`text-xs h-7 ${
              option.active 
                ? "bg-accent-teal hover:bg-accent-teal/90 text-background" 
                : "hover:bg-accent-teal/10 hover:text-accent-teal"
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
