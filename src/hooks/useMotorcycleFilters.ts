
import { Motorcycle, MotorcycleFilters } from "@/types";
import { useFilterState } from "./filters/useFilterState";
import { useMotorcycleFiltering } from "./filters/useMotorcycleFiltering";
import { useFilteringState } from "./filters/useFilteringState";

export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1980, 2025],
  engineSizeRange: [0, 2000],
  difficultyLevel: 5, // Set to max level so it doesn't filter out anything
  weightRange: [0, 500], // Increased max weight range
  seatHeightRange: [600, 1000], // Increased seat height range
  abs: null, // Changed to null so it doesn't filter
  searchTerm: "",
  styleTags: [],
  useCases: [],
  skillLevel: [],
  transmission: [],
  driveType: [],
  powerToWeightRange: [0, 5.0], // Increased range
  isEntryLevel: null,
  coolingSystem: [],
  licenseLevelFilter: [],
  priceRange: [0, 100000], // Increased price range
  hasSmartFeatures: null,
  fuelCapacityRange: [0, 50], // Increased fuel capacity range
  topSpeedRange: [0, 400], // Increased top speed range
  torqueRange: [0, 500], // Increased torque range
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

  return {
    filters,
    ...handlers,
    filteredMotorcycles,
    isFiltering,
    isSearching
  };
}
