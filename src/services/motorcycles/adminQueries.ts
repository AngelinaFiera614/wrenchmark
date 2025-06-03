
import { supabase } from "@/integrations/supabase/client";

// Simplified admin query that focuses on essential data
export const ADMIN_MOTORCYCLE_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  ),
  years:model_years(
    id,
    year,
    configurations:model_configurations(
      id,
      name,
      seat_height_mm,
      weight_kg,
      wheelbase_mm,
      fuel_capacity_l,
      ground_clearance_mm,
      is_default
    )
  )
`;

export const fetchAllMotorcyclesForAdmin = async () => {
  console.log("=== fetchAllMotorcyclesForAdmin ===");
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(ADMIN_MOTORCYCLE_SELECT_QUERY)
      .order('name');

    if (error) {
      console.error("Database error fetching motorcycles for admin:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Admin query failed: ${error.message}`);
    }

    console.log("Admin motorcycles data count:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in fetchAllMotorcyclesForAdmin:", error);
    throw error;
  }
};

export const fetchMotorcycleForAdminEdit = async (id: string) => {
  console.log("=== fetchMotorcycleForAdminEdit ===");
  console.log("Fetching motorcycle with ID:", id);

  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(ADMIN_MOTORCYCLE_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Database error fetching motorcycle for edit:", error);
      throw new Error(`Failed to fetch motorcycle for editing: ${error.message}`);
    }

    if (!data) {
      console.log("No motorcycle found with ID:", id);
      return null;
    }

    console.log("Admin edit motorcycle data:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchMotorcycleForAdminEdit:", error);
    throw error;
  }
};

export const publishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  console.log("=== publishMotorcycle ===");
  console.log("Publishing motorcycle with ID:", motorcycleId);

  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ 
        is_draft: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', motorcycleId);

    if (error) {
      console.error("Database error publishing motorcycle:", error);
      throw new Error(`Failed to publish motorcycle: ${error.message}`);
    }

    console.log("Successfully published motorcycle:", motorcycleId);
    return true;
  } catch (error) {
    console.error("Error in publishMotorcycle:", error);
    return false;
  }
};

export const unpublishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  console.log("=== unpublishMotorcycle ===");
  console.log("Unpublishing motorcycle with ID:", motorcycleId);

  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ 
        is_draft: true, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', motorcycleId);

    if (error) {
      console.error("Database error unpublishing motorcycle:", error);
      throw new Error(`Failed to unpublish motorcycle: ${error.message}`);
    }

    console.log("Successfully unpublished motorcycle:", motorcycleId);
    return true;
  } catch (error) {
    console.error("Error in unpublishMotorcycle:", error);
    return false;
  }
};
