
import { Motorcycle } from "@/types";
import { 
  fetchAllMotorcycles,
  fetchMotorcycleBySlug,
  fetchMotorcycleById,
  fetchMotorcyclesByIds,
  fetchMotorcycleByDetails,
  insertPlaceholderMotorcycle
} from "./motorcycles/motorcycleQueries";
import { 
  transformMotorcycleData,
  createPlaceholderMotorcycleData
} from "./motorcycles/motorcycleTransforms";

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    const data = await fetchAllMotorcycles();
    return data.map(transformMotorcycleData);
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    return [];
  }
};

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await fetchMotorcycleBySlug(slug);
    
    if (error) {
      console.error("Error fetching motorcycle by slug:", error);
      
      // If slug lookup fails, try finding by ID as fallback
      const { data: fallbackData, error: fallbackError } = await fetchMotorcycleById(slug);
      
      if (fallbackError) {
        console.error("Error in fallback motorcycle lookup:", fallbackError);
        return null;
      }
      
      if (fallbackData) {
        return transformMotorcycleData(fallbackData);
      }
      
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return transformMotorcycleData(data);
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    return null;
  }
};

export const getMotorcyclesByIds = async (ids: string[]): Promise<Motorcycle[]> => {
  try {
    const { data, error } = await fetchMotorcyclesByIds(ids);
    
    if (error) {
      console.error("Error fetching motorcycles by IDs:", error);
      return [];
    }
    
    return data.map(transformMotorcycleData);
  } catch (error) {
    console.error("Error in getMotorcyclesByIds:", error);
    return [];
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await fetchMotorcycleByDetails(model, year);
    
    if (error) {
      console.error("Error finding motorcycle by details:", error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return transformMotorcycleData(data);
  } catch (error) {
    console.error("Error in findMotorcycleByDetails:", error);
    return null;
  }
};

export const createPlaceholderMotorcycle = async (motorcycleData: {
  make: string;
  model: string;
  year: number;
}): Promise<Motorcycle> => {
  try {
    const insertData = createPlaceholderMotorcycleData(motorcycleData);
    const { data, error } = await insertPlaceholderMotorcycle(insertData);
    
    if (error) {
      console.error("Error creating placeholder motorcycle:", error);
      throw error;
    }
    
    return {
      ...transformMotorcycleData(data),
      make: motorcycleData.make
    };
  } catch (error) {
    console.error("Error in createPlaceholderMotorcycle:", error);
    throw error;
  }
};
