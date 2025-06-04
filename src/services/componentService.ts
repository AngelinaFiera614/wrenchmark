
// Re-export all component-specific services
export * from './engineService';
export * from './brakeService';
export * from './frameService';
export * from './suspensionService';
export * from './wheelService';

// Export specific functions with consistent naming for backward compatibility
export { 
  createBrake as createBrakeSystem,
  fetchBrakes as fetchBrakeSystems 
} from './brakeService';
