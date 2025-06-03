
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

      // Year range filter
      const year = motorcycle.year || 0;
      if (year > 0 && (year < filters.yearRange[0] || year > filters.yearRange[1])) {
        return false;
      }

      // Engine size filter (handle NULL values gracefully)
      const engineSize = motorcycle.engine_size || 0;
      if (engineSize > 0 && (engineSize < filters.engineSizeRange[0] || engineSize > filters.engineSizeRange[1])) {
        return false;
      }

      // Weight filter (handle NULL values gracefully)
      const weight = motorcycle.weight_kg || 0;
      if (weight > 0 && (weight < filters.weightRange[0] || weight > filters.weightRange[1])) {
        return false;
      }

      // Seat height filter (handle NULL values gracefully)
      const seatHeight = motorcycle.seat_height_mm || 0;
      if (seatHeight > 0 && (seatHeight < filters.seatHeightRange[0] || seatHeight > filters.seatHeightRange[1])) {
        return false;
      }

      // ABS filter
      if (filters.abs !== null) {
        if (motorcycle.abs !== filters.abs && motorcycle.has_abs !== filters.abs) {
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
    return filtered;
  }, [motorcycles, filters, searchTerm]);
}
