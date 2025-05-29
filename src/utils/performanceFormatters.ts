
/**
 * Utilities for formatting motorcycle performance specifications
 */

export const formatEngineSize = (engine_cc?: number, displacement_cc?: number): string => {
  const displacement = engine_cc || displacement_cc;
  if (!displacement || displacement <= 0) return "N/A";
  return `${displacement} cc`;
};

export const formatHorsepower = (horsepower_hp?: number, power_rpm?: number): string => {
  if (!horsepower_hp || horsepower_hp <= 0) return "N/A";
  
  if (power_rpm && power_rpm > 0) {
    return `${horsepower_hp} hp at ${power_rpm.toLocaleString()} rpm`;
  }
  
  return `${horsepower_hp} hp`;
};

export const formatTorque = (torque_nm?: number, torque_rpm?: number): string => {
  if (!torque_nm || torque_nm <= 0) return "N/A";
  
  if (torque_rpm && torque_rpm > 0) {
    return `${torque_nm} Nm at ${torque_rpm.toLocaleString()} rpm`;
  }
  
  return `${torque_nm} Nm`;
};

export const formatEngineType = (
  displacement_cc?: number, 
  engine_type?: string, 
  cylinder_count?: number
): string => {
  const parts = [];
  
  if (displacement_cc) {
    parts.push(`${displacement_cc}cc`);
  }
  
  if (engine_type) {
    parts.push(engine_type);
  } else if (cylinder_count) {
    // Fallback based on cylinder count
    switch (cylinder_count) {
      case 1: parts.push('Single-Cylinder'); break;
      case 2: parts.push('Twin'); break;
      case 3: parts.push('Triple'); break;
      case 4: parts.push('Inline-4'); break;
      default: parts.push(`${cylinder_count}-Cylinder`);
    }
  }
  
  return parts.length > 0 ? parts.join(' ') : "N/A";
};

export const formatBrakeSystem = (brake_type?: string, has_abs?: boolean): string => {
  if (brake_type && brake_type !== 'Standard Brakes') {
    return brake_type;
  }
  
  if (has_abs === true) {
    return "ABS Brakes";
  } else if (has_abs === false) {
    return "Standard Brakes";
  }
  
  return "N/A";
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
