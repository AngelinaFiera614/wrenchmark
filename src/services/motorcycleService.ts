// Main entry point for motorcycle services - simplified to just re-export functions
export { 
  getMotorcycleBySlug, 
  getAllMotorcycles, 
  findMotorcycleByDetails 
} from "./motorcycles/motorcycleOperations";

export { createPlaceholderMotorcycle } from "./motorcycles/placeholderService";

export { 
  publishMotorcycle, 
  unpublishMotorcycle, 
  fetchAllMotorcyclesForAdmin 
} from "./motorcycles/adminQueries";

import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";
import { getMotorcycleBySlugEnhanced } from "./motorcycleServiceEnhanced";

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  try {
    // Try the enhanced version first
    const enhancedResult = await getMotorcycleBySlugEnhanced(slug);
    if (enhancedResult) {
      return enhancedResult;
    }

    // Fallback to legacy table if needed
    console.log("Falling back to legacy motorcycle table for slug:", slug);
    
    const { data, error } = await supabase
      .from('motorcycles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching motorcycle:", error);
      return null;
    }

    return data as Motorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    return null;
  }
};

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    console.log("Fetching all motorcycles with enhanced data...");
    
    // Get motorcycle models with their latest configurations
    const { data: models, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brand:brand_id (
          id,
          name,
          logo_url
        ),
        model_years:model_years (
          *,
          configurations:model_configurations (
            *,
            engines:engine_id (
              id,
              name,
              displacement_cc,
              power_hp,
              torque_nm,
              engine_type
            ),
            brake_systems:brake_system_id (
              id,
              type,
              has_traction_control
            )
          )
        )
      `)
      .eq('production_status', 'active')
      .limit(100);

    if (error) {
      console.error("Error fetching motorcycle models:", error);
      // Fallback to legacy table
      return await getLegacyMotorcycles();
    }

    if (!models || models.length === 0) {
      console.log("No models found, falling back to legacy data");
      return await getLegacyMotorcycles();
    }

    // Transform models to legacy motorcycle format
    const motorcycles = models.map(model => {
      const latestYear = model.model_years?.reduce((latest, year) => 
        !latest || year.year > latest.year ? year : latest
      );
      
      const defaultConfig = latestYear?.configurations?.find(c => c.is_default) || 
                           latestYear?.configurations?.[0];
      
      const engine = defaultConfig?.engines;
      const brakes = defaultConfig?.brake_systems;

      return {
        id: model.id,
        make: model.brand?.name || "Unknown",
        brand_id: model.brand_id,
        model: model.name,
        year: latestYear?.year || model.production_start_year || new Date().getFullYear(),
        category: model.type || "Standard",
        style_tags: [],
        difficulty_level: model.difficulty_level || 3,
        image_url: defaultConfig?.image_url || model.default_image_url || "",
        engine_size: engine?.displacement_cc || model.engine_size || 0,
        horsepower: engine?.power_hp || model.horsepower || 0,
        weight_kg: defaultConfig?.weight_kg || model.weight_kg || 0,
        seat_height_mm: defaultConfig?.seat_height_mm || model.seat_height_mm || 0,
        abs: brakes?.has_traction_control || model.has_abs || false,
        top_speed_kph: model.top_speed_kph || 0,
        torque_nm: engine?.torque_nm || model.torque_nm || 0,
        wheelbase_mm: defaultConfig?.wheelbase_mm || model.wheelbase_mm || 0,
        ground_clearance_mm: defaultConfig?.ground_clearance_mm || model.ground_clearance_mm || 0,
        fuel_capacity_l: defaultConfig?.fuel_capacity_l || model.fuel_capacity_l || 0,
        smart_features: [],
        summary: model.base_description || model.summary || "",
        slug: model.slug,
        _componentData: {
          engine,
          brakes,
          configurations: latestYear?.configurations || [],
          selectedConfiguration: defaultConfig
        }
      } as Motorcycle;
    });

    console.log(`Fetched ${motorcycles.length} enhanced motorcycles`);
    return motorcycles;
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    return await getLegacyMotorcycles();
  }
};

const getLegacyMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select('*')
      .limit(100);

    if (error) {
      console.error("Error fetching legacy motorcycles:", error);
      return [];
    }

    return (data || []) as Motorcycle[];
  } catch (error) {
    console.error("Error in getLegacyMotorcycles:", error);
    return [];
  }
};

export const searchMotorcycles = async (query: string): Promise<Motorcycle[]> => {
  if (!query.trim()) {
    return getAllMotorcycles();
  }

  try {
    console.log("Searching motorcycles with query:", query);
    
    const { data: models, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brand:brand_id (
          id,
          name,
          logo_url
        ),
        model_years:model_years (
          *,
          configurations:model_configurations (
            *,
            engines:engine_id (
              id,
              name,
              displacement_cc,
              power_hp,
              torque_nm
            )
          )
        )
      `)
      .or(`name.ilike.%${query}%, brand.name.ilike.%${query}%, type.ilike.%${query}%`)
      .eq('production_status', 'active')
      .limit(50);

    if (error) {
      console.error("Error searching motorcycle models:", error);
      return [];
    }

    // Transform to legacy format (similar to getAllMotorcycles)
    const motorcycles = (models || []).map(model => {
      const latestYear = model.model_years?.reduce((latest, year) => 
        !latest || year.year > latest.year ? year : latest
      );
      
      const defaultConfig = latestYear?.configurations?.find(c => c.is_default) || 
                           latestYear?.configurations?.[0];
      
      const engine = defaultConfig?.engines;

      return {
        id: model.id,
        make: model.brand?.name || "Unknown",
        model: model.name,
        year: latestYear?.year || model.production_start_year || new Date().getFullYear(),
        category: model.type || "Standard",
        engine_size: engine?.displacement_cc || 0,
        horsepower: engine?.power_hp || 0,
        image_url: defaultConfig?.image_url || model.default_image_url || "",
        slug: model.slug,
        summary: model.base_description || "",
        _componentData: {
          engine,
          configurations: latestYear?.configurations || [],
          selectedConfiguration: defaultConfig
        }
      } as Motorcycle;
    });

    console.log(`Found ${motorcycles.length} motorcycles for query: ${query}`);
    return motorcycles;
  } catch (error) {
    console.error("Error in searchMotorcycles:", error);
    return [];
  }
};
