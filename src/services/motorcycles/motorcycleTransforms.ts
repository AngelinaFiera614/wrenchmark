
// Re-export all transform functionality from the new modular structure
export * from "./transforms";

// For backward compatibility, also export the main transform function
export { transformToMotorcycle as transformMotorcycleData } from "./transforms/motorcycleTransform";
