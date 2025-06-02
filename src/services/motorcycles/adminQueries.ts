
import { supabase } from "@/integrations/supabase/client";
import { MOTORCYCLE_SELECT_QUERY } from "./motorcycleQueries";

export const fetchAllMotorcyclesForAdmin = async () => {
  console.log("=== fetchAllMotorcyclesForAdmin ===");
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .order('name');

  if (error) {
    console.error("Error fetching motorcycles for admin:", error);
    throw error;
  }

  console.log("Admin motorcycles data count:", data?.length || 0);
  return data || [];
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
