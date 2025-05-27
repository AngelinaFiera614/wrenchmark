
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
  
  const {
    weight_kg,
    weight_lbs,
    seat_height_mm,
    seat_height_in,
    wheelbase_mm,
    wheelbase_in,
    ground_clearance_mm,
    ground_clearance_in,
    fuel_capacity_l,
    fuel_capacity_gal
  } = motorcycle;

  return {
    weight: formatWeight(weight_kg, weight_lbs, unit),
    seatHeight: formatSeatHeight(seat_height_mm, seat_height_in, unit),
    wheelbase: formatWheelbase(wheelbase_mm, wheelbase_in, unit),
    groundClearance: formatGroundClearance(ground_clearance_mm, ground_clearance_in, unit),
    fuelCapacity: formatFuelCapacity(fuel_capacity_l, fuel_capacity_gal, unit),
    unit
  };
}
