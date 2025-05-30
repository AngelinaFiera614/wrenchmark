
export type PhotoContext = 
  | 'studio' 
  | 'action' 
  | 'event' 
  | 'historic' 
  | 'dealership' 
  | 'press' 
  | 'user_submitted';

export type MediaType = 
  | 'image' 
  | 'video' 
  | 'document' 
  | 'brochure' 
  | 'manual';

export type VideoType = 
  | 'review' 
  | 'test_ride' 
  | 'promotional' 
  | 'documentary' 
  | 'tutorial' 
  | 'comparison' 
  | 'walkaround';

export type DocumentType = 
  | 'brochure' 
  | 'manual' 
  | 'spec_sheet' 
  | 'press_release' 
  | 'catalog' 
  | 'parts_diagram';

export type CollectionType = 
  | 'launch_event' 
  | 'press_kit' 
  | 'model_year' 
  | 'color_variant' 
  | 'historical';

export interface EnhancedMotorcycleImage {
  id: string;
  motorcycle_id?: string;
  model_year_id?: string;
  configuration_id?: string;
  file_name: string;
  file_url: string;
  alt_text?: string;
  caption?: string;
  angle?: string;
  style?: string;
  color?: string;
  year?: number;
  brand?: string;
  model?: string;
  is_primary: boolean;
  is_featured: boolean;
  file_size_bytes?: number;
  width_px?: number;
  height_px?: number;
  mime_type?: string;
  photo_context?: PhotoContext;
  color_code?: string;
  year_captured?: number;
  media_type: MediaType;
  video_url?: string;
  document_url?: string;
  historical_significance?: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ColorVariant {
  id: string;
  brand_id: string;
  name: string;
  color_code: string;
  hex_code?: string;
  year_introduced?: number;
  year_discontinued?: number;
  description?: string;
  is_metallic: boolean;
  is_pearl: boolean;
  is_matte: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MotorcycleVideo {
  id: string;
  motorcycle_id?: string;
  model_year_id?: string;
  configuration_id?: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  video_type?: VideoType;
  quality?: '480p' | '720p' | '1080p' | '4k';
  year_captured?: number;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MotorcycleDocument {
  id: string;
  motorcycle_id?: string;
  model_year_id?: string;
  title: string;
  description?: string;
  document_type?: DocumentType;
  document_url: string;
  thumbnail_url?: string;
  file_size_bytes?: number;
  page_count?: number;
  language: string;
  year_published?: number;
  is_official: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface MediaCollection {
  id: string;
  motorcycle_id?: string;
  name: string;
  description?: string;
  collection_type?: CollectionType;
  year?: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaCollectionItem {
  id: string;
  collection_id: string;
  image_id?: string;
  video_id?: string;
  document_id?: string;
  sort_order: number;
  created_at: string;
}

export interface MediaFilters {
  angle?: string[];
  context?: PhotoContext[];
  color?: string[];
  year?: number[];
  mediaType?: MediaType[];
  videoType?: VideoType[];
  documentType?: DocumentType[];
  isHistoric?: boolean;
  isFeatured?: boolean;
}

export interface MediaUploadData {
  file: File;
  mediaType: MediaType;
  angle?: string;
  context?: PhotoContext;
  colorCode?: string;
  yearCaptured?: number;
  historicalSignificance?: string;
  isPrimary?: boolean;
  isFeatured?: boolean;
}
