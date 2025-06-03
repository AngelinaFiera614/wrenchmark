
// Extract brake data with inheritance support
export const extractBrakeData = (configurations: any[] = [], brakeSystem: any = null, fallbackData: any = {}) => {
  console.log("=== BRAKE EXTRACT: Starting ===", {
    configurations: configurations.length,
    hasBrakeSystem: !!brakeSystem,
    hasFallback: !!fallbackData.has_abs
  });

  // Use the resolved brake system component first
  if (brakeSystem) {
    console.log("Using resolved brake system component:", brakeSystem.type);
    return {
      has_abs: brakeSystem.has_abs || fallbackData.has_abs || false,
      brake_type: brakeSystem.type || fallbackData.brake_type || null,
      brake_brand: brakeSystem.brake_brand || null,
      front_disc_size_mm: brakeSystem.front_disc_size_mm || null,
      rear_disc_size_mm: brakeSystem.rear_disc_size_mm || null
    };
  }

  // Fall back to configuration data
  const configWithBrakes = configurations.find(config => config.brake_system_id);
  if (configWithBrakes) {
    console.log("Using configuration brake data");
    return {
      has_abs: fallbackData.has_abs || false,
      brake_type: fallbackData.brake_type || null,
      brake_brand: null,
      front_disc_size_mm: null,
      rear_disc_size_mm: null
    };
  }

  // Use fallback data from model
  console.log("Using fallback brake data from model");
  return {
    has_abs: fallbackData.has_abs || false,
    brake_type: fallbackData.brake_type || null,
    brake_brand: null,
    front_disc_size_mm: null,
    rear_disc_size_mm: null
  };
};
