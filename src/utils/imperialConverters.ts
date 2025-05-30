
/**
 * Imperial unit converters for admin forms
 * These convert between imperial input values and metric storage values
 */

// Weight conversions
export const lbsToKg = (lbs: number): number => lbs / 2.20462;
export const kgToLbs = (kg: number): number => kg * 2.20462;

// Length conversions  
export const inchesToMm = (inches: number): number => inches * 25.4;
export const mmToInches = (mm: number): number => mm / 25.4;

// Volume conversions
export const gallonsToLiters = (gallons: number): number => gallons * 3.78541;
export const litersToGallons = (liters: number): number => liters / 3.78541;

// Speed conversions
export const mphToKph = (mph: number): number => mph * 1.60934;
export const kphToMph = (kph: number): number => kph / 1.60934;

/**
 * Format functions for form display
 */
export const formatWeightForForm = (kgValue: number | null | undefined): string => {
  if (!kgValue) return "";
  return kgToLbs(kgValue).toFixed(1);
};

export const formatLengthForForm = (mmValue: number | null | undefined): string => {
  if (!mmValue) return "";
  return mmToInches(mmValue).toFixed(1);
};

export const formatVolumeForForm = (literValue: number | null | undefined): string => {
  if (!literValue) return "";
  return litersToGallons(literValue).toFixed(1);
};

export const formatSpeedForForm = (kphValue: number | null | undefined): string => {
  if (!kphValue) return "";
  return kphToMph(kphValue).toFixed(0);
};

/**
 * Parse functions for form submission
 */
export const parseWeightForDb = (lbsInput: string | number): number | null => {
  const lbs = typeof lbsInput === 'string' ? parseFloat(lbsInput) : lbsInput;
  if (isNaN(lbs) || lbs <= 0) return null;
  return lbsToKg(lbs);
};

export const parseLengthForDb = (inchInput: string | number): number | null => {
  const inches = typeof inchInput === 'string' ? parseFloat(inchInput) : inchInput;
  if (isNaN(inches) || inches <= 0) return null;
  return inchesToMm(inches);
};

export const parseVolumeForDb = (gallonInput: string | number): number | null => {
  const gallons = typeof gallonInput === 'string' ? parseFloat(gallonInput) : gallonInput;
  if (isNaN(gallons) || gallons <= 0) return null;
  return gallonsToLiters(gallons);
};

export const parseSpeedForDb = (mphInput: string | number): number | null => {
  const mph = typeof mphInput === 'string' ? parseFloat(mphInput) : mphInput;
  if (isNaN(mph) || mph <= 0) return null;
  return mphToKph(mph);
};
