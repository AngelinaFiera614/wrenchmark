
export type ManualType = "owner" | "service" | "wiring";

export interface Manual {
  id: string;
  title: string;
  manual_type: ManualType;
  file_url: string;
  file_size_mb: number | null;
  motorcycle_id: string;
  year: number | null;
  downloads: number;
  created_at?: string;
  updated_at?: string;
}

export interface ManualUpload {
  title: string;
  manual_type: ManualType;
  motorcycle_id: string;
  year: number | null;
  file_size_mb: number | null;
}

export interface MotorcyclePlaceholder {
  make: string;
  model: string;
  year: number;
}
