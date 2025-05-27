
/**
 * Utilities for formatting motorcycle physical dimension specifications
 */

export const formatWeight = (
  weight_kg?: number,
  weight_lbs?: number,
  unit: "metric" | "imperial" = "metric"
): string => {
  if (unit === "metric") {
    if (!weight_kg || weight_kg <= 0) return "N/A";
    return `${weight_kg.toFixed(1)} kg`;
  } else {
    if (!weight_lbs || weight_lbs <= 0) return "N/A";
    return `${weight_lbs.toFixed(1)} lbs`;
  }
};

export const formatSeatHeight = (
  seat_height_mm?: number,
  seat_height_in?: number,
  unit: "metric" | "imperial" = "metric"
): string => {
  if (unit === "metric") {
    if (!seat_height_mm || seat_height_mm <= 0) return "N/A";
    return `${seat_height_mm} mm`;
  } else {
    if (!seat_height_in || seat_height_in <= 0) return "N/A";
    return `${seat_height_in.toFixed(1)} in`;
  }
};

export const formatWheelbase = (
  wheelbase_mm?: number,
  wheelbase_in?: number,
  unit: "metric" | "imperial" = "metric"
): string => {
  if (unit === "metric") {
    if (!wheelbase_mm || wheelbase_mm <= 0) return "N/A";
    return `${wheelbase_mm} mm`;
  } else {
    if (!wheelbase_in || wheelbase_in <= 0) return "N/A";
    return `${wheelbase_in.toFixed(1)} in`;
  }
};

export const formatGroundClearance = (
  ground_clearance_mm?: number,
  ground_clearance_in?: number,
  unit: "metric" | "imperial" = "metric"
): string => {
  if (unit === "metric") {
    if (!ground_clearance_mm || ground_clearance_mm <= 0) return "N/A";
    return `${ground_clearance_mm} mm`;
  } else {
    if (!ground_clearance_in || ground_clearance_in <= 0) return "N/A";
    return `${ground_clearance_in.toFixed(1)} in`;
  }
};

export const formatFuelCapacity = (
  fuel_capacity_l?: number,
  fuel_capacity_gal?: number,
  unit: "metric" | "imperial" = "metric"
): string => {
  if (unit === "metric") {
    if (!fuel_capacity_l || fuel_capacity_l <= 0) return "N/A";
    return `${fuel_capacity_l.toFixed(1)} L`;
  } else {
    if (!fuel_capacity_gal || fuel_capacity_gal <= 0) return "N/A";
    return `${fuel_capacity_gal.toFixed(1)} gal`;
  }
};
