
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
  
  const {
    engine_cc,
    displacement_cc,
    horsepower_hp,
    power_rpm,
    torque_nm,
    torque_rpm,
    top_speed_kph,
    top_speed_mph,
    engine_type,
    cylinder_count,
    brake_type,
    has_abs
  } = motorcycle;

  return {
    engineType: formatEngineType(engine_cc || displacement_cc, engine_type, cylinder_count),
    horsepower: formatHorsepower(horsepower_hp, power_rpm),
    torque: formatTorque(torque_nm, torque_rpm),
    topSpeed: formatTopSpeed(top_speed_kph, top_speed_mph, unit),
    brakeSystem: formatBrakeSystem(brake_type, has_abs),
    unit
  };
}
