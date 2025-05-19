
// Basic manual types used across the service

export interface ManualInfo {
  id?: string;
  title?: string;
  motorcycle_id?: string; // Now optional
  manual_type?: string;
  year?: number;
  file_size_mb?: number;
  file_url?: string;
  file_name?: string;
  tags?: string[];
  // Added for direct storage on manual
  make?: string;
  model?: string;
}

export interface ManualWithMotorcycle extends ManualInfo {
  motorcycle_name?: string;
  downloads?: number;
  tags?: string[];
  tag_details?: ManualTag[];
  motorcycles?: {
    model_name: string;
  };
}

export interface ImportManualParams extends ManualInfo {
  file_name: string; // Required for import
  // Added for manual metadata
  make?: string;
  model?: string;
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
  tags?: string[];
  // Added for direct storage on manual
  make?: string;
  model?: string;
}

// Tag related interfaces
export interface ManualTag {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface TagAssociation {
  manual_id: string;
  tag_id: string;
}
