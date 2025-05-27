
/**
 * Utilities for formatting motorcycle performance specifications
 */

export const formatEngineSize = (engine_cc?: number, displacement_cc?: number): string => {
  const displacement = engine_cc || displacement_cc;
  if (!displacement || displacement <= 0) return "N/A";
  return `${displacement} cc`;
};

export const formatHorsepower = (horsepower_hp?: number): string => {
  if (!horsepower_hp || horsepower_hp <= 0) return "N/A";
  return `${horsepower_hp} hp`;
};

export const formatTorque = (torque_nm?: number): string => {
  if (!torque_nm || torque_nm <= 0) return "N/A";
  return `${torque_nm} Nm`;
};

export const formatTopSpeed = (
  top_speed_kph?: number,
  top_speed_mph?: number,
  unit: "metric" | "imperial" = "metric"
): string => {
  if (unit === "metric") {
    if (!top_speed_kph || top_speed_kph <= 0) return "N/A";
    return `${top_speed_kph} km/h`;
  } else {
    if (!top_speed_mph || top_speed_mph <= 0) return "N/A";
    return `${top_speed_mph} mph`;
  }
};
