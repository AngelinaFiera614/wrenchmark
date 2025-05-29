
import { Motorcycle } from "@/types";
import { 
  fetchAllMotorcycles,
  fetchAllMotorcyclesForAdmin,
  fetchMotorcycleBySlug,
  fetchMotorcycleBySlugForAdmin,
  fetchMotorcycleById,
  fetchMotorcycleByIdForAdmin,
  fetchMotorcyclesByIds,
  fetchMotorcyclesByIdsForAdmin,
  fetchMotorcycleByDetails,
  insertPlaceholderMotorcycle,
  updateMotorcycleDraftStatus
} from "./motorcycles/motorcycleQueries";
import { 
  transformMotorcycleData,
  createPlaceholderMotorcycleData,
  createDraftMotorcycleData
} from "./motorcycles/motorcycleTransforms";

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    console.log("Service: Starting getAllMotorcycles (published only)...");
    const data = await fetchAllMotorcycles();
    console.log("Service: Raw data received:", data?.length, "items");
    
    if (!data || data.length === 0) {
      console.warn("Service: No motorcycle data received from database");
      return [];
    }
    
    const transformedData = data.map(transformMotorcycleData);
    console.log("Service: Transformed data:", transformedData?.length, "motorcycles");
    console.log("Service: Sample transformed motorcycle:", transformedData[0]);
    
    return transformedData;
  } catch (error) {
    console.error("Service: Error in getAllMotorcycles:", error);
    return [];
  }
};

export const getAllMotorcyclesForAdmin = async (): Promise<Motorcycle[]> => {
  try {
    console.log("Service: Starting getAllMotorcyclesForAdmin (including drafts)...");
    const data = await fetchAllMotorcyclesForAdmin();
    console.log("Service: Raw admin data received:", data?.length, "items");
    
    if (!data || data.length === 0) {
      console.warn("Service: No motorcycle data received from database for admin");
      return [];
    }
    
    const transformedData = data.map(transformMotorcycleData);
    console.log("Service: Transformed admin data:", transformedData?.length, "motorcycles");
    
    return transformedData;
  } catch (error) {
    console.error("Service: Error in getAllMotorcyclesForAdmin:", error);
    return [];
  }
};

export const getMotorcycleBySlug = async (slug: string, isAdmin: boolean = false): Promise<Motorcycle | null> => {
  try {
    const { data, error } = isAdmin 
      ? await fetchMotorcycleBySlugForAdmin(slug)
      : await fetchMotorcycleBySlug(slug);
    
    if (error) {
      console.error("Error fetching motorcycle by slug:", error);
      
      // If slug lookup fails, try finding by ID as fallback
      const { data: fallbackData, error: fallbackError } = isAdmin
        ? await fetchMotorcycleByIdForAdmin(slug)
        : await fetchMotorcycleById(slug);
      
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

export const getMotorcyclesByIds = async (ids: string[], isAdmin: boolean = false): Promise<Motorcycle[]> => {
  try {
    const { data, error } = isAdmin
      ? await fetchMotorcyclesByIdsForAdmin(ids)
      : await fetchMotorcyclesByIds(ids);
    
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

export const createDraftMotorcycle = async (name: string, brandId: string): Promise<Motorcycle> => {
  try {
    const insertData = createDraftMotorcycleData(name, brandId);
    const { data, error } = await insertPlaceholderMotorcycle(insertData);
    
    if (error) {
      console.error("Error creating draft motorcycle:", error);
      throw error;
    }
    
    return transformMotorcycleData(data);
  } catch (error) {
    console.error("Error in createDraftMotorcycle:", error);
    throw error;
  }
};

export const publishMotorcycle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await updateMotorcycleDraftStatus(id, false);
    
    if (error) {
      console.error("Error publishing motorcycle:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in publishMotorcycle:", error);
    return false;
  }
};

export const unpublishMotorcycle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await updateMotorcycleDraftStatus(id, true);
    
    if (error) {
      console.error("Error unpublishing motorcycle:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in unpublishMotorcycle:", error);
    return false;
  }
};
