
import { useCallback, useMemo } from "react";
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

// Default filter values
export const initialFilters: MotorcycleFilters = {
  categories: [],
  make: "",
  yearRange: [1980, 2023],
  engineSizeRange: [0, 2000],
  difficultyLevel: 5,
  weightRange: [100, 400],
  seatHeightRange: [650, 950],
  styleTags: [],
  abs: null,
  searchTerm: ""
};

export function useMotorcycleFilters(motorcycles: Motorcycle[]) {
  // Use individual filter hooks
  const { categories, handleCategoryChange } = useCategoryFilter();
  const { make, handleMakeChange } = useMakeFilter();
  const { yearRange, handleYearRangeChange } = useYearFilter();
  const { engineSizeRange, handleEngineSizeRangeChange } = useEngineFilter();
  const { difficultyLevel, handleDifficultyChange } = useDifficultyFilter();
  const { weightRange, handleWeightRangeChange } = useWeightFilter();
  const { seatHeightRange, handleSeatHeightRangeChange } = useSeatHeightFilter();
  const { abs, handleAbsChange } = useAbsFilter();
  const { searchTerm, handleSearchChange } = useSearchFilter();

  // Combine all filter states
  const filters = useMemo<MotorcycleFilters>(() => ({
    categories,
    make,
    yearRange,
    engineSizeRange,
    difficultyLevel,
    weightRange,
    seatHeightRange,
    styleTags: [], // Not currently implemented in individual hooks
    abs,
    searchTerm
  }), [
    categories, make, yearRange, engineSizeRange, 
    difficultyLevel, weightRange, seatHeightRange, abs, searchTerm
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
    handleAbsChange(false);
    handleSearchChange("");
  }, [
    handleCategoryChange, handleMakeChange, handleYearRangeChange,
    handleEngineSizeRangeChange, handleDifficultyChange,
    handleWeightRangeChange, handleSeatHeightRangeChange,
    handleAbsChange, handleSearchChange
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
    handleAbsChange(newFilters.abs === true);
    handleSearchChange(newFilters.searchTerm);
  }, [
    handleCategoryChange, handleMakeChange, handleYearRangeChange,
    handleEngineSizeRangeChange, handleDifficultyChange,
    handleWeightRangeChange, handleSeatHeightRangeChange,
    handleAbsChange, handleSearchChange
  ]);

  // Apply filters to motorcycles list
  const filteredMotorcycles = useMemo(() => {
    return motorcycles.filter(motorcycle => {
      // Filter by categories if any are selected
      if (filters.categories.length > 0 && !filters.categories.includes(motorcycle.category)) {
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

      // Filter by engine size range
      if (motorcycle.engine_cc < filters.engineSizeRange[0] || motorcycle.engine_cc > filters.engineSizeRange[1]) {
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

      // Filter by ABS
      if (filters.abs !== null && motorcycle.abs !== filters.abs) {
        return false;
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
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
  }, [motorcycles, filters]);

  return {
    filters,
    handleCategoryChange,
    handleMakeChange,
    handleYearRangeChange,
    handleEngineSizeRangeChange,
    handleDifficultyChange, 
    handleWeightRangeChange,
    handleSeatHeightRangeChange,
    handleAbsChange,
    handleSearchChange,
    handleFilterChange,
    resetFilters,
    filteredMotorcycles
  };
}
