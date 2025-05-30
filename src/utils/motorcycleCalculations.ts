
import { Configuration } from "@/types/motorcycle";

// Calculate power-to-weight ratio
export const calculatePowerToWeightRatio = (powerHp: number, weightKg: number): number => {
  if (!powerHp || !weightKg) return 0;
  return Math.round((powerHp / (weightKg * 2.20462)) * 100) / 100; // HP per pound
};

// Calculate torque-to-weight ratio
export const calculateTorqueToWeightRatio = (torqueNm: number, weightKg: number): number => {
  if (!torqueNm || !weightKg) return 0;
  const torqueLbFt = torqueNm * 0.737562;
  return Math.round((torqueLbFt / (weightKg * 2.20462)) * 100) / 100;
};

// Calculate performance index (composite metric)
export const calculatePerformanceIndex = (config: Configuration): number => {
  if (!config.engine?.power_hp || !config.weight_kg) return 0;
  
  const powerWeight = calculatePowerToWeightRatio(config.engine.power_hp, config.weight_kg);
  const torqueWeight = config.engine?.torque_nm 
    ? calculateTorqueToWeightRatio(config.engine.torque_nm, config.weight_kg)
    : 0;
  
  // Weighted composite score
  const performanceIndex = (powerWeight * 0.7) + (torqueWeight * 0.3);
  return Math.round(performanceIndex * 100) / 100;
};

// Calculate displacement per cylinder
export const calculateDisplacementPerCylinder = (totalDisplacement: number, cylinderCount: number): number => {
  if (!totalDisplacement || !cylinderCount) return 0;
  return Math.round((totalDisplacement / cylinderCount) * 10) / 10;
};

// Calculate horsepower per liter
export const calculateHorsepowerPerLiter = (powerHp: number, displacementCc: number): number => {
  if (!powerHp || !displacementCc) return 0;
  const displacementLiters = displacementCc / 1000;
  return Math.round((powerHp / displacementLiters) * 10) / 10;
};

// Calculate weight distribution (front/rear based on wheelbase and seat position)
export const calculateWeightDistribution = (wheelbaseMm: number, seatHeightMm: number) => {
  if (!wheelbaseMm) return { front: 50, rear: 50 };
  
  // Simplified calculation - sportbikes tend to be rear-heavy, cruisers front-heavy
  const ratio = seatHeightMm ? seatHeightMm / wheelbaseMm : 0.05;
  const frontWeight = Math.min(Math.max(45 + (ratio * 100), 40), 55);
  const rearWeight = 100 - frontWeight;
  
  return {
    front: Math.round(frontWeight * 10) / 10,
    rear: Math.round(rearWeight * 10) / 10
  };
};

// Get performance category based on power-to-weight ratio
export const getPerformanceCategory = (powerToWeight: number): string => {
  if (powerToWeight >= 0.4) return "Extreme Performance";
  if (powerToWeight >= 0.3) return "High Performance";
  if (powerToWeight >= 0.2) return "Sport Performance";
  if (powerToWeight >= 0.15) return "Moderate Performance";
  if (powerToWeight >= 0.1) return "Touring Performance";
  return "Entry Level";
};

// Calculate all derived metrics for a configuration
export const calculateAllMetrics = (config: Configuration) => {
  const powerHp = config.engine?.power_hp || 0;
  const torqueNm = config.engine?.torque_nm || 0;
  const weightKg = config.weight_kg || 0;
  const displacementCc = config.engine?.displacement_cc || 0;
  const wheelbaseMm = config.wheelbase_mm || 0;
  const seatHeightMm = config.seat_height_mm || 0;
  const cylinderCount = config.engine?.cylinder_count || 1;

  const powerToWeight = calculatePowerToWeightRatio(powerHp, weightKg);
  const torqueToWeight = calculateTorqueToWeightRatio(torqueNm, weightKg);
  const performanceIndex = calculatePerformanceIndex(config);
  const displacementPerCylinder = calculateDisplacementPerCylinder(displacementCc, cylinderCount);
  const horsepowerPerLiter = calculateHorsepowerPerLiter(powerHp, displacementCc);
  const weightDistribution = calculateWeightDistribution(wheelbaseMm, seatHeightMm);
  const performanceCategory = getPerformanceCategory(powerToWeight);

  return {
    powerToWeight,
    torqueToWeight,
    performanceIndex,
    displacementPerCylinder,
    horsepowerPerLiter,
    weightDistribution,
    performanceCategory,
    // Additional derived metrics
    weightLbs: Math.round((weightKg * 2.20462) * 10) / 10,
    torqueLbFt: Math.round((torqueNm * 0.737562) * 10) / 10,
    displacementLiters: Math.round((displacementCc / 1000) * 100) / 100
  };
};
