import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  console.log("=== getMotorcycleBySlug DEBUG ===");
  console.log("Fetching motorcycle with slug:", slug);
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(*),
        years:model_years(
          *,
          configurations:model_configurations(
            *,
            engines(*),
            brake_systems(*),
            frames(*),
            suspensions(*),
            wheels(*)
          )
        )
      `)
      .eq('slug', slug)
      .eq('is_draft', false)
      .single();
    
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
    const motorcycle: Motorcycle = {
      id: data.id,
      make: data.brands?.name || 'Unknown',
      model: data.name,
      year: data.years?.[0]?.year || new Date().getFullYear(),
      category: data.category || data.type || 'Standard',
      style_tags: [],
      difficulty_level: data.difficulty_level || 1,
      image_url: data.default_image_url || '',
      engine_size: data.engine_size || 0,
      horsepower: data.horsepower || 0,
      weight_kg: data.weight_kg || 0,
      wet_weight_kg: data.wet_weight_kg,
      seat_height_mm: data.seat_height_mm || 0,
      abs: data.has_abs || false,
      top_speed_kph: data.top_speed_kph || 0,
      torque_nm: data.torque_nm || 0,
      wheelbase_mm: data.wheelbase_mm || 0,
      ground_clearance_mm: data.ground_clearance_mm || 0,
      fuel_capacity_l: data.fuel_capacity_l || 0,
      smart_features: [],
      summary: data.summary || data.base_description || '',
      slug: data.slug,
      created_at: data.created_at,
      is_placeholder: false,
      brand_id: data.brand_id,
      is_draft: data.is_draft,
      
      // Enhanced technical fields
      transmission: data.transmission,
      drive_type: data.drive_type,
      cooling_system: data.cooling_system,
      power_to_weight_ratio: data.power_to_weight_ratio,
      is_entry_level: data.is_entry_level,
      recommended_license_level: data.recommended_license_level,
      use_cases: data.use_cases || [],
      
      // Add configurations using _componentData
      _componentData: {
        configurations: data.years?.[0]?.configurations || [],
        selectedConfiguration: data.years?.[0]?.configurations?.[0] || null
      }
    };
    
    console.log("Final motorcycle object:", motorcycle);
    console.log("=== END getMotorcycleBySlug DEBUG ===");
    
    return motorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    throw error;
  }
};

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  console.log("=== getAllMotorcycles DEBUG ===");
  console.log("Fetching all motorcycles with complete relational data");
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(*),
        years:model_years(
          *,
          configurations:model_configurations(
            *,
            engines(*),
            brake_systems(*),
            frames(*),
            suspensions(*),
            wheels(*)
          )
        )
      `)
      .eq('is_draft', false)
      .order('name');
      
    if (error) {
      console.error("Error fetching motorcycles:", error);
      throw error;
    }
    
    console.log("Raw motorcycles data count:", data.length);
    console.log("Sample raw motorcycle data:", data[0]);
    
    const transformedMotorcycles = data.map(item => {
      // Get the first year and its default or first configuration
      const firstYear = item.years?.[0];
      const defaultConfig = firstYear?.configurations?.find(config => config.is_default) || firstYear?.configurations?.[0];
      
      console.log(`Processing ${item.name}: ${firstYear?.configurations?.length || 0} configurations, using config:`, defaultConfig?.name || 'none');
      
      // Extract engine data from configuration
      const engineData = defaultConfig?.engines;
      const brakeData = defaultConfig?.brake_systems;
      
      // Use configuration data first, then fall back to model-level data
      const finalEngineSize = engineData?.displacement_cc || item.engine_size || 0;
      const finalHorsepower = engineData?.power_hp || item.horsepower || 0;
      const finalWeight = defaultConfig?.weight_kg || item.weight_kg || 0;
      const finalSeatHeight = defaultConfig?.seat_height_mm || item.seat_height_mm || 0;
      const finalTorque = engineData?.torque_nm || item.torque_nm || 0;
      
      const motorcycle: Motorcycle = {
        id: item.id,
        make: item.brands?.name || 'Unknown',
        model: item.name,
        year: firstYear?.year || item.production_start_year || new Date().getFullYear(),
        category: item.category || item.type || 'Standard',
        style_tags: [],
        difficulty_level: item.difficulty_level || 1,
        image_url: item.default_image_url || '',
        
        // Prioritize configuration data, then model data
        engine_size: finalEngineSize,
        horsepower: finalHorsepower,
        weight_kg: finalWeight,
        wet_weight_kg: item.wet_weight_kg,
        seat_height_mm: finalSeatHeight,
        abs: brakeData?.type?.toLowerCase().includes('abs') || item.has_abs || false,
        top_speed_kph: item.top_speed_kph || 0,
        torque_nm: finalTorque,
        wheelbase_mm: defaultConfig?.wheelbase_mm || item.wheelbase_mm || 0,
        ground_clearance_mm: defaultConfig?.ground_clearance_mm || item.ground_clearance_mm || 0,
        fuel_capacity_l: defaultConfig?.fuel_capacity_l || item.fuel_capacity_l || 0,
        
        smart_features: [],
        summary: item.summary || item.base_description || '',
        slug: item.slug,
        created_at: item.created_at,
        is_placeholder: false,
        brand_id: item.brand_id,
        is_draft: item.is_draft,
        
        // Enhanced technical fields
        transmission: item.transmission,
        drive_type: item.drive_type,
        cooling_system: item.cooling_system,
        power_to_weight_ratio: item.power_to_weight_ratio,
        is_entry_level: item.is_entry_level,
        recommended_license_level: item.recommended_license_level,
        use_cases: item.use_cases || [],
        
        // Additional engine fields from configuration
        engine_cc: finalEngineSize,
        displacement_cc: finalEngineSize,
        horsepower_hp: finalHorsepower,
        power_rpm: engineData?.power_rpm,
        torque_rpm: engineData?.torque_rpm,
        engine_type: engineData?.engine_type,
        cylinder_count: engineData?.cylinder_count,
        
        // Brake system information
        brake_type: brakeData?.type,
        has_abs: brakeData?.type?.toLowerCase().includes('abs') || item.has_abs || false,
        
        // Store configuration data for detail pages
        _componentData: {
          configurations: firstYear?.configurations || [],
          selectedConfiguration: defaultConfig || null
        }
      };
      
      console.log(`Transformed ${motorcycle.make} ${motorcycle.model}: engine=${motorcycle.engine_size}cc, hp=${motorcycle.horsepower}, weight=${motorcycle.weight_kg}kg`);
      
      return motorcycle;
    });
    
    console.log("=== getAllMotorcycles SUMMARY ===");
    console.log("Total motorcycles processed:", transformedMotorcycles.length);
    console.log("Motorcycles with engine data:", transformedMotorcycles.filter(m => m.engine_size > 0).length);
    console.log("Motorcycles with horsepower data:", transformedMotorcycles.filter(m => m.horsepower > 0).length);
    console.log("Motorcycles with weight data:", transformedMotorcycles.filter(m => m.weight_kg > 0).length);
    console.log("=== END getAllMotorcycles DEBUG ===");
    
    return transformedMotorcycles;
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    throw error;
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(*),
        years:model_years(
          *,
          configurations:model_configurations(
            *,
            engines(*),
            brake_systems(*)
          )
        )
      `)
      .ilike('name', `%${model}%`)
      .eq('brands.name', make)
      .gte('production_start_year', year - 2)
      .lte('production_end_year', year + 2)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    const firstYear = data.years?.[0];
    const defaultConfig = firstYear?.configurations?.find(config => config.is_default) || firstYear?.configurations?.[0];
    const engineData = defaultConfig?.engines;
    const brakeData = defaultConfig?.brake_systems;
    
    return {
      id: data.id,
      make: data.brands?.name || make,
      model: data.name,
      year: firstYear?.year || year,
      category: data.category || data.type || 'Standard',
      style_tags: [],
      difficulty_level: data.difficulty_level || 1,
      image_url: data.default_image_url || '',
      engine_size: engineData?.displacement_cc || data.engine_size || 0,
      horsepower: engineData?.power_hp || data.horsepower || 0,
      weight_kg: defaultConfig?.weight_kg || data.weight_kg || 0,
      wet_weight_kg: data.wet_weight_kg,
      seat_height_mm: defaultConfig?.seat_height_mm || data.seat_height_mm || 0,
      abs: brakeData?.type?.toLowerCase().includes('abs') || data.has_abs || false,
      top_speed_kph: data.top_speed_kph || 0,
      torque_nm: engineData?.torque_nm || data.torque_nm || 0,
      wheelbase_mm: defaultConfig?.wheelbase_mm || data.wheelbase_mm || 0,
      ground_clearance_mm: defaultConfig?.ground_clearance_mm || data.ground_clearance_mm || 0,
      fuel_capacity_l: defaultConfig?.fuel_capacity_l || data.fuel_capacity_l || 0,
      smart_features: [],
      summary: data.summary || data.base_description || '',
      slug: data.slug,
      created_at: data.created_at,
      is_placeholder: false,
      brand_id: data.brand_id,
      is_draft: data.is_draft,
      
      // Enhanced technical fields
      transmission: data.transmission,
      drive_type: data.drive_type,
      cooling_system: data.cooling_system,
      power_to_weight_ratio: data.power_to_weight_ratio,
      is_entry_level: data.is_entry_level,
      recommended_license_level: data.recommended_license_level,
      use_cases: data.use_cases || [],
      
      // Store configuration data for detail pages
      _componentData: {
        configurations: firstYear?.configurations || [],
        selectedConfiguration: defaultConfig || null
      }
    };
  } catch (error) {
    console.error("Error in findMotorcycleByDetails:", error);
    return null;
  }
};

export const createPlaceholderMotorcycle = async (params: {
  make: string;
  model: string;
  year: number;
}): Promise<Motorcycle> => {
  try {
    // First, find or create the brand
    let brand;
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', params.make)
      .single();
      
    if (existingBrand) {
      brand = existingBrand;
    } else {
      const { data: newBrand, error: brandError } = await supabase
        .from('brands')
        .insert({
          name: params.make,
          slug: params.make.toLowerCase().replace(/\s+/g, '-'),
          status: 'active'
        })
        .select()
        .single();
        
      if (brandError) throw brandError;
      brand = newBrand;
    }
    
    // Create the motorcycle model
    const { data: motorcycle, error } = await supabase
      .from('motorcycle_models')
      .insert({
        name: params.model,
        slug: `${params.make}-${params.model}`.toLowerCase().replace(/\s+/g, '-'),
        brand_id: brand.id,
        type: 'unknown',
        production_start_year: params.year,
        production_end_year: params.year,
        is_draft: true
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Create a model year for this placeholder
    const { data: modelYear, error: yearError } = await supabase
      .from('model_years')
      .insert({
        motorcycle_id: motorcycle.id,
        year: params.year,
        changes: 'Placeholder model year',
        is_available: true
      })
      .select()
      .single();
      
    if (yearError) throw yearError;
    
    // Create a basic configuration
    const { data: config, error: configError } = await supabase
      .from('model_configurations')
      .insert({
        model_year_id: modelYear.id,
        name: 'Standard',
        is_default: true
      })
      .select()
      .single();
      
    if (configError) throw configError;
    
    return {
      id: motorcycle.id,
      make: params.make,
      model: params.model,
      year: params.year,
      category: motorcycle.category || 'Standard',
      style_tags: [],
      difficulty_level: motorcycle.difficulty_level || 1,
      image_url: motorcycle.default_image_url || '',
      engine_size: motorcycle.engine_size || 0,
      horsepower: motorcycle.horsepower || 0,
      weight_kg: motorcycle.weight_kg || 0,
      wet_weight_kg: motorcycle.wet_weight_kg,
      seat_height_mm: motorcycle.seat_height_mm || 0,
      abs: motorcycle.has_abs || false,
      top_speed_kph: motorcycle.top_speed_kph || 0,
      torque_nm: motorcycle.torque_nm || 0,
      wheelbase_mm: motorcycle.wheelbase_mm || 0,
      ground_clearance_mm: motorcycle.ground_clearance_mm || 0,
      fuel_capacity_l: motorcycle.fuel_capacity_l || 0,
      smart_features: [],
      summary: motorcycle.summary || motorcycle.base_description || '',
      slug: motorcycle.slug,
      created_at: motorcycle.created_at,
      is_placeholder: true,
      brand_id: motorcycle.brand_id,
      is_draft: motorcycle.is_draft,
      
      // Enhanced technical fields
      transmission: motorcycle.transmission,
      drive_type: motorcycle.drive_type,
      cooling_system: motorcycle.cooling_system,
      power_to_weight_ratio: motorcycle.power_to_weight_ratio,
      is_entry_level: motorcycle.is_entry_level,
      recommended_license_level: motorcycle.recommended_license_level,
      use_cases: motorcycle.use_cases || []
    };
  } catch (error) {
    console.error("Error in createPlaceholderMotorcycle:", error);
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
