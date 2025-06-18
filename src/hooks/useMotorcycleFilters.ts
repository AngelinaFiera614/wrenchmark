
import { Motorcycle, MotorcycleFilters } from "@/types";
import { useFilterState } from "./filters/useFilterState";
import { useMotorcycleFiltering } from "./filters/useMotorcycleFiltering";
import { useFilteringState } from "./filters/useFilteringState";

// More inclusive initial filters to handle real data
export const initialFilters: MotorcycleFilters = {
  search: "",
  categories: [],
  make: "",
  yearRange: [1900, 2030], // More inclusive year range
  engineSizeRange: [0, 3000], // Increased max for larger engines
  difficultyLevel: 5,
  weightRange: [0, 600], // Increased max for heavier bikes
  seatHeightRange: [400, 1300], // More inclusive seat height range
  abs: null,
  searchTerm: "",
  styleTags: [],
  useCases: [],
  skillLevel: [],
  transmission: [],
  driveType: [],
  powerToWeightRange: [0, 5.0], // More inclusive power-to-weight
  isEntryLevel: null,
  coolingSystem: [],
  licenseLevelFilter: [],
  priceRange: [0, 150000], // Higher price range
  hasSmartFeatures: null,
  fuelCapacityRange: [0, 100], // Larger fuel capacity range
  topSpeedRange: [0, 500], // Higher top speed range
  torqueRange: [0, 500], // Higher torque range
  advancedSearch: {
    engineType: [],
    cylinderCount: [],
    brakeType: [],
    frameType: [],
    suspensionType: []
  }
};

export function useMotorcycleFilters(
  motorcycles: Motorcycle[], 
  startingFilters: MotorcycleFilters = initialFilters
) {
  console.log("=== MOTORCYCLE FILTERS HOOK DEBUG ===");
  console.log("Input motorcycles count:", motorcycles.length);
  
  // Enhanced logging for data quality
  const validMotorcycles = motorcycles.filter(m => !m.is_placeholder);
  const withEngineData = motorcycles.filter(m => (m.engine_size || 0) > 0);
  const withPowerData = motorcycles.filter(m => (m.horsepower || 0) > 0);
  const withWeightData = motorcycles.filter(m => (m.weight_kg || 0) > 0);
  const withSeatHeightData = motorcycles.filter(m => (m.seat_height_mm || 0) > 0);
  
  console.log("Data quality summary:", {
    total: motorcycles.length,
    valid: validMotorcycles.length,
    withEngine: withEngineData.length,
    withPower: withPowerData.length,
    withWeight: withWeightData.length,
    withSeatHeight: withSeatHeightData.length
  });

  // Sample some data for debugging
  if (motorcycles.length > 0) {
    const sample = motorcycles[0];
    console.log("Sample motorcycle data:", {
      name: `${sample.make} ${sample.model}`,
      year: sample.year,
      engine_size: sample.engine_size,
      weight_kg: sample.weight_kg,
      seat_height_mm: sample.seat_height_mm,
      is_placeholder: sample.is_placeholder,
      migration_status: sample.migration_status
    });
  }

  const {
    filters,
    debouncedSearchTerm,
    isSearching,
    handlers
  } = useFilterState(startingFilters);

  const { isFiltering } = useFilteringState(filters);

  const filteredMotorcycles = useMotorcycleFiltering(
    motorcycles, 
    filters, 
    debouncedSearchTerm
  );

  console.log("Filtered motorcycles count:", filteredMotorcycles.length);

  // Create a custom handleSearchChange that updates the searchTerm property
  const handleSearchChange = (term: string) => {
    handlers.handleFilterChange({ ...filters, searchTerm: term, search: term });
  };

  return {
    filters,
    ...handlers,
    handleSearchChange, // Override with our custom implementation
    filteredMotorcycles,
    isFiltering,
    isSearching
  };
}
