
import { Motorcycle, MotorcycleFilters } from "@/types";
import { useFilterState } from "./filters/useFilterState";
import { useMotorcycleFiltering } from "./filters/useMotorcycleFiltering";
import { useFilteringState } from "./filters/useFilteringState";

export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1950, 2025], // Expanded range
  engineSizeRange: [0, 3000], // Expanded range to include larger engines
  difficultyLevel: 5, // Set to max level so it doesn't filter out anything
  weightRange: [0, 800], // Expanded weight range to accommodate all motorcycles
  seatHeightRange: [500, 1200], // Expanded seat height range
  abs: null, // Changed to null so it doesn't filter
  searchTerm: "",
  styleTags: [],
  useCases: [],
  skillLevel: [],
  transmission: [],
  driveType: [],
  powerToWeightRange: [0, 10.0], // Expanded power-to-weight range
  isEntryLevel: null,
  coolingSystem: [],
  licenseLevelFilter: [],
  priceRange: [0, 200000], // Expanded price range
  hasSmartFeatures: null,
  fuelCapacityRange: [0, 100], // Expanded fuel capacity range
  topSpeedRange: [0, 500], // Expanded top speed range
  torqueRange: [0, 1000], // Expanded torque range
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
  console.log("Sample motorcycle with specs:", motorcycles.find(m => m.engine_size > 0));
  console.log("Starting filters:", startingFilters);

  const {
    filters,
    debouncedSearchTerm,
    isSearching,
    handlers
  } = useFilterState(startingFilters);

  console.log("Current filters in hook:", filters);

  const { isFiltering } = useFilteringState(filters);

  const filteredMotorcycles = useMotorcycleFiltering(
    motorcycles, 
    filters, 
    debouncedSearchTerm
  );

  console.log("=== FILTERING DEBUG END ===");
  console.log("Filtered motorcycles count:", filteredMotorcycles.length);
  console.log("Sample filtered motorcycle:", filteredMotorcycles[0]);

  return {
    filters,
    ...handlers,
    filteredMotorcycles,
    isFiltering,
    isSearching
  };
}
