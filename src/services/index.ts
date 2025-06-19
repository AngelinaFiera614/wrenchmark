
// Domain services
export { MotorcycleService } from './domain/MotorcycleService';
export { BrandService } from './domain/BrandService';

// Base service types and classes
export { BaseDataService } from './base/BaseDataService';
export type { ServiceResponse, PaginatedResponse } from './base/BaseDataService';

// Legacy services - gradually migrate away from these
export * from './motorcycles';
export * from './colorManagementService';
export * from './dataAccessService';
