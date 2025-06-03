
import { Configuration } from "@/types/motorcycle";

export const calculateFormCompleteness = (config: Configuration) => {
  // Calculate basic info completeness
  const basicInfoFields = [
    config.name,
    config.market_region,
    config.price_premium_usd
  ];
  const basicInfoComplete = basicInfoFields.filter(field => field !== null && field !== undefined && field !== '').length;
  const basicInfo = Math.round((basicInfoComplete / basicInfoFields.length) * 100);

  // Calculate components completeness
  const componentFields = [
    config.engine_id,
    config.brake_system_id,
    config.frame_id,
    config.suspension_id,
    config.wheel_id
  ];
  const componentsComplete = componentFields.filter(field => field !== null && field !== undefined && field !== '').length;
  const components = Math.round((componentsComplete / componentFields.length) * 100);

  // Calculate dimensions completeness
  const dimensionFields = [
    config.seat_height_mm,
    config.weight_kg,
    config.wheelbase_mm,
    config.fuel_capacity_l,
    config.ground_clearance_mm
  ];
  const dimensionsComplete = dimensionFields.filter(field => field !== null && field !== undefined).length;
  const dimensions = Math.round((dimensionsComplete / dimensionFields.length) * 100);

  // Calculate overall completeness
  const totalFields = basicInfoFields.length + componentFields.length + dimensionFields.length;
  const totalComplete = basicInfoComplete + componentsComplete + dimensionsComplete;
  const overall = Math.round((totalComplete / totalFields) * 100);

  return {
    basicInfo,
    components,
    dimensions,
    overall
  };
};
