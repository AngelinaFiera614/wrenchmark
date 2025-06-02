
import { Motorcycle, MotorcycleFilters } from "@/types";
import { useFilterState } from "./filters/useFilterState";
import { useMotorcycleFiltering } from "./filters/useMotorcycleFiltering";
import { useFilteringState } from "./filters/useFilteringState";

// Updated filters to be more inclusive of the populated data
export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1950, 2025],
  engineSizeRange: [0, 1500], // Realistic max for motorcycles
  difficultyLevel: 5,
  weightRange: [0, 400], // Realistic motorcycle weight range
  seatHeightRange: [600, 1000], // Realistic seat height range
  abs: null,
  searchTerm: "",
  styleTags: [],
  useCases: [],
  skillLevel: [],
  transmission: [],
  driveType: [],
  powerToWeightRange: [0, 2.0], // More realistic power-to-weight ratios
  isEntryLevel: null,
  coolingSystem: [],
  licenseLevelFilter: [],
  priceRange: [0, 50000], // More realistic price range
  hasSmartFeatures: null,
  fuelCapacityRange: [0, 30], // Realistic fuel tank sizes
  topSpeedRange: [0, 350], // Realistic top speed range
  torqueRange: [0, 200], // Realistic torque range
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
  
  // Log sample of motorcycles with specifications
  const sampleWithSpecs = motorcycles.filter(m => m.engine_size > 0 && m.horsepower > 0 && m.weight_kg > 0);
  console.log("Motorcycles with complete specs:", sampleWithSpecs.length);
  console.log("Sample motorcycle with specs:", sampleWithSpecs[0]);
  
  // Log engine size distribution
  const engineSizes = motorcycles.map(m => m.engine_size).filter(size => size > 0);
  console.log("Engine size range:", {
    min: Math.min(...engineSizes),
    max: Math.max(...engineSizes),
    count: engineSizes.length
  });
  
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
