
import { supabase } from "@/integrations/supabase/client";
import { MotorcycleModel } from "@/types/motorcycle";

export const fetchAllMotorcycleModels = async (): Promise<MotorcycleModel[]> => {
  console.log("=== fetchAllMotorcycleModels ===");
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        id,
        brand_id,
        name,
        type,
        base_description,
        production_start_year,
        production_end_year,
        production_status,
        default_image_url,
        slug,
        ignore_autofill,
        is_draft,
        created_at,
        updated_at,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        )
      `)
      .order('name');

    if (error) {
      console.error("Database error fetching motorcycle models:", error);
      throw new Error(`Failed to fetch motorcycle models: ${error.message}`);
    }

    console.log("Successfully fetched motorcycle models, count:", data?.length || 0);
    
    // Transform the data to match our expected structure
    const transformedData = data?.map(model => ({
      ...model,
      brand: model.brands
    })) || [];

    return transformedData;
  } catch (error) {
    console.error("Error in fetchAllMotorcycleModels:", error);
    throw error;
  }
};

export const fetchMotorcycleModelBySlug = async (slug: string): Promise<MotorcycleModel | null> => {
  console.log("=== fetchMotorcycleModelBySlug ===");
  console.log("Fetching motorcycle model with slug:", slug);

  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        id,
        brand_id,
        name,
        type,
        base_description,
        production_start_year,
        production_end_year,
        production_status,
        default_image_url,
        slug,
        ignore_autofill,
        is_draft,
        created_at,
        updated_at,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        ),
        years:model_years(
          *,
          configurations:model_configurations(
            *,
            engines:engine_id(
              id,
              name,
              displacement_cc,
              power_hp,
              torque_nm,
              engine_type,
              power_rpm,
              torque_rpm,
              cylinder_count,
              cooling,
              fuel_system
            ),
            brake_systems:brake_system_id(
              id,
              type,
              brake_type_front,
              brake_type_rear,
              has_traction_control
            ),
            frames:frame_id(
              id,
              type,
              material
            ),
            suspensions:suspension_id(
              id,
              front_type,
              rear_type,
              brand
            ),
            wheels:wheel_id(
              id,
              type,
              front_size,
              rear_size,
              rim_material
            )
          ),
          color_options(
            id,
            name,
            hex_code
          )
        )
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error("Database error fetching motorcycle model by slug:", error);
      throw new Error(`Failed to fetch motorcycle model: ${error.message}`);
    }

    if (!data) {
      console.log("No motorcycle model found with slug:", slug);
      return null;
    }

    console.log("Successfully fetched motorcycle model data for slug:", slug);
    
    // Transform the data to match our expected structure
    const transformedData = {
      ...data,
      brand: data.brands
    };

    return transformedData;
  } catch (error) {
    console.error("Error in fetchMotorcycleModelBySlug:", error);
    throw error;
  }
};

export const deleteMotorcycleModelCascade = async (modelId: string): Promise<boolean> => {
  try {
    console.log("Deleting motorcycle model with cascade:", modelId);
    
    const { error } = await supabase.rpc('delete_motorcycle_model_cascade', {
      model_id_param: modelId
    });

    if (error) {
      console.error("Error in cascade delete:", error);
      throw error;
    }

    console.log("Successfully deleted motorcycle model with cascade");
    return true;
  } catch (error) {
    console.error("Failed to delete motorcycle model:", error);
    return false;
  }
};
