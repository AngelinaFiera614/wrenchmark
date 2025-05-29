
import { Motorcycle, MotorcycleFilters } from "@/types";
import { useFilterState } from "./filters/useFilterState";
import { useMotorcycleFiltering } from "./filters/useMotorcycleFiltering";
import { useFilteringState } from "./filters/useFilteringState";

export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1980, 2025],
  engineSizeRange: [0, 2000],
  difficultyLevel: 5,
  weightRange: [100, 400],
  seatHeightRange: [650, 950],
  abs: null,
  searchTerm: "",
  styleTags: []
};

export function useMotorcycleFilters(
  motorcycles: Motorcycle[], 
  startingFilters: MotorcycleFilters = initialFilters
) {
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
