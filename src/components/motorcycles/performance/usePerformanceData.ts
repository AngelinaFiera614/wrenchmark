
import { useMeasurement } from "@/context/MeasurementContext";
import { Motorcycle } from "@/types";
import {
  formatEngineType,
  formatHorsepower,
  formatTorque,
  formatTopSpeed,
  formatBrakeSystem
} from "@/utils/performanceFormatters";

export function usePerformanceData(motorcycle: Motorcycle, selectedConfiguration?: any) {
  const { unit } = useMeasurement();
  
  console.log("=== usePerformanceData DEBUG ===");
  console.log("Input motorcycle:", motorcycle.id);
  console.log("Selected configuration:", selectedConfiguration?.name || selectedConfiguration?.id);
  
  // Get data from the selected configuration if available, otherwise fallback to motorcycle object
  let engineData: any = {};
  let brakeData: any = {};
  let speedData: any = {};
  
  if (selectedConfiguration) {
    console.log("Using configuration data:", selectedConfiguration);
    
    // Engine data from configuration
    if (selectedConfiguration.engines) {
      const engine = selectedConfiguration.engines;
      engineData = {
        displacement_cc: engine.displacement_cc || 0,
        horsepower_hp: engine.power_hp || 0,
        power_rpm: engine.power_rpm,
        torque_nm: engine.torque_nm || 0,
        torque_rpm: engine.torque_rpm,
        engine_type: engine.engine_type,
        cylinder_count: engine.cylinder_count
      };
    }
    
    // Brake data from configuration
    if (selectedConfiguration.brake_systems) {
      const brakes = selectedConfiguration.brake_systems;
      brakeData = {
        brake_type: brakes.type,
        has_abs: brakes.has_traction_control || false
      };
    }
    
    // Speed data - usually from the motorcycle model, not configuration
    speedData = {
      top_speed_kph: motorcycle.top_speed_kph || 0,
      top_speed_mph: motorcycle.top_speed_kph ? motorcycle.top_speed_kph * 0.621371 : 0
    };
  } else {
    console.log("Using fallback motorcycle data");
    
    // Fallback to motorcycle object data
    engineData = {
      displacement_cc: motorcycle.engine_size || motorcycle.displacement_cc || 0,
      horsepower_hp: motorcycle.horsepower || 0,
      power_rpm: motorcycle.power_rpm,
      torque_nm: motorcycle.torque_nm || 0,
      torque_rpm: motorcycle.torque_rpm,
      engine_type: motorcycle.engine_type,
      cylinder_count: motorcycle.cylinder_count
    };
    
    brakeData = {
      brake_type: motorcycle.brake_type,
      has_abs: motorcycle.has_abs || motorcycle.abs || false
    };
    
    speedData = {
      top_speed_kph: motorcycle.top_speed_kph || 0,
      top_speed_mph: motorcycle.top_speed_mph || (motorcycle.top_speed_kph ? motorcycle.top_speed_kph * 0.621371 : 0)
    };
  }

  console.log("Final performance data for formatting:", {
    engineData,
    brakeData,
    speedData
  });

  const result = {
    engineType: formatEngineType(engineData.displacement_cc, engineData.engine_type, engineData.cylinder_count),
    horsepower: formatHorsepower(engineData.horsepower_hp, engineData.power_rpm),
    torque: formatTorque(engineData.torque_nm, engineData.torque_rpm),
    topSpeed: formatTopSpeed(speedData.top_speed_kph, speedData.top_speed_mph, unit),
    brakeSystem: formatBrakeSystem(brakeData.brake_type, brakeData.has_abs),
    unit
  };

  console.log("Formatted performance specifications:", result);
  console.log("=== END usePerformanceData DEBUG ===");

  return result;
}
