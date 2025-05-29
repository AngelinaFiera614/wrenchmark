
import { MotorcycleModel } from "@/types/motorcycle";
import { 
  fetchAllMotorcycleModels, 
  fetchMotorcycleModelBySlug 
} from "./models/modelQueries";
import { 
  createModelYear, 
  createConfiguration 
} from "./models/modelOperations";
import { getModelsForComparison } from "./models/modelComparison";

// Fetch all motorcycle models
export const getAllMotorcycleModels = async (): Promise<MotorcycleModel[]> => {
  const data = await fetchAllMotorcycleModels();
  return data as unknown as MotorcycleModel[];
};

// Get a specific motorcycle model by slug with years and configurations
export const getMotorcycleModelBySlug = async (slug: string): Promise<MotorcycleModel | null> => {
  const data = await fetchMotorcycleModelBySlug(slug);
  return data as unknown as MotorcycleModel;
};

// Re-export operations
export { createModelYear, createConfiguration } from "./models/modelOperations";

// Re-export comparison functions
export { getModelsForComparison } from "./models/modelComparison";
