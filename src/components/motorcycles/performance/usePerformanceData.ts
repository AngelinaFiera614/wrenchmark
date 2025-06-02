
import { useMeasurement } from "@/context/MeasurementContext";
import { Motorcycle } from "@/types";
import {
  formatEngineType,
  formatHorsepower,
  formatTorque,
  formatTopSpeed,
  formatBrakeSystem
} from "@/utils/performanceFormatters";

export function usePerformanceData(motorcycle: Motorcycle) {
  const { unit } = useMeasurement();
  
  // Enhanced data extraction with configuration fallbacks
  const getEngineData = () => {
    // Try configuration data first, then fallback to motorcycle data
    const configEngine = motorcycle._componentData?.engine;
    return {
      engine_cc: configEngine?.displacement_cc || motorcycle.engine_cc || motorcycle.displacement_cc || motorcycle.engine_size || 0,
      displacement_cc: configEngine?.displacement_cc || motorcycle.displacement_cc || motorcycle.engine_cc || motorcycle.engine_size || 0,
      horsepower_hp: configEngine?.power_hp || motorcycle.horsepower_hp || motorcycle.horsepower || 0,
      power_rpm: configEngine?.power_rpm || motorcycle.power_rpm,
      torque_nm: configEngine?.torque_nm || motorcycle.torque_nm || 0,
      torque_rpm: configEngine?.torque_rpm || motorcycle.torque_rpm,
      engine_type: configEngine?.engine_type || motorcycle.engine_type,
      cylinder_count: configEngine?.cylinder_count || motorcycle.cylinder_count
    };
  };

  const getBrakeData = () => {
    // Try configuration data first, then fallback to motorcycle data
    const configBrakes = motorcycle._componentData?.brakes;
    return {
      brake_type: configBrakes?.type || motorcycle.brake_type,
      has_abs: configBrakes?.has_traction_control ?? motorcycle.has_abs ?? motorcycle.abs ?? false
    };
  };

  const getSpeedData = () => {
    return {
      top_speed_kph: motorcycle.top_speed_kph || 0,
      top_speed_mph: motorcycle.top_speed_mph || (motorcycle.top_speed_kph ? motorcycle.top_speed_kph * 0.621371 : 0)
    };
  };

  const engineData = getEngineData();
  const brakeData = getBrakeData();
  const speedData = getSpeedData();

  console.log("Performance data extraction:", {
    engineData,
    brakeData,
    speedData,
    configEngine: motorcycle._componentData?.engine,
    configBrakes: motorcycle._componentData?.brakes
  });

  return {
    engineType: formatEngineType(engineData.displacement_cc, engineData.engine_type, engineData.cylinder_count),
    horsepower: formatHorsepower(engineData.horsepower_hp, engineData.power_rpm),
    torque: formatTorque(engineData.torque_nm, engineData.torque_rpm),
    topSpeed: formatTopSpeed(speedData.top_speed_kph, speedData.top_speed_mph, unit),
    brakeSystem: formatBrakeSystem(brakeData.brake_type, brakeData.has_abs),
    unit
  };
}
