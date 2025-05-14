
import { useState, useCallback, useMemo } from "react";
import { Motorcycle, MotorcycleFilters, MotorcycleCategory } from "@/types";

const initialFilters: MotorcycleFilters = {
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
  const [filters, setFilters] = useState<MotorcycleFilters>(initialFilters);

  // Handler for category changes
  const handleCategoryChange = useCallback((category: MotorcycleCategory, checked: boolean) => {
    setFilters(prevFilters => {
      const updatedCategories = checked 
        ? [...prevFilters.categories, category]
        : prevFilters.categories.filter(c => c !== category);
      
      return {
        ...prevFilters,
        categories: updatedCategories
      };
    });
  }, []);

  // Handler for make changes (both text input and quick selection)
  const handleMakeChange = useCallback((make: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      make
    }));
  }, []);

  // Handler for year range slider
  const handleYearRangeChange = useCallback((values: number[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      yearRange: [values[0], values[1]] as [number, number]
    }));
  }, []);

  // Handler for engine size range slider
  const handleEngineSizeRangeChange = useCallback((values: number[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      engineSizeRange: [values[0], values[1]] as [number, number]
    }));
  }, []);

  // Handler for difficulty slider
  const handleDifficultyChange = useCallback((values: number[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      difficultyLevel: values[0]
    }));
  }, []);

  // Handler for weight range slider
  const handleWeightRangeChange = useCallback((values: number[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      weightRange: [values[0], values[1]] as [number, number]
    }));
  }, []);

  // Handler for seat height range slider
  const handleSeatHeightRangeChange = useCallback((values: number[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      seatHeightRange: [values[0], values[1]] as [number, number]
    }));
  }, []);

  // Handler for ABS filter toggle
  const handleAbsChange = useCallback((checked: boolean) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      abs: checked ? true : null
    }));
  }, []);

  // Handler for search term
  const handleSearchChange = useCallback((searchTerm: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      searchTerm
    }));
  }, []);

  // General filter change handler (for batch updates)
  const handleFilterChange = useCallback((newFilters: MotorcycleFilters) => {
    setFilters(newFilters);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

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
