
export interface StateRule {
  state_code: string;
  state_name: string;
  permit_age_min: number | null;
  helmet_required: boolean;
  special_rules: string | null;
  road_test_required: boolean;
  link_to_dmv: string | null;
  created_at: string;
  updated_at: string;
}
