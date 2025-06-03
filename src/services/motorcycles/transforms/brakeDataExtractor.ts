
// Extract brake data with fallbacks
export const extractBrakeData = (configurations: any[] = [], fallbackData: any = {}) => {
  const configWithBrakes = configurations.find(config => 
    config?.brake_systems || config?.brakes
  );
  
  const brakeSource = configWithBrakes?.brake_systems || configWithBrakes?.brakes || {};
  
  return {
    abs: brakeSource.has_traction_control || fallbackData.has_abs || false,
    has_abs: brakeSource.has_traction_control || fallbackData.has_abs || false,
    brake_type: brakeSource.type || fallbackData.brake_type || null,
  };
};
