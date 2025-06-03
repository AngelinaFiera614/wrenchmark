
import { ColorOption } from "./colors";

export interface TrimColorAssignment {
  id: string;
  configuration_id: string;
  color_option_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  color_options?: ColorOption;
}

export interface ColorAssignmentRequest {
  configuration_id: string;
  color_option_id: string;
  is_default?: boolean;
}

export interface BrandColorVariant {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  hex_code?: string;
  image_url?: string;
  is_metallic: boolean;
  is_pearl: boolean;
  is_matte: boolean;
  year_introduced?: number;
  year_discontinued?: number;
  created_at: string;
  updated_at: string;
}

export interface ColorManagementStats {
  total_brand_colors: number;
  total_model_colors: number;
  total_trim_assignments: number;
  colors_by_brand: Record<string, number>;
}
