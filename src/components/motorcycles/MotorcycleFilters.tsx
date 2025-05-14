
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { MotorcycleCategory, MotorcycleFilters as FiltersType } from "@/types";
import { FiltersContext } from "./filters/FiltersContext";
import MobileFilters from "./filters/MobileFilters";
import DesktopFilters from "./filters/DesktopFilters";
import { countActiveFilters } from "@/lib/filter-utils";

const categories: MotorcycleCategory[] = [
  "Sport",
  "Cruiser",
  "Touring",
  "Adventure",
  "Naked",
  "Dual-sport",
  "Standard",
  "Scooter",
  "Off-road",
];

const commonMakes = [
  "Honda",
  "Yamaha",
  "Kawasaki",
  "Suzuki",
  "Harley-Davidson",
  "BMW",
  "Ducati",
  "Triumph",
  "KTM",
  "Royal Enfield",
];

interface MotorcycleFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  isFiltering?: boolean;
}

export default function MotorcycleFilters({ 
  filters, 
  onFilterChange,
  isFiltering = false
}: MotorcycleFiltersProps) {
  // Create context value for filter components
  const contextValue = {
    filters,
    onFilterChange,
    categories,
    commonMakes,
    isFiltering
  };

  // Count active filters
  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="sticky top-[4.5rem] space-y-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      <FiltersContext.Provider value={contextValue}>
        {/* Mobile filters */}
        <MobileFilters 
          filters={filters}
          onFilterChange={onFilterChange}
          categories={categories}
          commonMakes={commonMakes}
          activeFilterCount={activeFilterCount}
        />

        {/* Desktop filters - always visible */}
        <DesktopFilters
          filters={filters}
          onFilterChange={onFilterChange}
          categories={categories}
          commonMakes={commonMakes}
        />
      </FiltersContext.Provider>
    </div>
  );
}
