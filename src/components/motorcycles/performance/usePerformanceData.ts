
import { useMeasurement } from "@/context/MeasurementContext";
import { Motorcycle } from "@/types";
import {
  formatEngineSize,
  formatHorsepower,
  formatTorque,
  formatTopSpeed
} from "@/utils/performanceFormatters";

export function usePerformanceData(motorcycle: Motorcycle) {
  const { unit } = useMeasurement();
  
  const {
    engine_cc,
    displacement_cc,
    horsepower_hp,
    torque_nm,
    top_speed_kph,
    top_speed_mph
  } = motorcycle;

  return {
    engineSize: formatEngineSize(engine_cc, displacement_cc),
    horsepower: formatHorsepower(horsepower_hp),
    torque: formatTorque(torque_nm),
    topSpeed: formatTopSpeed(top_speed_kph, top_speed_mph, unit),
    unit
  };
}
