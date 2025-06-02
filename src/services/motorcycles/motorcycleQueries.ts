
import { supabase } from "@/integrations/supabase/client";

const MOTORCYCLE_MODEL_SELECT_QUERY = `
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
  engine_size,
  horsepower,
  torque_nm,
  weight_kg,
  wet_weight_kg,
  seat_height_mm,
  wheelbase_mm,
  ground_clearance_mm,
  fuel_capacity_l,
  top_speed_kph,
  has_abs,
  difficulty_level,
  status,
  category,
  summary,
  is_draft,
  transmission,
  drive_type,
  cooling_system,
  power_to_weight_ratio,
  is_entry_level,
  recommended_license_level,
  use_cases,
  created_at,
  updated_at,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  )
`;

const DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug,
    logo_url,
    country
  ),
  motorcycle_model_tags!motorcycle_model_tags_motorcycle_id_fkey(
    motorcycle_tags!motorcycle_model_tags_tag_id_fkey(
      id,
      name,
      category,
      description,
      color_hex,
      icon
    )
  ),
  model_years!model_years_motorcycle_id_fkey(
    id,
    year,
    changes,
    image_url,
    msrp_usd,
    marketing_tagline,
    is_available,
    created_at,
    updated_at,
    model_configurations!model_configurations_model_year_id_fkey(
      id,
      name,
      description,
      notes,
      seat_height_mm,
      weight_kg,
      wheelbase_mm,
      fuel_capacity_l,
      ground_clearance_mm,
      is_default,
      trim_level,
      market_region,
      price_premium_usd,
      image_url,
      optional_equipment,
      special_features,
      engines!model_configurations_engine_id_fkey(
        id,
        name,
        displacement_cc,
        power_hp,
        torque_nm,
        engine_type,
        power_rpm,
        torque_rpm,
        valve_count,
        cylinder_count,
        cooling,
        fuel_system,
        stroke_type,
        bore_mm,
        stroke_mm,
        compression_ratio,
        valves_per_cylinder
      ),
      brake_systems!model_configurations_brake_system_id_fkey(
        id,
        type,
        has_traction_control,
        brake_type_front,
        brake_type_rear,
        front_disc_size_mm,
        rear_disc_size_mm,
        brake_brand,
        caliper_type,
        notes
      ),
      frames!model_configurations_frame_id_fkey(
        id,
        type,
        material,
        notes,
        rake_degrees,
        trail_mm,
        construction_method
      ),
      suspensions!model_configurations_suspension_id_fkey(
        id,
        front_type,
        rear_type,
        brand,
        adjustability,
        front_travel_mm,
        rear_travel_mm,
        front_brand,
        rear_brand
      ),
      wheels!model_configurations_wheel_id_fkey(
        id,
        type,
        front_size,
        rear_size,
        front_tire_size,
        rear_tire_size,
        rim_material,
        spoke_count_front,
        spoke_count_rear,
        notes
      ),
      color_variants!model_configurations_color_id_fkey(
        id,
        name,
        hex_code,
        color_code,
        description,
        image_url,
        is_metallic,
        is_pearl,
        is_matte
      )
    )
  )
`;

export const fetchAllMotorcycles = async () => {
  try {
    console.log("=== STARTING fetchAllMotorcycles DEBUG ===");
    console.log("Fetching all published motorcycles...");
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .eq('is_draft', false)
      .order('name', { ascending: true })
      .order('production_start_year', { ascending: true });
      
    if (error) {
      console.error("Error fetching motorcycles:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log("Query executed successfully");
    console.log("Raw Supabase response data:", data);
    console.log("Successfully fetched motorcycles:", data?.length || 0, "records");
    console.log("Sample motorcycle from query:", data?.[0]);
    
    // Validate the brand relationship data
    if (data && data.length > 0) {
      data.forEach((motorcycle, index) => {
        console.log(`Motorcycle ${index + 1} brand data:`, motorcycle.brands);
      });
    }
    
    console.log("=== END fetchAllMotorcycles DEBUG ===");
    return data || [];
  } catch (error) {
    console.error("=== ERROR in fetchAllMotorcycles ===");
    console.error("Failed to fetch motorcycles:", error);
    console.log("=== END fetchAllMotorcycles DEBUG (error) ===");
    throw error;
  }
};

export const fetchAllMotorcyclesForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .order('is_draft', { ascending: false })
      .order('name', { ascending: true })
      .order('production_start_year', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const fetchMotorcycleBySlug = async (slug: string) => {
  console.log("=== STARTING fetchMotorcycleBySlug DEBUG ===");
  console.log("Fetching motorcycle by slug:", slug);
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .eq('is_draft', false)
    .maybeSingle();
    
  console.log("Raw query result:", { data, error });
  console.log("Model years found:", data?.model_years?.length || 0);
  if (data?.model_years?.[0]) {
    console.log("First model year configurations:", data.model_years[0].model_configurations?.length || 0);
    console.log("Sample configuration:", data.model_years[0].model_configurations?.[0]);
  }
  console.log("=== END fetchMotorcycleBySlug DEBUG ===");
    
  return { data, error };
};

export const fetchMotorcycleBySlugForAdmin = async (slug: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleById = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .eq('is_draft', false)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleByIdForAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcyclesByIds = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .in('id', ids)
    .eq('is_draft', false);
    
  return { data: data || [], error };
};

export const fetchMotorcyclesByIdsForAdmin = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .in('id', ids);
    
  return { data: data || [], error };
};

export const fetchMotorcycleByDetails = async (name: string, year: number) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('name', name)
    .eq('production_start_year', year)
    .eq('is_draft', false)
    .maybeSingle();
    
  return { data, error };
};

export const insertPlaceholderMotorcycle = async (motorcycleInsertData: any) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .insert([motorcycleInsertData])
    .select()
    .single();
    
  return { data, error };
};

export const updateMotorcycleDraftStatus = async (id: string, isDraft: boolean) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .update({ is_draft: isDraft })
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

// New functions for motorcycle tags
export const fetchMotorcycleTags = async () => {
  const { data, error } = await supabase
    .from('motorcycle_tags')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
    
  return { data: data || [], error };
};

export const fetchMotorcycleTagsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('motorcycle_tags')
    .select('*')
    .eq('category', category)
    .order('name', { ascending: true });
    
  return { data: data || [], error };
};

export const addTagToMotorcycle = async (motorcycleId: string, tagId: string) => {
  const { data, error } = await supabase
    .from('motorcycle_model_tags')
    .insert({ motorcycle_id: motorcycleId, tag_id: tagId });
    
  return { data, error };
};

export const removeTagFromMotorcycle = async (motorcycleId: string, tagId: string) => {
  const { data, error } = await supabase
    .from('motorcycle_model_tags')
    .delete()
    .eq('motorcycle_id', motorcycleId)
    .eq('tag_id', tagId);
    
  return { data, error };
};

// Utility function to publish sample motorcycles for testing
export const publishSampleMotorcycles = async (count: number = 5) => {
  try {
    console.log(`=== PUBLISHING ${count} SAMPLE MOTORCYCLES ===`);
    
    // Get draft motorcycles
    const { data: draftMotorcycles, error: fetchError } = await supabase
      .from('motorcycle_models')
      .select('id, name, is_draft')
      .eq('is_draft', true)
      .limit(count);
      
    if (fetchError) {
      console.error("Error fetching draft motorcycles:", fetchError);
      throw fetchError;
    }
    
    console.log("Found draft motorcycles:", draftMotorcycles);
    
    if (!draftMotorcycles || draftMotorcycles.length === 0) {
      console.log("No draft motorcycles found to publish");
      return { published: 0 };
    }
    
    // Update them to published status
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .in('id', draftMotorcycles.map(m => m.id))
      .select('id, name, is_draft');
      
    if (error) {
      console.error("Error publishing motorcycles:", error);
      throw error;
    }
    
    console.log(`Successfully published ${data?.length || 0} motorcycles:`, data?.map(m => m.name));
    console.log("=== END PUBLISHING SAMPLE MOTORCYCLES ===");
    return { published: data?.length || 0, motorcycles: data };
  } catch (error) {
    console.error("=== ERROR PUBLISHING SAMPLE MOTORCYCLES ===");
    console.error("Failed to publish sample motorcycles:", error);
    throw error;
  }
};
