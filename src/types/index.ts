
// Export all motorcycle-related types
export * from './motorcycle';
export * from './brand';
export * from './manual';
export * from './category';

// Re-export for backward compatibility
export type { Motorcycle, MotorcycleModel, Configuration, ModelYear, MotorcycleCategory, MotorcycleFilters } from './motorcycle';
export type { Brand, BrandMilestone, LogoHistoryItem, MediaItem, NotableModel } from './brand';
export type { Manual, ManualType, ManualUpload, MotorcyclePlaceholder } from './manual';
export type { CategoryObject } from './category';
