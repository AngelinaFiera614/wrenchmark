
/**
 * Utilities for converting between metric and imperial measurements
 */

// Weight conversions
export const kgToLbs = (kg: number): number => kg * 2.20462;
export const lbsToKg = (lbs: number): number => lbs / 2.20462;

// Length/Distance conversions
export const mmToInch = (mm: number): number => mm / 25.4;
export const inchToMm = (inch: number): number => inch * 25.4;

export const kmToMiles = (km: number): number => km * 0.621371;
export const milesToKm = (miles: number): number => miles / 0.621371;

// Volume conversions
export const litersToGallons = (l: number): number => l * 0.264172;
export const gallonsToLiters = (gal: number): number => gal / 0.264172;

// Speed conversions
export const kphToMph = (kph: number): number => kph * 0.621371;
export const mphToKph = (mph: number): number => mph / 0.621371;

/**
 * Format values with appropriate units for display
 */
export const formatWeight = (value: number | undefined | null, unit: "metric" | "imperial"): string => {
  if (!value || value <= 0) return "N/A";
  
  if (unit === "metric") {
    return `${value.toFixed(1)} kg`;
  } else {
    return `${kgToLbs(value).toFixed(1)} lbs`;
  }
};

export const formatLength = (valueInMm: number | undefined | null, unit: "metric" | "imperial"): string => {
  if (!valueInMm || valueInMm <= 0) return "N/A";
  
  if (unit === "metric") {
    return `${valueInMm} mm`;
  } else {
    const inches = mmToInch(valueInMm);
    return `${inches.toFixed(1)} in`;
  }
};

export const formatVolume = (valueInL: number | undefined | null, unit: "metric" | "imperial"): string => {
  if (!valueInL || valueInL <= 0) return "N/A";
  
  if (unit === "metric") {
    return `${valueInL.toFixed(1)} L`;
  } else {
    return `${litersToGallons(valueInL).toFixed(1)} gal`;
  }
};

export const formatSpeed = (valueInKph: number | undefined | null, unit: "metric" | "imperial"): string => {
  if (!valueInKph || valueInKph <= 0) return "N/A";
  
  if (unit === "metric") {
    return `${valueInKph} km/h`;
  } else {
    return `${kphToMph(valueInKph).toFixed(0)} mph`;
  }
};
