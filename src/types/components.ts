
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
}

export interface SuspensionOption extends ComponentOption {
  front_type?: string;
  rear_type?: string;
  brand?: string;
}

export interface BrakeOption extends ComponentOption {
  type: string;
  has_traction_control?: boolean;
  brake_type_front?: string;
  brake_type_rear?: string;
}

export interface FrameOption extends ComponentOption {
  type: string;
  material?: string;
}

export interface WheelOption extends ComponentOption {
  type?: string;
  front_size?: string;
  rear_size?: string;
}

export interface ComponentsFormState {
  engine: string | null;
  suspension: string | null;
  brakes: string | null;
  frame: string | null;
  wheels: string | null;
}
