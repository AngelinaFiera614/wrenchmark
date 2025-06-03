
// Extract engine data from various sources with better fallbacks
export const extractEngineData = (rawData: any, configurations: any[] = []) => {
  // Try to find the best configuration with engine data
  const configWithEngine = configurations.find(config => 
    config?.engines?.displacement_cc > 0 || config?.engine?.displacement_cc > 0
  );
  
  const engineSource = configWithEngine?.engines || configWithEngine?.engine || {};
  
  // Use configuration engine data first, then fallback to model-level data
  const displacement = engineSource.displacement_cc || rawData.engine_size || 0;
  const power = engineSource.power_hp || rawData.horsepower || 0;
  const torque = engineSource.torque_nm || rawData.torque_nm || 0;
  
  return {
    engine_size: displacement,
    displacement_cc: displacement,
    engine_cc: displacement,
    horsepower: power,
    horsepower_hp: power,
    torque_nm: torque,
    engine_type: engineSource.engine_type || rawData.engine_type || null,
    cylinder_count: engineSource.cylinder_count || rawData.cylinder_count || null,
    cooling_system: engineSource.cooling || rawData.cooling_system || null,
    power_rpm: engineSource.power_rpm || rawData.power_rpm || null,
    torque_rpm: engineSource.torque_rpm || rawData.torque_rpm || null,
  };
};
