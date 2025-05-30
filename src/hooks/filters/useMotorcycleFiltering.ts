
import { useMemo } from "react";
import { Motorcycle, MotorcycleFilters } from "@/types";

export function useMotorcycleFiltering(
  motorcycles: Motorcycle[],
  filters: MotorcycleFilters,
  debouncedSearchTerm: string
) {
  return useMemo(() => {
    let filtered = motorcycles;

    // Search term filtering (enhanced for technical specs)
    if (debouncedSearchTerm) {
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
        
        return searchableText.includes(searchLower);
      });
    }

    // Category filtering
    if (filters.categories.length > 0) {
      filtered = filtered.filter(motorcycle =>
        filters.categories.includes(motorcycle.category as any)
      );
    }

    // Make filtering
    if (filters.make) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.make.toLowerCase().includes(filters.make.toLowerCase())
      );
    }

    // Year range filtering
    if (filters.yearRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.year >= filters.yearRange[0] && 
        motorcycle.year <= filters.yearRange[1]
      );
    }

    // Engine size filtering
    if (filters.engineSizeRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.engine_size >= filters.engineSizeRange[0] && 
        motorcycle.engine_size <= filters.engineSizeRange[1]
      );
    }

    // Difficulty level filtering
    if (filters.difficultyLevel < 5) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.difficulty_level <= filters.difficultyLevel
      );
    }

    // Weight filtering
    if (filters.weightRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.weight_kg >= filters.weightRange[0] && 
        motorcycle.weight_kg <= filters.weightRange[1]
      );
    }

    // Seat height filtering
    if (filters.seatHeightRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.seat_height_mm >= filters.seatHeightRange[0] && 
        motorcycle.seat_height_mm <= filters.seatHeightRange[1]
      );
    }

    // ABS filtering
    if (filters.abs !== null) {
      filtered = filtered.filter(motorcycle => motorcycle.abs === filters.abs);
    }

    // NEW ENHANCED FILTERS

    // Transmission filtering
    if (filters.transmission && filters.transmission.length > 0) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.transmission && 
        filters.transmission!.some(trans => 
          motorcycle.transmission!.toLowerCase().includes(trans.toLowerCase())
        )
      );
    }

    // Drive type filtering
    if (filters.driveType && filters.driveType.length > 0) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.drive_type && 
        filters.driveType!.includes(motorcycle.drive_type)
      );
    }

    // Cooling system filtering
    if (filters.coolingSystem && filters.coolingSystem.length > 0) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.cooling_system && 
        filters.coolingSystem!.includes(motorcycle.cooling_system)
      );
    }

    // Power-to-weight ratio filtering
    if (filters.powerToWeightRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.power_to_weight_ratio !== null && 
        motorcycle.power_to_weight_ratio !== undefined &&
        motorcycle.power_to_weight_ratio >= filters.powerToWeightRange![0] && 
        motorcycle.power_to_weight_ratio <= filters.powerToWeightRange![1]
      );
    }

    // Entry level filtering
    if (filters.isEntryLevel !== null) {
      filtered = filtered.filter(motorcycle => 
        motorcycle.is_entry_level === filters.isEntryLevel
      );
    }

    // License level filtering
    if (filters.licenseLevelFilter && filters.licenseLevelFilter.length > 0) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.recommended_license_level && 
        filters.licenseLevelFilter!.includes(motorcycle.recommended_license_level)
      );
    }

    // Use cases filtering
    if (filters.useCases && filters.useCases.length > 0) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.use_cases && 
        filters.useCases!.some(useCase => 
          motorcycle.use_cases!.includes(useCase)
        )
      );
    }

    // Fuel capacity filtering
    if (filters.fuelCapacityRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.fuel_capacity_l >= filters.fuelCapacityRange![0] && 
        motorcycle.fuel_capacity_l <= filters.fuelCapacityRange![1]
      );
    }

    // Top speed filtering
    if (filters.topSpeedRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.top_speed_kph >= filters.topSpeedRange![0] && 
        motorcycle.top_speed_kph <= filters.topSpeedRange![1]
      );
    }

    // Torque filtering
    if (filters.torqueRange) {
      filtered = filtered.filter(motorcycle =>
        motorcycle.torque_nm >= filters.torqueRange![0] && 
        motorcycle.torque_nm <= filters.torqueRange![1]
      );
    }

    // Smart features filtering
    if (filters.hasSmartFeatures !== null) {
      filtered = filtered.filter(motorcycle => {
        const hasFeatures = motorcycle.smart_features && motorcycle.smart_features.length > 0;
        return hasFeatures === filters.hasSmartFeatures;
      });
    }

    // Advanced search filtering
    if (filters.advancedSearch) {
      const { engineType, cylinderCount, brakeType } = filters.advancedSearch;
      
      if (engineType && engineType.length > 0) {
        filtered = filtered.filter(motorcycle =>
          motorcycle.engine_type && 
          engineType.some(type => 
            motorcycle.engine_type!.toLowerCase().includes(type.toLowerCase())
          )
        );
      }

      if (cylinderCount && cylinderCount.length > 0) {
        filtered = filtered.filter(motorcycle =>
          motorcycle.cylinder_count && 
          cylinderCount.includes(motorcycle.cylinder_count)
        );
      }

      if (brakeType && brakeType.length > 0) {
        filtered = filtered.filter(motorcycle =>
          motorcycle.brake_type && 
          brakeType.some(type => 
            motorcycle.brake_type!.toLowerCase().includes(type.toLowerCase())
          )
        );
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

    return filtered;
  }, [motorcycles, filters, debouncedSearchTerm]);
}
