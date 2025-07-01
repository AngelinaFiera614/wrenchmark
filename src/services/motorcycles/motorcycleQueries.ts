import { supabase } from "@/integrations/supabase/client";

// Simplified query that gets basic motorcycle data with brands - fixed brand column reference
export const MOTORCYCLE_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  )
`;

// Enhanced query for detailed motorcycle data with all relationships - fixed brand column reference
export const MOTORCYCLE_DETAIL_SELECT_QUERY = `
  *,
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
`;

export const queryMotorcycleBySlug = async (slug: string) => {
  console.log("=== queryMotorcycleBySlug ===");
  console.log("Fetching motorcycle with slug:", slug);

  try {
    // Use detailed query for individual motorcycle pages
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_DETAIL_SELECT_QUERY)
      .eq('slug', slug)
      .eq('is_draft', false)
      .maybeSingle();

    if (error) {
      console.error("Database error fetching motorcycle by slug:", error);
      throw new Error(`Failed to fetch motorcycle: ${error.message}`);
    }

    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }

    console.log("Successfully fetched motorcycle data for slug:", slug);
    return data;
  } catch (error) {
    console.error("Error in queryMotorcycleBySlug:", error);
    throw error;
  }
};

export const queryAllMotorcycles = async () => {
  console.log("=== queryAllMotorcycles ===");
  
  try {
    // First, get basic motorcycle data - use proper brand relationship
    const { data: basicData, error: basicError } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_SELECT_QUERY)
      .eq('is_draft', false)
      .order('name');

    if (basicError) {
      console.error("Database error fetching basic motorcycles:", basicError);
      throw new Error(`Failed to fetch motorcycles: ${basicError.message}`);
    }

    if (!basicData || basicData.length === 0) {
      console.log("No motorcycles found in basic query");
      return [];
    }

    console.log("Basic motorcycles fetched:", basicData.length);

    // Then try to enhance with component data for those that have it
    const enhancedData = [];
    
    for (const motorcycle of basicData) {
      try {
        // Try to get enhanced data for this motorcycle
        const { data: detailedData, error: detailError } = await supabase
          .from('motorcycle_models')
          .select(`
            *,
            brands!motorcycle_models_brand_id_fkey(id, name, slug),
            years:model_years!inner(
              *,
              configurations:model_configurations(
                *,
                engines:engine_id(displacement_cc, power_hp, torque_nm, engine_type),
                brake_systems:brake_system_id(type, has_traction_control)
              )
            )
          `)
          .eq('id', motorcycle.id)
          .maybeSingle();

        if (detailError) {
          console.log(`Could not fetch detailed data for ${motorcycle.name}, using basic data:`, detailError.message);
          enhancedData.push(motorcycle);
        } else if (detailedData) {
          enhancedData.push(detailedData);
        } else {
          enhancedData.push(motorcycle);
        }
      } catch (enhanceError) {
        console.log(`Enhancement failed for ${motorcycle.name}, using basic data:`, enhanceError);
        enhancedData.push(motorcycle);
      }
    }

    console.log("Successfully fetched motorcycles, count:", enhancedData.length);
    return enhancedData;
  } catch (error) {
    console.error("Error in queryAllMotorcycles:", error);
    
    // Fallback: try to get just the basic data without any relationships
    try {
      console.log("Attempting fallback query...");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('motorcycle_models')
        .select(`
          *,
          brands!motorcycle_models_brand_id_fkey(id, name, slug)
        `)
        .eq('is_draft', false)
        .order('name');

      if (fallbackError) {
        throw fallbackError;
      }

      console.log("Fallback query successful, count:", fallbackData?.length || 0);
      return fallbackData || [];
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      throw error;
    }
  }
};

export const queryMotorcycleByDetails = async (make: string, model: string, year: number) => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_SELECT_QUERY)
      .ilike('name', `%${model}%`)
      .eq('brands.name', make)
      .gte('production_start_year', year - 2)
      .lte('production_end_year', year + 2)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error("Database error in queryMotorcycleByDetails:", error);
      throw new Error(`Failed to fetch motorcycle by details: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error("Error in queryMotorcycleByDetails:", error);
    return null;
  }
};
