
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const fetchAllMotorcyclesForAdmin = async (): Promise<Motorcycle[]> => {
  try {
    console.log("=== ADMIN: Fetching motorcycles with proper brand data ===");

    // Fetch motorcycle models with proper brand relationship
    const { data: models, error: modelsError } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        )
      `)
      .order('name', { ascending: true });

    if (modelsError) {
      console.error("Error fetching models:", modelsError);
      throw modelsError;
    }

    if (!models || models.length === 0) {
      console.log("No models found");
      return [];
    }

    // Transform to motorcycle format with proper brand data
    const motorcycles: Motorcycle[] = models.map(model => ({
      id: model.id,
      make: model.brands?.name || "Unknown Brand",
      brand_id: model.brand_id,
      model: model.name,
      year: new Date().getFullYear(), // Default year for admin display
      category: model.type || "Standard",
      style_tags: [],
      difficulty_level: model.difficulty_level || 1,
      image_url: model.default_image_url || '',
      engine_size: model.engine_size || 0,
      horsepower: model.horsepower || 0,
      weight_kg: model.weight_kg || 0,
      seat_height_mm: model.seat_height_mm || 0,
      abs: model.has_abs || false,
      top_speed_kph: model.top_speed_kph || 0,
      torque_nm: 0,
      wheelbase_mm: model.wheelbase_mm || 0,
      ground_clearance_mm: model.ground_clearance_mm || 0,
      fuel_capacity_l: model.fuel_capacity_l || 0,
      smart_features: [],
      summary: model.summary || model.base_description || '',
      slug: model.slug,
      created_at: model.created_at,
      is_draft: model.is_draft,
      status: model.status || 'active'
    }));

    console.log("=== ADMIN: Transform complete ===", {
      total_models: models.length,
      with_brands: motorcycles.filter(m => m.make !== "Unknown Brand").length
    });

    return motorcycles;

  } catch (error) {
    console.error("=== ADMIN: Fatal error ===", error);
    throw error;
  }
};

export const publishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .eq('id', motorcycleId);

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

export const unpublishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: true })
      .eq('id', motorcycleId);

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
