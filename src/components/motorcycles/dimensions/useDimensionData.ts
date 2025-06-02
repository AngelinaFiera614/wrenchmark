
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
  
  console.log("=== useDimensionData DEBUG ===");
  console.log("Input motorcycle data:", {
    id: motorcycle.id,
    weight_kg: motorcycle.weight_kg,
    seat_height_mm: motorcycle.seat_height_mm,
    wheelbase_mm: motorcycle.wheelbase_mm,
    ground_clearance_mm: motorcycle.ground_clearance_mm,
    fuel_capacity_l: motorcycle.fuel_capacity_l,
    has_componentData: !!motorcycle._componentData,
    selectedConfiguration: motorcycle._componentData?.selectedConfiguration?.name
  });
  
  // Use the transformed data which should already have the correct values and conversions
  const dimensionData = {
    weight_kg: motorcycle.weight_kg || 0,
    weight_lbs: motorcycle.weight_lbs || (motorcycle.weight_kg ? motorcycle.weight_kg * 2.20462 : 0),
    seat_height_mm: motorcycle.seat_height_mm || 0,
    seat_height_in: motorcycle.seat_height_in || (motorcycle.seat_height_mm ? motorcycle.seat_height_mm / 25.4 : 0),
    wheelbase_mm: motorcycle.wheelbase_mm || 0,
    wheelbase_in: motorcycle.wheelbase_in || (motorcycle.wheelbase_mm ? motorcycle.wheelbase_mm / 25.4 : 0),
    ground_clearance_mm: motorcycle.ground_clearance_mm || 0,
    ground_clearance_in: motorcycle.ground_clearance_in || (motorcycle.ground_clearance_mm ? motorcycle.ground_clearance_mm / 25.4 : 0),
    fuel_capacity_l: motorcycle.fuel_capacity_l || 0,
    fuel_capacity_gal: motorcycle.fuel_capacity_gal || (motorcycle.fuel_capacity_l ? motorcycle.fuel_capacity_l * 0.264172 : 0)
  };
  
  console.log("Final dimension data for formatting:", dimensionData);

  const result = {
    weight: formatWeight(dimensionData.weight_kg, dimensionData.weight_lbs, unit),
    seatHeight: formatSeatHeight(dimensionData.seat_height_mm, dimensionData.seat_height_in, unit),
    wheelbase: formatWheelbase(dimensionData.wheelbase_mm, dimensionData.wheelbase_in, unit),
    groundClearance: formatGroundClearance(dimensionData.ground_clearance_mm, dimensionData.ground_clearance_in, unit),
    fuelCapacity: formatFuelCapacity(dimensionData.fuel_capacity_l, dimensionData.fuel_capacity_gal, unit),
    unit
  };

  console.log("Formatted dimension specifications:", result);
  console.log("Data validity check:", {
    weight: dimensionData.weight_kg > 0,
    seatHeight: dimensionData.seat_height_mm > 0,
    wheelbase: dimensionData.wheelbase_mm > 0,
    groundClearance: dimensionData.ground_clearance_mm > 0,
    fuelCapacity: dimensionData.fuel_capacity_l > 0
  });
  console.log("=== END useDimensionData DEBUG ===");

  return result;
}
