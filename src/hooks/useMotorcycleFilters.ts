
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

  const [isFiltering, setIsFiltering] = useState(countActiveFilters(startingFilters) > 0);

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
    
    setIsFiltering(countActiveFilters(currentFilters) > 0);
    return currentFilters;
  }, [
    categories, make, yearRange, engineSizeRange, 
    difficultyLevel, weightRange, seatHeightRange, 
    styleTags, abs, searchTerm
  ]);

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

  const filteredMotorcycles = useMemo(() => {
    console.log("=== FILTERING DEBUG START ===");
    console.log("Total motorcycles to filter:", motorcycles.length);
    console.log("Current filters:", filters);
    
    return motorcycles.filter(motorcycle => {
      console.log(`\nChecking motorcycle: ${motorcycle.make} ${motorcycle.model}`);
      console.log("Motorcycle data:", {
        category: motorcycle.category,
        make: motorcycle.make,
        year: motorcycle.year,
        engine_size: motorcycle.engine_size,
        engine_cc: motorcycle.engine_cc,
        difficulty_level: motorcycle.difficulty_level,
        weight_kg: motorcycle.weight_kg,
        seat_height_mm: motorcycle.seat_height_mm,
        abs: motorcycle.abs
      });

      if (filters.categories.length > 0 && !filters.categories.includes(motorcycle.category as MotorcycleCategory)) {
        console.log(`❌ Category filter failed: ${motorcycle.category} not in [${filters.categories.join(', ')}]`);
        return false;
      }

      if (filters.make && !motorcycle.make.toLowerCase().includes(filters.make.toLowerCase())) {
        console.log(`❌ Make filter failed: ${motorcycle.make} doesn't include "${filters.make}"`);
        return false;
      }

      if (motorcycle.year < filters.yearRange[0] || motorcycle.year > filters.yearRange[1]) {
        console.log(`❌ Year filter failed: ${motorcycle.year} not in range [${filters.yearRange[0]}, ${filters.yearRange[1]}]`);
        return false;
      }

      const engineSize = motorcycle.engine_size || motorcycle.engine_cc || 0;
      console.log(`Engine size check: ${engineSize} vs range [${filters.engineSizeRange[0]}, ${filters.engineSizeRange[1]}]`);
      if (engineSize < filters.engineSizeRange[0] || engineSize > filters.engineSizeRange[1]) {
        console.log(`❌ Engine size filter failed: ${engineSize} not in range [${filters.engineSizeRange[0]}, ${filters.engineSizeRange[1]}]`);
        return false;
      }

      if (motorcycle.difficulty_level > filters.difficultyLevel) {
        console.log(`❌ Difficulty filter failed: ${motorcycle.difficulty_level} > ${filters.difficultyLevel}`);
        return false;
      }

      if (motorcycle.weight_kg && (motorcycle.weight_kg < filters.weightRange[0] || motorcycle.weight_kg > filters.weightRange[1])) {
        console.log(`❌ Weight filter failed: ${motorcycle.weight_kg} not in range [${filters.weightRange[0]}, ${filters.weightRange[1]}]`);
        return false;
      }

      if (motorcycle.seat_height_mm && (motorcycle.seat_height_mm < filters.seatHeightRange[0] || motorcycle.seat_height_mm > filters.seatHeightRange[1])) {
        console.log(`❌ Seat height filter failed: ${motorcycle.seat_height_mm} not in range [${filters.seatHeightRange[0]}, ${filters.seatHeightRange[1]}]`);
        return false;
      }

      if (filters.styleTags && filters.styleTags.length > 0 && 
          !filters.styleTags.some(tag => motorcycle.style_tags.includes(tag))) {
        console.log(`❌ Style tags filter failed: ${JSON.stringify(motorcycle.style_tags)} doesn't include any of ${JSON.stringify(filters.styleTags)}`);
        return false;
      }

      if (filters.abs !== null && motorcycle.abs !== filters.abs) {
        console.log(`❌ ABS filter failed: ${motorcycle.abs} !== ${filters.abs}`);
        return false;
      }

      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch = 
          motorcycle.make.toLowerCase().includes(searchLower) ||
          motorcycle.model.toLowerCase().includes(searchLower) ||
          motorcycle.summary.toLowerCase().includes(searchLower) ||
          motorcycle.category.toLowerCase().includes(searchLower) ||
          motorcycle.style_tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) {
          console.log(`❌ Search filter failed: "${debouncedSearchTerm}" not found in motorcycle data`);
          return false;
        }
      }

      console.log("✅ Motorcycle passed all filters");
      return true;
    });
  }, [motorcycles, filters, debouncedSearchTerm]);

  console.log("=== FILTERING DEBUG END ===");
  console.log("Filtered motorcycles count:", filteredMotorcycles.length);

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
