
import { useState } from "react";
import type { MotorcycleCategory, MotorcycleFilters as FiltersType } from "@/types";
import { FiltersContext } from "./filters/FiltersContext";
import MobileFilters from "./filters/MobileFilters";
import DesktopFilters from "./filters/DesktopFilters";

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
}

export default function MotorcycleFilters({ 
  filters, 
  onFilterChange 
}: MotorcycleFiltersProps) {
  // Create context value for filter components
  const contextValue = {
    filters,
    onFilterChange,
    categories,
    commonMakes
  };

  return (
    <div className="sticky top-[4.5rem] space-y-4 py-4">
      <FiltersContext.Provider value={contextValue}>
        {/* Mobile filters */}
        <MobileFilters 
          filters={filters}
          onFilterChange={onFilterChange}
          categories={categories}
          commonMakes={commonMakes}
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
