
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
  
  // Enhanced data extraction with better configuration fallbacks
  const getEngineData = () => {
    console.log("Getting engine data for performance specs");
    console.log("Motorcycle base data:", {
      engine_size: motorcycle.engine_size,
      horsepower: motorcycle.horsepower,
      torque_nm: motorcycle.torque_nm
    });
    
    // Use the already transformed data from the motorcycle object first
    const engineData = {
      engine_cc: motorcycle.engine_size || motorcycle.displacement_cc || motorcycle.engine_cc || 0,
      displacement_cc: motorcycle.displacement_cc || motorcycle.engine_size || motorcycle.engine_cc || 0,
      horsepower_hp: motorcycle.horsepower_hp || motorcycle.horsepower || 0,
      power_rpm: motorcycle.power_rpm,
      torque_nm: motorcycle.torque_nm || 0,
      torque_rpm: motorcycle.torque_rpm,
      engine_type: motorcycle.engine_type,
      cylinder_count: motorcycle.cylinder_count
    };
    
    console.log("Final engine data for performance:", engineData);
    return engineData;
  };

  const getBrakeData = () => {
    console.log("Getting brake data for performance specs");
    const brakeData = {
      brake_type: motorcycle.brake_type,
      has_abs: motorcycle.has_abs ?? motorcycle.abs ?? false
    };
    
    console.log("Final brake data for performance:", brakeData);
    return brakeData;
  };

  const getSpeedData = () => {
    const speedData = {
      top_speed_kph: motorcycle.top_speed_kph || 0,
      top_speed_mph: motorcycle.top_speed_mph || (motorcycle.top_speed_kph ? motorcycle.top_speed_kph * 0.621371 : 0)
    };
    
    console.log("Speed data for performance:", speedData);
    return speedData;
  };

  const engineData = getEngineData();
  const brakeData = getBrakeData();
  const speedData = getSpeedData();

  console.log("Performance data extraction complete:", {
    engineData,
    brakeData,
    speedData
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
