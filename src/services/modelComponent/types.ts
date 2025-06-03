
export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_type: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';
  component_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComponentUsageStats {
  id: string;
  component_type: string;
  component_id: string;
  usage_count: number;
  model_count: number;
  trim_count: number;
  last_used_at: string | null;
}

export interface EffectiveComponents {
  engine_id: string | null;
  brake_system_id: string | null;
  frame_id: string | null;
  suspension_id: string | null;
  wheel_id: string | null;
  engine_inherited: boolean;
  brake_system_inherited: boolean;
  frame_inherited: boolean;
  suspension_inherited: boolean;
  wheel_inherited: boolean;
}
