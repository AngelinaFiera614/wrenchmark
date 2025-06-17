
export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_id: string;
  component_type: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';
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
