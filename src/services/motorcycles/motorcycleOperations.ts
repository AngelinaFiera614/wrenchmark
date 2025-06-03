
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";
import { transformToMotorcycle, ComponentData } from "./transforms/motorcycleTransform";

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    console.log("=== FETCHING: Starting enhanced motorcycle fetch ===");

    // Fetch motorcycle models with brands
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
      .eq('is_draft', false)
      .order('name', { ascending: true });

    if (modelsError) {
      console.error("Error fetching models:", modelsError);
      throw modelsError;
    }

    if (!models || models.length === 0) {
      console.log("No published models found");
      return [];
    }

    console.log("=== FETCHING: Found models ===", models.length);

    // Fetch all model years for these models
    const modelIds = models.map(m => m.id);
    const { data: modelYears, error: yearsError } = await supabase
      .from('model_years')
      .select('*')
      .in('motorcycle_id', modelIds)
      .order('year', { ascending: false });

    if (yearsError) {
      console.error("Error fetching model years:", yearsError);
      throw yearsError;
    }

    console.log("=== FETCHING: Found model years ===", modelYears?.length || 0);

    // Fetch all configurations for these model years
    const yearIds = modelYears?.map(y => y.id) || [];
    const { data: configurations, error: configError } = await supabase
      .from('model_configurations')
      .select('*')
      .in('model_year_id', yearIds);

    if (configError) {
      console.error("Error fetching configurations:", configError);
      throw configError;
    }

    console.log("=== FETCHING: Found configurations ===", configurations?.length || 0);

    // Fetch model component assignments
    const { data: modelAssignments, error: assignmentsError } = await supabase
      .from('model_component_assignments')
      .select('*')
      .in('model_id', modelIds);

    if (assignmentsError) {
      console.error("Error fetching model assignments:", assignmentsError);
      throw assignmentsError;
    }

    console.log("=== FETCHING: Found model assignments ===", modelAssignments?.length || 0);

    // Fetch all component data
    const componentData = await fetchAllComponents();

    console.log("=== FETCHING: Component data loaded ===", {
      engines: componentData.components.engines.length,
      brakes: componentData.components.brakes.length,
      frames: componentData.components.frames.length,
      suspensions: componentData.components.suspensions.length,
      wheels: componentData.components.wheels.length
    });

    // Build the component data structure
    const fullComponentData: ComponentData = {
      configurations: configurations || [],
      components: componentData.components,
      model_assignments: modelAssignments || []
    };

    // Transform each model into a motorcycle
    const motorcycles: Motorcycle[] = [];

    for (const model of models) {
      try {
        const modelYearsForModel = modelYears?.filter(y => y.motorcycle_id === model.id) || [];
        
        if (modelYearsForModel.length > 0) {
          const motorcycle = transformToMotorcycle(model, modelYearsForModel, fullComponentData);
          motorcycles.push(motorcycle);
        } else {
          console.warn(`No model years found for model: ${model.name}`);
        }
      } catch (transformError) {
        console.error(`Error transforming model ${model.name}:`, transformError);
        // Continue with other models instead of failing completely
      }
    }

    console.log("=== FETCHING: Transformation complete ===", {
      total_models: models.length,
      successful_transformations: motorcycles.length,
      with_engine_data: motorcycles.filter(m => m.engine_size).length,
      with_power_data: motorcycles.filter(m => m.horsepower).length
    });

    return motorcycles;

  } catch (error) {
    console.error("=== FETCHING: Fatal error ===", error);
    throw error;
  }
};

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  try {
    // Fetch the motorcycle model by slug
    const { data: model, error: modelError } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (modelError) {
      if (modelError.code === 'PGRST116') {
        return null; // Not found
      }
      throw modelError;
    }

    // Fetch model years for this model
    const { data: modelYears, error: yearsError } = await supabase
      .from('model_years')
      .select('*')
      .eq('motorcycle_id', model.id)
      .order('year', { ascending: false });

    if (yearsError) {
      throw yearsError;
    }

    if (!modelYears || modelYears.length === 0) {
      console.warn(`No model years found for model: ${model.name}`);
      return null;
    }

    // Fetch configurations for these model years
    const yearIds = modelYears.map(y => y.id);
    const { data: configurations, error: configError } = await supabase
      .from('model_configurations')
      .select('*')
      .in('model_year_id', yearIds);

    if (configError) {
      throw configError;
    }

    // Fetch model component assignments
    const { data: modelAssignments, error: assignmentsError } = await supabase
      .from('model_component_assignments')
      .select('*')
      .eq('model_id', model.id);

    if (assignmentsError) {
      throw assignmentsError;
    }

    // Fetch all component data
    const componentData = await fetchAllComponents();

    // Build the component data structure
    const fullComponentData: ComponentData = {
      configurations: configurations || [],
      components: componentData.components,
      model_assignments: modelAssignments || []
    };

    // Transform to motorcycle
    return transformToMotorcycle(model, modelYears, fullComponentData);

  } catch (error) {
    console.error(`Error fetching motorcycle by slug ${slug}:`, error);
    throw error;
  }
};

export const findMotorcycleByDetails = async (
  make: string, 
  model: string, 
  year?: number
): Promise<Motorcycle | null> => {
  try {
    // Build the query
    let query = supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        ),
        model_years(*)
      `)
      .eq('name', model)
      .eq('brands.name', make);

    if (year) {
      query = query.eq('model_years.year', year);
    }

    const { data: models, error } = await query;

    if (error) {
      throw error;
    }

    if (!models || models.length === 0) {
      return null;
    }

    // Use the first match
    const matchedModel = models[0];
    
    // Get the motorcycle by slug (which will do the full transformation)
    return await getMotorcycleBySlug(matchedModel.slug);

  } catch (error) {
    console.error(`Error finding motorcycle by details ${make} ${model} ${year}:`, error);
    throw error;
  }
};

// Fetch all component data in parallel
async function fetchAllComponents() {
  const [engines, brakes, frames, suspensions, wheels] = await Promise.all([
    supabase.from('engines').select('*'),
    supabase.from('brake_systems').select('*'),
    supabase.from('frames').select('*'),
    supabase.from('suspensions').select('*'),
    supabase.from('wheels').select('*')
  ]);

  // Check for errors
  if (engines.error) throw engines.error;
  if (brakes.error) throw brakes.error;
  if (frames.error) throw frames.error;
  if (suspensions.error) throw suspensions.error;
  if (wheels.error) throw wheels.error;

  return {
    components: {
      engines: engines.data || [],
      brakes: brakes.data || [],
      frames: frames.data || [],
      suspensions: suspensions.data || [],
      wheels: wheels.data || []
    }
  };
}
