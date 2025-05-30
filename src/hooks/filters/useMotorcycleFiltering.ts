
import { useMemo } from "react";
import { Motorcycle, MotorcycleFilters } from "@/types";

export function useMotorcycleFiltering(
  motorcycles: Motorcycle[],
  filters: MotorcycleFilters,
  debouncedSearchTerm: string
) {
  return useMemo(() => {
    console.log("=== FILTERING DEBUG START ===");
    console.log("Input motorcycles:", motorcycles.length);
    console.log("Sample input motorcycle:", motorcycles[0]);
    console.log("Active filters:", filters);
    console.log("Search term:", debouncedSearchTerm);

    let filtered = motorcycles;

    // Search term filtering (enhanced for technical specs)
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      console.log("Applying search filter for:", debouncedSearchTerm);
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(motorcycle => {
        const searchableText = [
          motorcycle.make,
          motorcycle.model,
          motorcycle.category,
          motorcycle.transmission,
          motorcycle.drive_type,
          motorcycle.cooling_system,
          motorcycle.engine_type,
          motorcycle.summary,
          ...(motorcycle.use_cases || []),
          ...(motorcycle.style_tags || []),
          ...(motorcycle.smart_features || [])
        ].filter(Boolean).join(" ").toLowerCase();
        
        const matches = searchableText.includes(searchLower);
        console.log(`Search check for ${motorcycle.make} ${motorcycle.model}:`, matches);
        return matches;
      });
      console.log("After search filter:", filtered.length);
    }

    // Category filtering - only apply if categories are selected
    if (filters.categories && filters.categories.length > 0) {
      console.log("Applying category filter:", filters.categories);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        // Include motorcycles with missing category data
        if (!motorcycle.category) return true;
        const matches = filters.categories.includes(motorcycle.category as any);
        console.log(`Category check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.category}):`, matches);
        return matches;
      });
      console.log(`After category filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Make filtering - only apply if make is specified
    if (filters.make && filters.make.trim() !== '') {
      console.log("Applying make filter:", filters.make);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.make.toLowerCase().includes(filters.make.toLowerCase());
        console.log(`Make check for ${motorcycle.make} ${motorcycle.model}:`, matches);
        return matches;
      });
      console.log(`After make filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Year range filtering - be permissive with missing year data
    if (filters.yearRange && filters.yearRange.length === 2) {
      const [minYear, maxYear] = filters.yearRange;
      // Only apply if not at the default range
      if (minYear > 1980 || maxYear < 2025) {
        console.log("Applying year range filter:", filters.yearRange);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          // Include motorcycles with missing year data
          if (!motorcycle.year || motorcycle.year === 0) return true;
          const matches = motorcycle.year >= minYear && motorcycle.year <= maxYear;
          console.log(`Year check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.year}):`, matches);
          return matches;
        });
        console.log(`After year filter: ${beforeCount} -> ${filtered.length}`);
      }
    }

    // Engine size filtering - be permissive with missing data
    if (filters.engineSizeRange && filters.engineSizeRange.length === 2) {
      const [minSize, maxSize] = filters.engineSizeRange;
      // Only apply if not at the default range
      if (minSize > 0 || maxSize < 2000) {
        console.log("Applying engine size filter:", filters.engineSizeRange);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          const engineSize = motorcycle.engine_size || 0;
          // Include motorcycles with missing engine data
          if (engineSize === 0 || engineSize === null || engineSize === undefined) return true;
          const matches = engineSize >= minSize && engineSize <= maxSize;
          console.log(`Engine size check for ${motorcycle.make} ${motorcycle.model} (${engineSize}cc):`, matches);
          return matches;
        });
        console.log(`After engine size filter: ${beforeCount} -> ${filtered.length}`);
      }
    }

    // Difficulty level filtering - only apply if not at maximum
    if (filters.difficultyLevel && filters.difficultyLevel < 5) {
      console.log("Applying difficulty filter:", filters.difficultyLevel);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const difficultyLevel = motorcycle.difficulty_level || 3;
        // Include motorcycles with missing difficulty data
        if (!motorcycle.difficulty_level) return true;
        const matches = difficultyLevel <= filters.difficultyLevel;
        console.log(`Difficulty check for ${motorcycle.make} ${motorcycle.model} (${difficultyLevel}):`, matches);
        return matches;
      });
      console.log(`After difficulty filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Weight filtering - be permissive with missing data
    if (filters.weightRange && filters.weightRange.length === 2) {
      const [minWeight, maxWeight] = filters.weightRange;
      // Only apply if not at the default range
      if (minWeight > 0 || maxWeight < 500) {
        console.log("Applying weight filter:", filters.weightRange);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          const weight = motorcycle.weight_kg || 0;
          // Include motorcycles with missing weight data
          if (weight === 0 || weight === null || weight === undefined) return true;
          const matches = weight >= minWeight && weight <= maxWeight;
          console.log(`Weight check for ${motorcycle.make} ${motorcycle.model} (${weight}kg):`, matches);
          return matches;
        });
        console.log(`After weight filter: ${beforeCount} -> ${filtered.length}`);
      }
    }

    // Seat height filtering - be permissive with missing data
    if (filters.seatHeightRange && filters.seatHeightRange.length === 2) {
      const [minHeight, maxHeight] = filters.seatHeightRange;
      // Only apply if not at the default range
      if (minHeight > 600 || maxHeight < 1000) {
        console.log("Applying seat height filter:", filters.seatHeightRange);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          const seatHeight = motorcycle.seat_height_mm || 0;
          // Include motorcycles with missing seat height data
          if (seatHeight === 0 || seatHeight === null || seatHeight === undefined) return true;
          const matches = seatHeight >= minHeight && seatHeight <= maxHeight;
          console.log(`Seat height check for ${motorcycle.make} ${motorcycle.model} (${seatHeight}mm):`, matches);
          return matches;
        });
        console.log(`After seat height filter: ${beforeCount} -> ${filtered.length}`);
      }
    }

    // ABS filtering - only apply if explicitly set
    if (filters.abs !== null && filters.abs !== undefined) {
      console.log("Applying ABS filter:", filters.abs);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const hasAbs = motorcycle.abs || motorcycle.has_abs || false;
        const matches = hasAbs === filters.abs;
        console.log(`ABS check for ${motorcycle.make} ${motorcycle.model} (${hasAbs}):`, matches);
        return matches;
      });
      console.log(`After ABS filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Transmission filtering - only apply if specified
    if (filters.transmission && filters.transmission.length > 0) {
      console.log("Applying transmission filter:", filters.transmission);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        // Include motorcycles with missing transmission data
        if (!motorcycle.transmission) return true;
        const matches = filters.transmission!.some(trans => 
          motorcycle.transmission!.toLowerCase().includes(trans.toLowerCase())
        );
        console.log(`Transmission check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.transmission}):`, matches);
        return matches;
      });
      console.log(`After transmission filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Drive type filtering - only apply if specified
    if (filters.driveType && filters.driveType.length > 0) {
      console.log("Applying drive type filter:", filters.driveType);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        // Include motorcycles with missing drive type data
        if (!motorcycle.drive_type) return true;
        const matches = filters.driveType!.includes(motorcycle.drive_type);
        console.log(`Drive type check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.drive_type}):`, matches);
        return matches;
      });
      console.log(`After drive type filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Cooling system filtering
    if (filters.coolingSystem && filters.coolingSystem.length > 0) {
      console.log("Applying cooling system filter:", filters.coolingSystem);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        // Include motorcycles with missing cooling system data
        if (!motorcycle.cooling_system) return true;
        const matches = filters.coolingSystem!.includes(motorcycle.cooling_system);
        console.log(`Cooling system check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.cooling_system}):`, matches);
        return matches;
      });
      console.log(`After cooling system filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Power-to-weight ratio filtering - FIXED: Only apply if values exist and filter is restrictive
    if (filters.powerToWeightRange && filters.powerToWeightRange.length === 2) {
      const [minRatio, maxRatio] = filters.powerToWeightRange;
      // Only apply if not at the default range AND we want to exclude null values
      if (minRatio > 0 || maxRatio < 5.0) {
        console.log("Applying power-to-weight ratio filter:", filters.powerToWeightRange);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          // Include motorcycles with missing power-to-weight ratio data when filter is permissive
          if (motorcycle.power_to_weight_ratio === null || motorcycle.power_to_weight_ratio === undefined) {
            return true; // Always include motorcycles with missing data
          }
          const matches = motorcycle.power_to_weight_ratio >= minRatio && 
                         motorcycle.power_to_weight_ratio <= maxRatio;
          console.log(`Power-to-weight ratio check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.power_to_weight_ratio}):`, matches);
          return matches;
        });
        console.log(`After power-to-weight ratio filter: ${beforeCount} -> ${filtered.length}`);
      }
    }

    // Entry level filtering
    if (filters.isEntryLevel !== null) {
      console.log("Applying entry level filter:", filters.isEntryLevel);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => 
        motorcycle.is_entry_level === filters.isEntryLevel
      );
      console.log(`After entry level filter: ${beforeCount} -> ${filtered.length}`);
    }

    // License level filtering
    if (filters.licenseLevelFilter && filters.licenseLevelFilter.length > 0) {
      console.log("Applying license level filter:", filters.licenseLevelFilter);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        // Include motorcycles with missing license level data
        if (!motorcycle.recommended_license_level) return true;
        const matches = filters.licenseLevelFilter!.includes(motorcycle.recommended_license_level);
        console.log(`License level check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.recommended_license_level}):`, matches);
        return matches;
      });
      console.log(`After license level filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Use cases filtering
    if (filters.useCases && filters.useCases.length > 0) {
      console.log("Applying use cases filter:", filters.useCases);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        // Include motorcycles with missing use cases data
        if (!motorcycle.use_cases || motorcycle.use_cases.length === 0) return true;
        const matches = filters.useCases!.some(useCase => 
          motorcycle.use_cases!.includes(useCase)
        );
        console.log(`Use cases check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.use_cases}):`, matches);
        return matches;
      });
      console.log(`After use cases filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Skip advanced filters if they're all empty or have missing data
    if (filters.advancedSearch) {
      const { engineType, cylinderCount, brakeType } = filters.advancedSearch;
      
      if (engineType && engineType.length > 0) {
        console.log("Applying engine type filter:", engineType);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          // Include motorcycles with missing engine type data
          if (!motorcycle.engine_type) return true;
          const matches = engineType.some(type => 
            motorcycle.engine_type!.toLowerCase().includes(type.toLowerCase())
          );
          console.log(`Engine type check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.engine_type}):`, matches);
          return matches;
        });
        console.log(`After engine type filter: ${beforeCount} -> ${filtered.length}`);
      }

      if (cylinderCount && cylinderCount.length > 0) {
        console.log("Applying cylinder count filter:", cylinderCount);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          // Include motorcycles with missing cylinder count data
          if (!motorcycle.cylinder_count) return true;
          const matches = cylinderCount.includes(motorcycle.cylinder_count);
          console.log(`Cylinder count check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.cylinder_count}):`, matches);
          return matches;
        });
        console.log(`After cylinder count filter: ${beforeCount} -> ${filtered.length}`);
      }

      if (brakeType && brakeType.length > 0) {
        console.log("Applying brake type filter:", brakeType);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          // Include motorcycles with missing brake type data
          if (!motorcycle.brake_type) return true;
          const matches = brakeType.some(type => 
            motorcycle.brake_type!.toLowerCase().includes(type.toLowerCase())
          );
          console.log(`Brake type check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.brake_type}):`, matches);
          return matches;
        });
        console.log(`After brake type filter: ${beforeCount} -> ${filtered.length}`);
      }
    }

    console.log("Motorcycle filtering results:", {
      original: motorcycles.length,
      filtered: filtered.length,
      activeFilters: Object.entries(filters).filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value !== '';
        if (typeof value === 'boolean') return value;
        if (value === null) return false;
        if (key === 'difficultyLevel') return value < 5;
        if (key === 'yearRange') return value[0] > 1980 || value[1] < 2025;
        if (key === 'engineSizeRange') return value[0] > 0 || value[1] < 2000;
        if (key === 'weightRange') return value[0] > 0 || value[1] < 500;
        if (key === 'seatHeightRange') return value[0] > 600 || value[1] < 1000;
        if (key === 'powerToWeightRange') return value[0] > 0 || value[1] < 5.0;
        return false;
      }).length
    });

    console.log("=== FILTERING DEBUG END ===");
    return filtered;
  }, [motorcycles, filters, debouncedSearchTerm]);
}
