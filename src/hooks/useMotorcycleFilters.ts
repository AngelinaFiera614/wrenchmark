
import { useCallback, useMemo, useState } from "react";
import { Motorcycle, MotorcycleFilters, MotorcycleCategory } from "@/types";
import { useEngineFilter } from "./useEngineFilter";
import { useDifficultyFilter } from "./useDifficultyFilter";
import { useWeightFilter } from "./useWeightFilter";
import { useSeatHeightFilter } from "./useSeatHeightFilter";
import { useYearFilter } from "./useYearFilter";
import { useMakeFilter } from "./useMakeFilter";
import { useAbsFilter } from "./useAbsFilter";
import { useSearchFilter } from "./useSearchFilter";
import { useCategoryFilter } from "./useCategoryFilter";
import { useStyleTagFilter } from "./useStyleTagFilter";
import { countActiveFilters } from "@/lib/filter-utils";

// Default filter values
export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1980, 2023],
  engineSizeRange: [0, 2000],
  difficultyLevel: 5,
  weightRange: [100, 400],
  seatHeightRange: [650, 950],
  abs: null,
  searchTerm: "",
  styleTags: []  // Add styleTags to initialFilters
};

export function useMotorcycleFilters(
  motorcycles: Motorcycle[], 
  startingFilters: MotorcycleFilters = initialFilters
) {
  // Use individual filter hooks with initial values from startingFilters
  const { categories, handleCategoryChange } = useCategoryFilter(startingFilters.categories);
  const { make, handleMakeChange } = useMakeFilter(startingFilters.make);
  const { yearRange, handleYearRangeChange } = useYearFilter(startingFilters.yearRange);
  const { engineSizeRange, handleEngineSizeRangeChange } = useEngineFilter(startingFilters.engineSizeRange);
  const { difficultyLevel, handleDifficultyChange } = useDifficultyFilter(startingFilters.difficultyLevel);
  const { weightRange, handleWeightRangeChange } = useWeightFilter(startingFilters.weightRange);
  const { seatHeightRange, handleSeatHeightRangeChange } = useSeatHeightFilter(startingFilters.seatHeightRange);
  const { styleTags, handleStyleTagsChange } = useStyleTagFilter(startingFilters.styleTags || []);
  const { abs, handleAbsChange } = useAbsFilter(startingFilters.abs);
  const { 
    searchTerm, 
    debouncedSearchTerm, 
    isSearching, 
    handleSearchChange 
  } = useSearchFilter(startingFilters.searchTerm);

  // Track if any filters are active
  const [isFiltering, setIsFiltering] = useState(countActiveFilters(startingFilters) > 0);

  // Combine all filter states
  const filters = useMemo<MotorcycleFilters>(() => {
    const currentFilters = {
      categories,
      make,
      yearRange,
      engineSizeRange,
      difficultyLevel,
      weightRange,
      seatHeightRange,
      styleTags,
      abs,
      searchTerm
    };
    
    // Update filtering state 
    setIsFiltering(countActiveFilters(currentFilters) > 0);
    
    return currentFilters;
  }, [
    categories, make, yearRange, engineSizeRange, 
    difficultyLevel, weightRange, seatHeightRange, 
    styleTags, abs, searchTerm
  ]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    handleCategoryChange([]);
    handleMakeChange("");
    handleYearRangeChange(initialFilters.yearRange);
    handleEngineSizeRangeChange(initialFilters.engineSizeRange);
    handleDifficultyChange([initialFilters.difficultyLevel]);
    handleWeightRangeChange(initialFilters.weightRange);
    handleSeatHeightRangeChange(initialFilters.seatHeightRange);
    handleStyleTagsChange([]);
    handleAbsChange(false);
    handleSearchChange("");
  }, [
    handleCategoryChange, handleMakeChange, handleYearRangeChange,
    handleEngineSizeRangeChange, handleDifficultyChange,
    handleWeightRangeChange, handleSeatHeightRangeChange,
    handleStyleTagsChange, handleAbsChange, handleSearchChange
  ]);

  // General filter change handler (for batch updates)
  const handleFilterChange = useCallback((newFilters: MotorcycleFilters) => {
    handleCategoryChange(newFilters.categories);
    handleMakeChange(newFilters.make);
    handleYearRangeChange(newFilters.yearRange);
    handleEngineSizeRangeChange(newFilters.engineSizeRange);
    handleDifficultyChange([newFilters.difficultyLevel]);
    handleWeightRangeChange(newFilters.weightRange);
    handleSeatHeightRangeChange(newFilters.seatHeightRange);
    handleStyleTagsChange(newFilters.styleTags || []);
    handleAbsChange(newFilters.abs === true);
    handleSearchChange(newFilters.searchTerm);
  }, [
    handleCategoryChange, handleMakeChange, handleYearRangeChange,
    handleEngineSizeRangeChange, handleDifficultyChange,
    handleWeightRangeChange, handleSeatHeightRangeChange,
    handleStyleTagsChange, handleAbsChange, handleSearchChange
  ]);

  // Apply filters to motorcycles list - using debounced search term
  const filteredMotorcycles = useMemo(() => {
    return motorcycles.filter(motorcycle => {
      // Filter by categories if any are selected
      if (filters.categories.length > 0 && !filters.categories.includes(motorcycle.category as MotorcycleCategory)) {
        return false;
      }

      // Filter by make
      if (filters.make && !motorcycle.make.toLowerCase().includes(filters.make.toLowerCase())) {
        return false;
      }

      // Filter by year range
      if (motorcycle.year < filters.yearRange[0] || motorcycle.year > filters.yearRange[1]) {
        return false;
      }

      // Filter by engine size range - using either engine_cc or engine_size
      const engineSize = motorcycle.engine_cc || motorcycle.engine_size;
      if (engineSize < filters.engineSizeRange[0] || engineSize > filters.engineSizeRange[1]) {
        return false;
      }

      // Filter by difficulty level
      if (motorcycle.difficulty_level > filters.difficultyLevel) {
        return false;
      }

      // Filter by weight range
      if (motorcycle.weight_kg < filters.weightRange[0] || motorcycle.weight_kg > filters.weightRange[1]) {
        return false;
      }

      // Filter by seat height range
      if (motorcycle.seat_height_mm < filters.seatHeightRange[0] || motorcycle.seat_height_mm > filters.seatHeightRange[1]) {
        return false;
      }

      // Filter by style tags if any are selected
      if (filters.styleTags && filters.styleTags.length > 0 && 
          !filters.styleTags.some(tag => motorcycle.style_tags.includes(tag))) {
        return false;
      }

      // Filter by ABS
      if (filters.abs !== null && motorcycle.abs !== filters.abs) {
        return false;
      }

      // Filter by search term - using debounced value
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch = 
          motorcycle.make.toLowerCase().includes(searchLower) ||
          motorcycle.model.toLowerCase().includes(searchLower) ||
          motorcycle.summary.toLowerCase().includes(searchLower) ||
          motorcycle.category.toLowerCase().includes(searchLower) ||
          motorcycle.style_tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) {
          return false;
        }
      }

      // If it passes all filters, include it
      return true;
    });
  }, [motorcycles, filters, debouncedSearchTerm]);

  return {
    filters,
    handleCategoryChange,
    handleMakeChange,
    handleYearRangeChange,
    handleEngineSizeRangeChange,
    handleDifficultyChange, 
    handleWeightRangeChange,
    handleSeatHeightRangeChange,
    handleStyleTagsChange,
    handleAbsChange,
    handleSearchChange,
    handleFilterChange,
    resetFilters,
    filteredMotorcycles,
    isFiltering,
    isSearching
  };
}
