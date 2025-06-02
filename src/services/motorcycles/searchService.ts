
import { supabase } from "@/integrations/supabase/client";

export const searchMotorcycles = async (query: string): Promise<any[]> => {
  if (!query.trim()) {
    const { getAllMotorcycles } = await import("./motorcycleOperations");
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
      };
    });

    console.log(`Found ${motorcycles.length} motorcycles for query: ${query}`);
    return motorcycles;
  } catch (error) {
    console.error("Error in searchMotorcycles:", error);
    return [];
  }
};
