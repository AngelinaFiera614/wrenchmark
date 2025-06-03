
import { Motorcycle, MotorcycleFilters } from "@/types";
import { useFilterState } from "./filters/useFilterState";
import { useMotorcycleFiltering } from "./filters/useMotorcycleFiltering";
import { useFilteringState } from "./filters/useFilteringState";

// Updated filters to be more inclusive of incomplete data
export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1950, 2025],
  engineSizeRange: [0, 2000], // Increased max to be more inclusive
  difficultyLevel: 5,
  weightRange: [0, 500], // Increased max for heavier bikes
  seatHeightRange: [500, 1200], // More inclusive range
  abs: null,
  searchTerm: "",
  styleTags: [],
  useCases: [],
  skillLevel: [],
  transmission: [],
  driveType: [],
  powerToWeightRange: [0, 3.0], // More inclusive range
  isEntryLevel: null,
  coolingSystem: [],
  licenseLevelFilter: [],
  priceRange: [0, 100000], // More inclusive price range
  hasSmartFeatures: null,
  fuelCapacityRange: [0, 50], // More inclusive fuel range
  topSpeedRange: [0, 400], // More inclusive speed range
  torqueRange: [0, 300], // More inclusive torque range
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
  const withEngineData = motorcycles.filter(m => m.engine_size > 0);
  const withPowerData = motorcycles.filter(m => m.horsepower > 0);
  const withWeightData = motorcycles.filter(m => m.weight_kg > 0);
  const withSeatHeightData = motorcycles.filter(m => m.seat_height_mm > 0);
  
  console.log("Data quality summary:", {
    total: motorcycles.length,
    valid: validMotorcycles.length,
    withEngine: withEngineData.length,
    withPower: withPowerData.length,
    withWeight: withWeightData.length,
    withSeatHeight: withSeatHeightData.length
  });

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

  return {
    filters,
    ...handlers,
    filteredMotorcycles,
    isFiltering,
    isSearching
  };
}
