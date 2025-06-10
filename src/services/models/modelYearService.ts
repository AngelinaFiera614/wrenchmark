

import { supabase } from "@/integrations/supabase/client";

export const fetchModelYears = async (modelId: string) => {
  try {
    console.log("Fetching model years for model:", modelId);
    
    const { data, error } = await supabase
      .from('model_years')
      .select(`
        id,
        year,
        changes,
        msrp_usd,
        marketing_tagline,
        is_available,
        image_url,
        created_at,
        updated_at,
        configurations:model_configurations(
          id,
          name,
          is_default
        )
      `)
      .eq('motorcycle_id', modelId)
      .order('year', { ascending: false });

    if (error) {
      console.error("Error fetching model years:", error);
      throw new Error(`Failed to fetch model years: ${error.message}`);
    }

    console.log(`Successfully fetched ${data?.length || 0} model years`);
    return data || [];
  } catch (error) {
    console.error("Error in fetchModelYears:", error);
    throw error;
  }
};

export const generateModelYears = async (modelId: string): Promise<boolean> => {
  try {
    console.log("Generating model years for model:", modelId);
    
    // First, get the model data to check production years
    const { data: model, error: modelError } = await supabase
      .from('motorcycle_models')
      .select('production_start_year, production_end_year, production_status, name')
      .eq('id', modelId)
      .single();

    if (modelError || !model) {
      console.error("Error fetching model:", modelError);
      return false;
    }

    if (!model.production_start_year) {
      console.error("Model has no production start year set");
      return false;
    }

    // Calculate the year range based on production dates
    const startYear = model.production_start_year;
    const endYear = model.production_end_year || new Date().getFullYear();
    
    console.log(`Generating years from ${startYear} to ${endYear} for model: ${model.name}`);

    // Generate array of years to create
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push({
        motorcycle_id: modelId,
        year: year,
        changes: year === startYear ? 'Initial production year' : 'Production year',
        is_available: year >= 2020 // Mark recent years as available
      });
    }

    if (years.length === 0) {
      console.error("No years to generate");
      return false;
    }

    // Insert the model years, using upsert to avoid duplicates
    const { data, error } = await supabase
      .from('model_years')
      .upsert(years, { 
        onConflict: 'motorcycle_id,year',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      console.error("Error inserting model years:", error);
      return false;
    }

    console.log(`Successfully generated ${data?.length || 0} model years`);
    return true;
  } catch (error) {
    console.error("Error in generateModelYears:", error);
    return false;
  }
};

export const deleteModelYear = async (yearId: string): Promise<boolean> => {
  try {
    console.log("Deleting model year:", yearId);
    
    // First delete any configurations for this year
    const { error: configError } = await supabase
      .from('model_configurations')
      .delete()
      .eq('model_year_id', yearId);

    if (configError) {
      console.error("Error deleting configurations:", configError);
      return false;
    }

    // Then delete the model year itself
    const { error } = await supabase
      .from('model_years')
      .delete()
      .eq('id', yearId);

    if (error) {
      console.error("Error deleting model year:", error);
      return false;
    }

    console.log("Successfully deleted model year");
    return true;
  } catch (error) {
    console.error("Error in deleteModelYear:", error);
    return false;
  }
};
