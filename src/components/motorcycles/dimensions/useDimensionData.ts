
import { useMeasurement } from "@/context/MeasurementContext";
import { Motorcycle } from "@/types";
import {
  formatWeight,
  formatSeatHeight,
  formatWheelbase,
  formatGroundClearance,
  formatFuelCapacity
} from "@/utils/dimensionFormatters";

export function useDimensionData(motorcycle: Motorcycle, selectedConfiguration?: any) {
  const { unit } = useMeasurement();
  
  console.log("=== useDimensionData DEBUG ===");
  console.log("Input motorcycle:", motorcycle.id);
  console.log("Selected configuration:", selectedConfiguration?.name || selectedConfiguration?.id);
  
  // Get data from the selected configuration if available, otherwise fallback to motorcycle object
  let dimensionData: any = {};
  
  if (selectedConfiguration) {
    console.log("Using configuration dimension data:", {
      weight_kg: selectedConfiguration.weight_kg,
      seat_height_mm: selectedConfiguration.seat_height_mm,
      wheelbase_mm: selectedConfiguration.wheelbase_mm,
      ground_clearance_mm: selectedConfiguration.ground_clearance_mm,
      fuel_capacity_l: selectedConfiguration.fuel_capacity_l
    });
    
    dimensionData = {
      weight_kg: selectedConfiguration.weight_kg || 0,
      weight_lbs: selectedConfiguration.weight_kg ? selectedConfiguration.weight_kg * 2.20462 : 0,
      seat_height_mm: selectedConfiguration.seat_height_mm || 0,
      seat_height_in: selectedConfiguration.seat_height_mm ? selectedConfiguration.seat_height_mm / 25.4 : 0,
      wheelbase_mm: selectedConfiguration.wheelbase_mm || 0,
      wheelbase_in: selectedConfiguration.wheelbase_mm ? selectedConfiguration.wheelbase_mm / 25.4 : 0,
      ground_clearance_mm: selectedConfiguration.ground_clearance_mm || 0,
      ground_clearance_in: selectedConfiguration.ground_clearance_mm ? selectedConfiguration.ground_clearance_mm / 25.4 : 0,
      fuel_capacity_l: selectedConfiguration.fuel_capacity_l || 0,
      fuel_capacity_gal: selectedConfiguration.fuel_capacity_l ? selectedConfiguration.fuel_capacity_l * 0.264172 : 0
    };
  } else {
    console.log("Using fallback motorcycle dimension data");
    
    // Fallback to motorcycle object data
    dimensionData = {
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
  }
  
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
