
import { useMeasurement } from "@/context/MeasurementContext";
import { Motorcycle } from "@/types";
import {
  formatWeight,
  formatSeatHeight,
  formatWheelbase,
  formatGroundClearance,
  formatFuelCapacity
} from "@/utils/dimensionFormatters";

export function useDimensionData(motorcycle: Motorcycle) {
  const { unit } = useMeasurement();
  
  // Enhanced data extraction with configuration fallbacks
  const getDimensionData = () => {
    // Try configuration data first, then fallback to motorcycle data
    const selectedConfig = motorcycle._componentData?.configurations?.find(c => c.is_default) || 
                          motorcycle._componentData?.configurations?.[0];
    
    return {
      weight_kg: selectedConfig?.weight_kg || motorcycle.weight_kg || 0,
      weight_lbs: motorcycle.weight_lbs || (motorcycle.weight_kg ? motorcycle.weight_kg * 2.20462 : 0),
      seat_height_mm: selectedConfig?.seat_height_mm || motorcycle.seat_height_mm || 0,
      seat_height_in: motorcycle.seat_height_in || (motorcycle.seat_height_mm ? motorcycle.seat_height_mm / 25.4 : 0),
      wheelbase_mm: selectedConfig?.wheelbase_mm || motorcycle.wheelbase_mm || 0,
      wheelbase_in: motorcycle.wheelbase_in || (motorcycle.wheelbase_mm ? motorcycle.wheelbase_mm / 25.4 : 0),
      ground_clearance_mm: selectedConfig?.ground_clearance_mm || motorcycle.ground_clearance_mm || 0,
      ground_clearance_in: motorcycle.ground_clearance_in || (motorcycle.ground_clearance_mm ? motorcycle.ground_clearance_mm / 25.4 : 0),
      fuel_capacity_l: selectedConfig?.fuel_capacity_l || motorcycle.fuel_capacity_l || 0,
      fuel_capacity_gal: motorcycle.fuel_capacity_gal || (motorcycle.fuel_capacity_l ? motorcycle.fuel_capacity_l * 0.264172 : 0)
    };
  };

  const dimensionData = getDimensionData();

  console.log("Dimension data extraction:", {
    dimensionData,
    selectedConfig: motorcycle._componentData?.configurations?.find(c => c.is_default),
    availableConfigs: motorcycle._componentData?.configurations?.length || 0
  });

  return {
    weight: formatWeight(dimensionData.weight_kg, dimensionData.weight_lbs, unit),
    seatHeight: formatSeatHeight(dimensionData.seat_height_mm, dimensionData.seat_height_in, unit),
    wheelbase: formatWheelbase(dimensionData.wheelbase_mm, dimensionData.wheelbase_in, unit),
    groundClearance: formatGroundClearance(dimensionData.ground_clearance_mm, dimensionData.ground_clearance_in, unit),
    fuelCapacity: formatFuelCapacity(dimensionData.fuel_capacity_l, dimensionData.fuel_capacity_gal, unit),
    unit
  };
}
