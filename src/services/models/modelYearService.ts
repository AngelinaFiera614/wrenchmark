
import { supabase } from "@/integrations/supabase/client";
import { ModelYear } from "@/types/motorcycle";

// Fetch model years for a specific model
export const fetchModelYears = async (modelId: string): Promise<ModelYear[]> => {
  try {
    console.log("Fetching model years for model ID:", modelId);
    
    const { data, error } = await supabase
      .from('model_years')
      .select(`
        *,
        configurations:model_configurations(count)
      `)
      .eq('motorcycle_id', modelId)
      .order('year', { ascending: true });
      
    if (error) {
      console.error("Error fetching model years:", error);
      return [];
    }
    
    console.log("Fetched model years:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchModelYears:", error);
    return [];
  }
};

// Create a new model year
export const createModelYear = async (yearData: Omit<ModelYear, 'id' | 'configurations'>): Promise<ModelYear | null> => {
  try {
    const { data, error } = await supabase
      .from('model_years')
      .insert(yearData)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating model year:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createModelYear:", error);
    return null;
  }
};

// Update an existing model year
export const updateModelYear = async (id: string, yearData: Partial<ModelYear>): Promise<ModelYear | null> => {
  try {
    const { data, error } = await supabase
      .from('model_years')
      .update(yearData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating model year:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateModelYear:", error);
    return null;
  }
};

// Delete a model year
export const deleteModelYear = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('model_years')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting model year:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteModelYear:", error);
    return false;
  }
};

// Reorder model years (for timeline drag-and-drop)
export const reorderModelYears = async (modelId: string, yearUpdates: { id: string; year: number }[]): Promise<boolean> => {
  try {
    const updates = yearUpdates.map(update => 
      supabase
        .from('model_years')
        .update({ year: update.year })
        .eq('id', update.id)
    );
    
    const results = await Promise.all(updates);
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      console.error("Error reordering model years");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in reorderModelYears:", error);
    return false;
  }
};

// Generate model years for a model based on production range
export const generateModelYears = async (modelId: string): Promise<boolean> => {
  try {
    // First get the model data
    const { data: model, error: modelError } = await supabase
      .from('motorcycle_models')
      .select('production_start_year, production_end_year, production_status')
      .eq('id', modelId)
      .single();

    if (modelError || !model) {
      console.error("Error fetching model:", modelError);
      return false;
    }

    if (!model.production_start_year) {
      console.error("Model has no production start year");
      return false;
    }

    const startYear = Math.max(model.production_start_year, 2018);
    const endYear = model.production_status === 'active' || !model.production_end_year 
      ? 2025 
      : Math.min(model.production_end_year, 2025);

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push({
        motorcycle_id: modelId,
        year: year,
        is_available: year >= 2024,
        changes: year === startYear ? 'Initial production year' : 
                year >= 2024 ? 'Current production' : 'Historical production'
      });
    }

    if (years.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from('model_years')
      .upsert(years, { 
        onConflict: 'motorcycle_id,year',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error("Error generating model years:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in generateModelYears:", error);
    return false;
  }
};
