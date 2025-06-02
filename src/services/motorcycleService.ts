import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";
import { fetchMotorcycleBySlug } from "./motorcycles/motorcycleQueries";
import { transformMotorcycleData } from "./motorcycles/motorcycleTransforms";

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  console.log("=== getMotorcycleBySlug DEBUG ===");
  console.log("Fetching motorcycle with slug:", slug);
  
  try {
    const { data, error } = await fetchMotorcycleBySlug(slug);
    
    if (error) {
      console.error("Error fetching motorcycle:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }
    
    console.log("Raw motorcycle data:", data);
    
    // Transform the data to match our Motorcycle interface
    const motorcycle = transformMotorcycleData(data);
    
    console.log("Final motorcycle object:", motorcycle);
    console.log("=== END getMotorcycleBySlug DEBUG ===");
    
    return motorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    throw error;
  }
};

export const publishMotorcycle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .eq('id', id);
      
    return !error;
  } catch (error) {
    console.error("Error publishing motorcycle:", error);
    return false;
  }
};

export const unpublishMotorcycle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: true })
      .eq('id', id);
      
    return !error;
  } catch (error) {
    console.error("Error unpublishing motorcycle:", error);
    return false;
  }
};
