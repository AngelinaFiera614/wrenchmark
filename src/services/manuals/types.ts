
// Basic manual types used across the service

export interface ManualInfo {
  id?: string;
  title: string;
  motorcycle_id: string;
  manual_type?: string;
  year?: number;
  file_size_mb?: number;
  file_url?: string;
  file_name?: string; // Added for import functionality
}

export interface ManualWithMotorcycle extends ManualInfo {
  motorcycle_name?: string;
  downloads?: number;
}

export interface ImportManualParams extends ManualInfo {
  file_name: string; // Required for import
}

export interface ManualUploadParams extends ManualInfo {
  // Any additional params specific to uploading
}

export interface ManualUpdateParams {
  id: string;
  title?: string;
  motorcycle_id?: string;
  manual_type?: string;
  year?: number;
  file_size_mb?: number;
}
