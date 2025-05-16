
// Basic manual types used across the service

export interface ManualInfo {
  id?: string;
  title: string;
  motorcycle_id: string;
  manual_type?: string;
  year?: number;
  file_size_mb?: number;
  file_url?: string;
}

export interface ManualWithMotorcycle extends ManualInfo {
  motorcycle_name?: string;
  downloads?: number;
}
