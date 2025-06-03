
// Extract dimension data with fallbacks
export const extractDimensionData = (configurations: any[] = [], fallbackData: any = {}) => {
  // Find configuration with the most complete dimension data
  const configWithDimensions = configurations.find(config => 
    config?.seat_height_mm > 0 || config?.weight_kg > 0
  ) || configurations[0];
  
  const seat_height_mm = configWithDimensions?.seat_height_mm || fallbackData.seat_height_mm || 0;
  const weight_kg = configWithDimensions?.weight_kg || fallbackData.weight_kg || 0;
  const wheelbase_mm = configWithDimensions?.wheelbase_mm || fallbackData.wheelbase_mm || 0;
  const ground_clearance_mm = configWithDimensions?.ground_clearance_mm || fallbackData.ground_clearance_mm || 0;
  const fuel_capacity_l = configWithDimensions?.fuel_capacity_l || fallbackData.fuel_capacity_l || 0;

  return {
    seat_height_mm,
    weight_kg,
    wheelbase_mm,
    ground_clearance_mm,
    fuel_capacity_l,
    // Imperial conversions
    seat_height_in: seat_height_mm ? (seat_height_mm / 25.4) : 0,
    weight_lbs: weight_kg ? (weight_kg * 2.20462) : 0,
    wheelbase_in: wheelbase_mm ? (wheelbase_mm / 25.4) : 0,
    ground_clearance_in: ground_clearance_mm ? (ground_clearance_mm / 25.4) : 0,
    fuel_capacity_gal: fuel_capacity_l ? (fuel_capacity_l * 0.264172) : 0,
  };
};
