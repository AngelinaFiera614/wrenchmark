
export type ComponentType = 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';

export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_id: string;
  component_type: ComponentType;
  assignment_type: string;
  is_default: boolean;
  effective_from_year?: number;
  effective_to_year?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ComponentUsage {
  componentId: string;
  componentType: string;
  usageCount: number;
  usedInModels: string[];
  usedInConfigurations: string[];
}

export interface ComponentUsageStats {
  id: string;
  component_id: string;
  component_type: string;
  usage_count: number;
  model_count: number;
  trim_count: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EffectiveComponents {
  engine_id?: string;
  brake_system_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
  engine_source?: 'model' | 'trim';
  brake_system_source?: 'model' | 'trim';
  frame_source?: 'model' | 'trim';
  suspension_source?: 'model' | 'trim';
  wheel_source?: 'model' | 'trim';
}
