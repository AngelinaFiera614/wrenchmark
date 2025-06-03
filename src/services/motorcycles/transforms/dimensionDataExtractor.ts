
// Extract dimension data from configurations with proper fallbacks
export const extractDimensionData = (configurations: any[] = [], fallbackData: any = {}) => {
  console.log("=== DIMENSIONS EXTRACT: Starting ===", {
    configurations: configurations.length,
    hasFallback: !!fallbackData.seat_height_mm
  });

  // Find the configuration with the most complete dimension data
  const configWithDimensions = configurations.reduce((best, config) => {
    const currentCount = [
      config.seat_height_mm,
      config.weight_kg,
      config.wheelbase_mm,
      config.fuel_capacity_l,
      config.ground_clearance_mm
    ].filter(Boolean).length;

    const bestCount = [
      best?.seat_height_mm,
      best?.weight_kg,
      best?.wheelbase_mm,
      best?.fuel_capacity_l,
      best?.ground_clearance_mm
    ].filter(Boolean).length;

    return currentCount > bestCount ? config : best;
  }, configurations[0]);

  if (configWithDimensions) {
    console.log("Using configuration dimension data");
    return {
      seat_height_mm: configWithDimensions.seat_height_mm || fallbackData.seat_height_mm || null,
      weight_kg: configWithDimensions.weight_kg || fallbackData.weight_kg || fallbackData.wet_weight_kg || null,
      wheelbase_mm: configWithDimensions.wheelbase_mm || fallbackData.wheelbase_mm || null,
      fuel_capacity_l: configWithDimensions.fuel_capacity_l || fallbackData.fuel_capacity_l || null,
      ground_clearance_mm: configWithDimensions.ground_clearance_mm || fallbackData.ground_clearance_mm || null
    };
  }

  // Use fallback data from model
  console.log("Using fallback dimension data from model");
  return {
    seat_height_mm: fallbackData.seat_height_mm || null,
    weight_kg: fallbackData.weight_kg || fallbackData.wet_weight_kg || null,
    wheelbase_mm: fallbackData.wheelbase_mm || null,
    fuel_capacity_l: fallbackData.fuel_capacity_l || null,
    ground_clearance_mm: fallbackData.ground_clearance_mm || null
  };
};
