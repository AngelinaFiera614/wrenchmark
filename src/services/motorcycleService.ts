
import { Motorcycle } from "@/types";
import { 
  queryMotorcycleBySlug, 
  queryAllMotorcycles, 
  queryMotorcycleByDetails 
} from "./motorcycles/motorcycleQueries";
import { transformMotorcycleData } from "./motorcycles/motorcycleTransforms";
import { createPlaceholderMotorcycle } from "./motorcycles/placeholderService";
import { 
  publishMotorcycle, 
  unpublishMotorcycle, 
  fetchAllMotorcyclesForAdmin 
} from "./motorcycles/adminQueries";

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
    throw error;
  }
};

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  console.log("=== getAllMotorcycles ===");
  
  try {
    const data = await queryAllMotorcycles();
    
    const transformedMotorcycles = data.map(item => transformMotorcycleData(item));
    
    console.log("=== getAllMotorcycles SUMMARY ===");
    console.log("Total motorcycles processed:", transformedMotorcycles.length);
    console.log("Motorcycles with engine data:", transformedMotorcycles.filter(m => m.engine_size > 0).length);
    console.log("Motorcycles with horsepower data:", transformedMotorcycles.filter(m => m.horsepower > 0).length);
    console.log("Motorcycles with weight data:", transformedMotorcycles.filter(m => m.weight_kg > 0).length);
    
    return transformedMotorcycles;
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    throw error;
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

// Re-export admin functions
export { createPlaceholderMotorcycle };
export { publishMotorcycle, unpublishMotorcycle, fetchAllMotorcyclesForAdmin };
