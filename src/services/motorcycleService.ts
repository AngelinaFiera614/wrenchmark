
// Main entry point for motorcycle services - simplified to just re-export functions
export { 
  getMotorcycleBySlug, 
  getAllMotorcycles, 
  findMotorcycleByDetails 
} from "./motorcycles/motorcycleOperations";

export { createPlaceholderMotorcycle } from "./motorcycles/placeholderService";

export { 
  publishMotorcycle, 
  unpublishMotorcycle, 
  fetchAllMotorcyclesForAdmin 
} from "./motorcycles/adminQueries";
