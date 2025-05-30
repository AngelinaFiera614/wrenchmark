
import { useMemo, useCallback } from "react";
import { MotorcycleFilters } from "@/types";
import { useEngineFilter } from "../useEngineFilter";
import { useDifficultyFilter } from "../useDifficultyFilter";
import { useWeightFilter } from "../useWeightFilter";
import { useSeatHeightFilter } from "../useSeatHeightFilter";
import { useYearFilter } from "../useYearFilter";
import { useMakeFilter } from "../useMakeFilter";
import { useAbsFilter } from "../useAbsFilter";
import { useSearchFilter } from "../useSearchFilter";
import { useCategoryFilter } from "../useCategoryFilter";
import { useStyleTagFilter } from "../useStyleTagFilter";

export function useFilterState(startingFilters: MotorcycleFilters) {
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

  const currentFilters = useMemo<MotorcycleFilters>(() => ({
    categories,
    make,
    yearRange,
    engineSizeRange,
    difficultyLevel,
    weightRange,
    seatHeightRange,
    styleTags,
    abs,
    searchTerm,
    // Include all the missing properties from the full MotorcycleFilters interface
    useCases: startingFilters.useCases || [],
    skillLevel: startingFilters.skillLevel || [],
    transmission: startingFilters.transmission || [],
    driveType: startingFilters.driveType || [],
    powerToWeightRange: startingFilters.powerToWeightRange || [0, 2.0],
    isEntryLevel: startingFilters.isEntryLevel || null,
    coolingSystem: startingFilters.coolingSystem || [],
    licenseLevelFilter: startingFilters.licenseLevelFilter || [],
    priceRange: startingFilters.priceRange || [0, 50000],
    hasSmartFeatures: startingFilters.hasSmartFeatures || null,
    fuelCapacityRange: startingFilters.fuelCapacityRange || [0, 30],
    topSpeedRange: startingFilters.topSpeedRange || [0, 350],
    torqueRange: startingFilters.torqueRange || [0, 200],
    advancedSearch: startingFilters.advancedSearch || {
      engineType: [],
      cylinderCount: [],
      brakeType: [],
      frameType: [],
      suspensionType: []
    }
  }), [
    categories, make, yearRange, engineSizeRange, 
    difficultyLevel, weightRange, seatHeightRange, 
    styleTags, abs, searchTerm, startingFilters
  ]);

  const resetFilters = useCallback(() => {
    handleCategoryChange([]);
    handleMakeChange("");
    handleYearRangeChange([1980, 2025]);
    handleEngineSizeRangeChange([0, 2000]);
    handleDifficultyChange([5]);
    handleWeightRangeChange([100, 400]);
    handleSeatHeightRangeChange([650, 950]);
    handleStyleTagsChange([]);
    handleAbsChange(false);
    handleSearchChange("");
  }, [
    handleCategoryChange, handleMakeChange, handleYearRangeChange,
    handleEngineSizeRangeChange, handleDifficultyChange,
    handleWeightRangeChange, handleSeatHeightRangeChange,
    handleStyleTagsChange, handleAbsChange, handleSearchChange
  ]);

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

  return {
    filters: currentFilters,
    debouncedSearchTerm,
    isSearching,
    handlers: {
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
      resetFilters
    }
  };
}
