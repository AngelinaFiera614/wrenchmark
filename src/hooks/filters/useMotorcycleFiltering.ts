
import { useMemo } from "react";
import { Motorcycle, MotorcycleFilters, MotorcycleCategory } from "@/types";

export function useMotorcycleFiltering(
  motorcycles: Motorcycle[], 
  filters: MotorcycleFilters, 
  debouncedSearchTerm: string
) {
  return useMemo(() => {
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

      // Engine size filtering logic
      const engineSize = motorcycle.engine_size || motorcycle.engine_cc || 0;
      const hasEngineData = engineSize > 0;
      const isEngineFilterActive = filters.engineSizeRange[0] > 0 || filters.engineSizeRange[1] < 2000;
      
      if (isEngineFilterActive) {
        if (hasEngineData) {
          if (engineSize < filters.engineSizeRange[0] || engineSize > filters.engineSizeRange[1]) {
            console.log(`❌ Engine size filter failed: ${engineSize} not in range [${filters.engineSizeRange[0]}, ${filters.engineSizeRange[1]}]`);
            return false;
          }
        } else {
          console.log(`❌ Engine filter active but motorcycle has no engine data`);
          return false;
        }
      }

      if (motorcycle.difficulty_level > filters.difficultyLevel) {
        console.log(`❌ Difficulty filter failed: ${motorcycle.difficulty_level} > ${filters.difficultyLevel}`);
        return false;
      }

      // Weight filtering
      if (motorcycle.weight_kg && motorcycle.weight_kg > 0) {
        if (motorcycle.weight_kg < filters.weightRange[0] || motorcycle.weight_kg > filters.weightRange[1]) {
          console.log(`❌ Weight filter failed: ${motorcycle.weight_kg} not in range [${filters.weightRange[0]}, ${filters.weightRange[1]}]`);
          return false;
        }
      }

      // Seat height filtering
      if (motorcycle.seat_height_mm && motorcycle.seat_height_mm > 0) {
        if (motorcycle.seat_height_mm < filters.seatHeightRange[0] || motorcycle.seat_height_mm > filters.seatHeightRange[1]) {
          console.log(`❌ Seat height filter failed: ${motorcycle.seat_height_mm} not in range [${filters.seatHeightRange[0]}, ${filters.seatHeightRange[1]}]`);
          return false;
        }
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
}
