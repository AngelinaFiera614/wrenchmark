
import { useState, useCallback, useMemo } from "react";
import { Motorcycle, MotorcycleFilters } from "@/types";

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

  const handleFilterChange = useCallback((newFilters: MotorcycleFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

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
    handleFilterChange,
    resetFilters,
    filteredMotorcycles
  };
}
