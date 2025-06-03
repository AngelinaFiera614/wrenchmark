
// Extract engine data with inheritance support
export const extractEngineData = (configurations: any[] = [], engine: any = null, fallbackData: any = {}) => {
  console.log("=== ENGINE EXTRACT: Starting ===", {
    configurations: configurations.length,
    hasEngine: !!engine,
    hasFallback: !!fallbackData.engine_size
  });

  // Use the resolved engine component first
  if (engine) {
    console.log("Using resolved engine component:", engine.name);
    return {
      displacement_cc: engine.displacement_cc || fallbackData.engine_size || null,
      power_hp: engine.power_hp || fallbackData.horsepower || null,
      torque_nm: engine.torque_nm || fallbackData.torque_nm || null,
      engine_type: engine.engine_type || fallbackData.engine || null,
      fuel_system: engine.fuel_system || fallbackData.fuel_system || null,
      cooling: engine.cooling || fallbackData.cooling_system || null,
      cylinder_count: engine.cylinder_count || null,
      valve_count: engine.valve_count || null,
      power_rpm: engine.power_rpm || null,
      torque_rpm: engine.torque_rpm || null
    };
  }

  // Fall back to configuration data
  const configWithEngine = configurations.find(config => config.engine_id);
  if (configWithEngine) {
    console.log("Using configuration engine data");
    return {
      displacement_cc: fallbackData.engine_size || null,
      power_hp: fallbackData.horsepower || null,
      torque_nm: fallbackData.torque_nm || null,
      engine_type: fallbackData.engine || null,
      fuel_system: fallbackData.fuel_system || null,
      cooling: fallbackData.cooling_system || null,
      cylinder_count: null,
      valve_count: null,
      power_rpm: null,
      torque_rpm: null
    };
  }

  // Use fallback data from model
  console.log("Using fallback engine data from model");
  return {
    displacement_cc: fallbackData.engine_size || null,
    power_hp: fallbackData.horsepower || null,
    torque_nm: fallbackData.torque_nm || null,
    engine_type: fallbackData.engine || fallbackData.category || null,
    fuel_system: fallbackData.fuel_system || null,
    cooling: fallbackData.cooling_system || null,
    cylinder_count: null,
    valve_count: null,
    power_rpm: null,
    torque_rpm: null
  };
};
