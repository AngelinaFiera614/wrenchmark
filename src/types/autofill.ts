
export interface ModelSuggestion {
  id: string;
  motorcycle_model_id: string;
  suggested_data: Record<string, any>;
  source?: string;
  fetched_at: string;
  expires_at: string;
  created_by?: string;
  created_at: string;
}

export interface ModelFetchLog {
  id: string;
  motorcycle_model_id: string;
  user_id: string;
  action_type: 'fetch' | 'apply' | 'ignore';
  applied_fields: Record<string, any>;
  rejected_fields: Record<string, any>;
  source?: string;
  notes?: string;
  created_at: string;
}

export interface SuggestionField {
  field: string;
  currentValue: any;
  suggestedValue: any;
  isSelected: boolean;
  isEdited: boolean;
  editedValue?: any;
}

export interface FetchedModelData {
  name?: string;
  type?: string;
  engine_size?: number;
  horsepower?: number;
  torque_nm?: number;
  top_speed_kph?: number;
  weight_kg?: number;
  seat_height_mm?: number;
  fuel_capacity_l?: number;
  has_abs?: boolean;
  base_description?: string;
  default_image_url?: string;
  production_start_year?: number;
  production_end_year?: number;
}
