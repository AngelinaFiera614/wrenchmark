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
    if (debouncedSearchTerm) {
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
        ].join(" ").toLowerCase();
        
        const matches = searchableText.includes(searchLower);
        console.log(`Search check for ${motorcycle.make} ${motorcycle.model}:`, matches);
        return matches;
      });
      console.log("After search filter:", filtered.length);
    }

    // Category filtering
    if (filters.categories && filters.categories.length > 0) {
      console.log("Applying category filter:", filters.categories);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = filters.categories.includes(motorcycle.category as any);
        console.log(`Category check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.category}):`, matches);
        return matches;
      });
      console.log(`After category filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Make filtering
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

    // Year range filtering
    if (filters.yearRange && filters.yearRange.length === 2) {
      console.log("Applying year range filter:", filters.yearRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.year >= filters.yearRange[0] && 
                       motorcycle.year <= filters.yearRange[1];
        console.log(`Year check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.year}):`, matches);
        return matches;
      });
      console.log(`After year filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Engine size filtering
    if (filters.engineSizeRange && filters.engineSizeRange.length === 2) {
      console.log("Applying engine size filter:", filters.engineSizeRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const engineSize = motorcycle.engine_size || 0;
        const matches = engineSize >= filters.engineSizeRange[0] && 
                       engineSize <= filters.engineSizeRange[1];
        console.log(`Engine size check for ${motorcycle.make} ${motorcycle.model} (${engineSize}cc):`, matches);
        return matches;
      });
      console.log(`After engine size filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Difficulty level filtering
    if (filters.difficultyLevel && filters.difficultyLevel < 5) {
      console.log("Applying difficulty filter:", filters.difficultyLevel);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const difficultyLevel = motorcycle.difficulty_level || 3;
        const matches = difficultyLevel <= filters.difficultyLevel;
        console.log(`Difficulty check for ${motorcycle.make} ${motorcycle.model} (${difficultyLevel}):`, matches);
        return matches;
      });
      console.log(`After difficulty filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Weight filtering
    if (filters.weightRange && filters.weightRange.length === 2) {
      console.log("Applying weight filter:", filters.weightRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const weight = motorcycle.weight_kg || 0;
        const matches = weight >= filters.weightRange[0] && 
                       weight <= filters.weightRange[1];
        console.log(`Weight check for ${motorcycle.make} ${motorcycle.model} (${weight}kg):`, matches);
        return matches;
      });
      console.log(`After weight filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Seat height filtering
    if (filters.seatHeightRange && filters.seatHeightRange.length === 2) {
      console.log("Applying seat height filter:", filters.seatHeightRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const seatHeight = motorcycle.seat_height_mm || 0;
        const matches = seatHeight >= filters.seatHeightRange[0] && 
                       seatHeight <= filters.seatHeightRange[1];
        console.log(`Seat height check for ${motorcycle.make} ${motorcycle.model} (${seatHeight}mm):`, matches);
        return matches;
      });
      console.log(`After seat height filter: ${beforeCount} -> ${filtered.length}`);
    }

    // ABS filtering
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

    // Transmission filtering
    if (filters.transmission && filters.transmission.length > 0) {
      console.log("Applying transmission filter:", filters.transmission);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.transmission && 
                       filters.transmission!.some(trans => 
                         motorcycle.transmission!.toLowerCase().includes(trans.toLowerCase())
                       );
        console.log(`Transmission check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.transmission}):`, matches);
        return matches;
      });
      console.log(`After transmission filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Drive type filtering
    if (filters.driveType && filters.driveType.length > 0) {
      console.log("Applying drive type filter:", filters.driveType);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.drive_type && 
                       filters.driveType!.includes(motorcycle.drive_type);
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
        const matches = motorcycle.cooling_system && 
                       filters.coolingSystem!.includes(motorcycle.cooling_system);
        console.log(`Cooling system check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.cooling_system}):`, matches);
        return matches;
      });
      console.log(`After cooling system filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Power-to-weight ratio filtering
    if (filters.powerToWeightRange) {
      console.log("Applying power-to-weight ratio filter:", filters.powerToWeightRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.power_to_weight_ratio !== null && 
                       motorcycle.power_to_weight_ratio !== undefined &&
                       motorcycle.power_to_weight_ratio >= filters.powerToWeightRange![0] && 
                       motorcycle.power_to_weight_ratio <= filters.powerToWeightRange![1];
        console.log(`Power-to-weight ratio check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.power_to_weight_ratio}):`, matches);
        return matches;
      });
      console.log(`After power-to-weight ratio filter: ${beforeCount} -> ${filtered.length}`);
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
        const matches = motorcycle.recommended_license_level && 
                       filters.licenseLevelFilter!.includes(motorcycle.recommended_license_level);
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
        const matches = motorcycle.use_cases && 
                       filters.useCases!.some(useCase => 
                         motorcycle.use_cases!.includes(useCase)
                       );
        console.log(`Use cases check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.use_cases}):`, matches);
        return matches;
      });
      console.log(`After use cases filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Fuel capacity filtering
    if (filters.fuelCapacityRange) {
      console.log("Applying fuel capacity filter:", filters.fuelCapacityRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.fuel_capacity_l >= filters.fuelCapacityRange![0] && 
                       motorcycle.fuel_capacity_l <= filters.fuelCapacityRange![1];
        console.log(`Fuel capacity check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.fuel_capacity_l}l):`, matches);
        return matches;
      });
      console.log(`After fuel capacity filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Top speed filtering
    if (filters.topSpeedRange) {
      console.log("Applying top speed filter:", filters.topSpeedRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.top_speed_kph >= filters.topSpeedRange![0] && 
                       motorcycle.top_speed_kph <= filters.topSpeedRange![1];
        console.log(`Top speed check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.top_speed_kph}kph):`, matches);
        return matches;
      });
      console.log(`After top speed filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Torque filtering
    if (filters.torqueRange) {
      console.log("Applying torque filter:", filters.torqueRange);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const matches = motorcycle.torque_nm >= filters.torqueRange![0] && 
                       motorcycle.torque_nm <= filters.torqueRange![1];
        console.log(`Torque check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.torque_nm}nm):`, matches);
        return matches;
      });
      console.log(`After torque filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Smart features filtering
    if (filters.hasSmartFeatures !== null) {
      console.log("Applying smart features filter:", filters.hasSmartFeatures);
      const beforeCount = filtered.length;
      filtered = filtered.filter(motorcycle => {
        const hasFeatures = motorcycle.smart_features && motorcycle.smart_features.length > 0;
        const matches = hasFeatures === filters.hasSmartFeatures;
        console.log(`Smart features check for ${motorcycle.make} ${motorcycle.model} (${hasFeatures}):`, matches);
        return matches;
      });
      console.log(`After smart features filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Advanced search filtering
    if (filters.advancedSearch) {
      const { engineType, cylinderCount, brakeType } = filters.advancedSearch;
      
      if (engineType && engineType.length > 0) {
        console.log("Applying engine type filter:", engineType);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          const matches = motorcycle.engine_type && 
                         engineType.some(type => 
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
          const matches = motorcycle.cylinder_count && 
                         cylinderCount.includes(motorcycle.cylinder_count);
          console.log(`Cylinder count check for ${motorcycle.make} ${motorcycle.model} (${motorcycle.cylinder_count}):`, matches);
          return matches;
        });
        console.log(`After cylinder count filter: ${beforeCount} -> ${filtered.length}`);
      }

      if (brakeType && brakeType.length > 0) {
        console.log("Applying brake type filter:", brakeType);
        const beforeCount = filtered.length;
        filtered = filtered.filter(motorcycle => {
          const matches = motorcycle.brake_type && 
                         brakeType.some(type => 
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
        return false;
      }).length
    });

    console.log("=== FILTERING DEBUG END ===");
    return filtered;
  }, [motorcycles, filters, debouncedSearchTerm]);
}
