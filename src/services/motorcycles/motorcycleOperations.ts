
import { Motorcycle } from "@/types";
import { 
  queryMotorcycleBySlug, 
  queryAllMotorcycles, 
  queryMotorcycleByDetails 
} from "./motorcycleQueries";
import { transformMotorcycleData } from "./motorcycleTransforms";

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  console.log("=== getMotorcycleBySlug ===");
  console.log("Fetching motorcycle with slug:", slug);
  
  try {
    const data = await queryMotorcycleBySlug(slug);
    
    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }
    
    const motorcycle = transformMotorcycleData(data);
    console.log("Successfully transformed motorcycle:", motorcycle.make, motorcycle.model);
    
    return motorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    // Don't throw - let the UI handle gracefully
    return null;
  }
};

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  console.log("=== getAllMotorcycles ===");
  
  try {
    const data = await queryAllMotorcycles();
    
    if (!data || data.length === 0) {
      console.log("No motorcycles found in database");
      return [];
    }
    
    const transformedMotorcycles: Motorcycle[] = [];
    const errors: string[] = [];
    
    for (const item of data) {
      try {
        const transformed = transformMotorcycleData(item);
        transformedMotorcycles.push(transformed);
      } catch (transformError) {
        console.error(`Failed to transform motorcycle ${item.name}:`, transformError);
        errors.push(`${item.name}: ${transformError instanceof Error ? transformError.message : 'Unknown error'}`);
      }
    }
    
    console.log("=== getAllMotorcycles SUMMARY ===");
    console.log("Total raw motorcycles:", data.length);
    console.log("Successfully transformed:", transformedMotorcycles.length);
    console.log("Transformation errors:", errors.length);
    if (errors.length > 0) {
      console.log("Errors:", errors);
    }
    
    const validMotorcycles = transformedMotorcycles.filter(m => !m.is_placeholder);
    console.log("Valid motorcycles (non-placeholder):", validMotorcycles.length);
    console.log("Motorcycles with engine data:", transformedMotorcycles.filter(m => m.engine_size > 0).length);
    console.log("Motorcycles with horsepower data:", transformedMotorcycles.filter(m => m.horsepower > 0).length);
    console.log("Motorcycles with weight data:", transformedMotorcycles.filter(m => m.weight_kg > 0).length);
    
    return transformedMotorcycles;
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    // Return empty array instead of throwing to prevent complete failure
    return [];
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    const data = await queryMotorcycleByDetails(make, model, year);
    
    if (!data) {
      return null;
    }
    
    return transformMotorcycleData(data);
  } catch (error) {
    console.error("Error in findMotorcycleByDetails:", error);
    return null;
  }
};
