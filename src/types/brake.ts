
export interface BrakeSystem {
  id: string;
  type: string;
  has_traction_control: boolean;
  brake_type_front: string;
  brake_type_rear: string;
  notes?: string;
}
