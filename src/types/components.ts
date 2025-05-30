
// Component selection interfaces for admin 

export interface ComponentOption {
  id: string;
  name: string;
  description?: string;
}

export interface EngineOption extends ComponentOption {
  displacement_cc: number;
  power_hp?: number;
  torque_nm?: number;
  engine_type?: string;
  power_rpm?: number;
  torque_rpm?: number;
  valve_count?: number;
  cylinder_count?: number;
  cooling?: string;
  fuel_system?: string;
  stroke_type?: string;
  bore_mm?: number;
  stroke_mm?: number;
  compression_ratio?: string;
  valves_per_cylinder?: number;
}

export interface SuspensionOption extends ComponentOption {
  front_type?: string;
  rear_type?: string;
  brand?: string;
  adjustability?: string;
  front_travel_mm?: number;
  rear_travel_mm?: number;
  front_brand?: string;
  rear_brand?: string;
}

export interface BrakeOption extends ComponentOption {
  type: string;
  has_traction_control?: boolean;
  brake_type_front?: string;
  brake_type_rear?: string;
  front_disc_size_mm?: number;
  rear_disc_size_mm?: number;
  brake_brand?: string;
  caliper_type?: string;
}

export interface FrameOption extends ComponentOption {
  type: string;
  material?: string;
  notes?: string;
  rake_degrees?: number;
  trail_mm?: number;
  construction_method?: string;
}

export interface WheelOption extends ComponentOption {
  type?: string;
  front_size?: string;
  rear_size?: string;
  front_tire_size?: string;
  rear_tire_size?: string;
  rim_material?: string;
  spoke_count_front?: number;
  spoke_count_rear?: number;
  notes?: string;
}

export interface ComponentsFormState {
  engine: string | null;
  suspension: string | null;
  brakes: string | null;
  frame: string | null;
  wheels: string | null;
}
