
import { useMemo } from "react";
import { Motorcycle, MotorcycleFilters } from "@/types";

export function useMotorcycleFiltering(
  motorcycles: Motorcycle[],
  filters: MotorcycleFilters,
  searchTerm: string
) {
  return useMemo(() => {
    console.log("=== FILTERING MOTORCYCLES ===");
    console.log("Input count:", motorcycles.length);
    console.log("Filters:", filters);
    console.log("Search term:", searchTerm);
    
    let filtered = motorcycles.filter((motorcycle) => {
      // Search term filter (more inclusive)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const searchableText = [
          motorcycle.make,
          motorcycle.model,
          motorcycle.category,
          motorcycle.engine_type,
          ...(motorcycle.style_tags || []),
          ...(motorcycle.use_cases || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(term)) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(motorcycle.category as any)) {
          return false;
        }
      }

      // Make filter
      if (filters.make.trim()) {
        if (!motorcycle.make.toLowerCase().includes(filters.make.toLowerCase())) {
          return false;
        }
      }

      // Year range filter - be more inclusive with production years
      const year = motorcycle.year || 0;
      if (year > 0) {
        if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
          return false;
        }
      }

      // Engine size filter - only apply if motorcycle has engine data
      const engineSize = motorcycle.engine_size || 0;
      if (engineSize > 0) {
        if (engineSize < filters.engineSizeRange[0] || engineSize > filters.engineSizeRange[1]) {
          return false;
        }
      }

      // Weight filter - only apply if motorcycle has weight data
      const weight = motorcycle.weight_kg || 0;
      if (weight > 0) {
        if (weight < filters.weightRange[0] || weight > filters.weightRange[1]) {
          return false;
        }
      }

      // Seat height filter - only apply if motorcycle has seat height data
      const seatHeight = motorcycle.seat_height_mm || 0;
      if (seatHeight > 0) {
        if (seatHeight < filters.seatHeightRange[0] || seatHeight > filters.seatHeightRange[1]) {
          return false;
        }
      }

      // ABS filter - only filter if explicitly set and motorcycle has brake data
      if (filters.abs !== null) {
        const hasAbs = motorcycle.abs || motorcycle.has_abs || false;
        if (hasAbs !== filters.abs) {
          return false;
        }
      }

      // Difficulty level filter
      const difficulty = motorcycle.difficulty_level || 3;
      if (difficulty > filters.difficultyLevel) {
        return false;
      }

      return true;
    });

    console.log("Filtered count:", filtered.length);
    
    // Log some debug info about what's being filtered out
    if (filtered.length === 0 && motorcycles.length > 0) {
      console.log("=== FILTERING DEBUG ===");
      console.log("Sample motorcycle data:", motorcycles[0]);
      console.log("Applied filters:", {
        yearRange: filters.yearRange,
        engineSizeRange: filters.engineSizeRange,
        weightRange: filters.weightRange,
        seatHeightRange: filters.seatHeightRange,
      });
    }
    
    return filtered;
  }, [motorcycles, filters, searchTerm]);
}
