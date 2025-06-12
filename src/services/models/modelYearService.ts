
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
    // For current production models (no end year), go to current year + 1 for next model year
    const currentYear = new Date().getFullYear();
    const endYear = model.production_end_year || (model.production_status === 'active' ? currentYear + 1 : currentYear);
    
    console.log(`Generating years from ${startYear} to ${endYear} for model: ${model.name} (Status: ${model.production_status})`);

    // Check if any years already exist to avoid duplicates
    const { data: existingYears } = await supabase
      .from('model_years')
      .select('year')
      .eq('motorcycle_id', modelId);

    const existingYearNumbers = existingYears?.map(y => y.year) || [];
    console.log("Existing years:", existingYearNumbers);

    // Generate array of years to create (excluding existing ones)
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      if (!existingYearNumbers.includes(year)) {
        years.push({
          motorcycle_id: modelId,
          year: year,
          changes: year === startYear ? 'Initial production year' : 
                   year === endYear && !model.production_end_year ? 'Current model year' : 
                   'Production year',
          is_available: year >= currentYear - 1 // Mark recent and current years as available
        });
      }
    }

    if (years.length === 0) {
      console.log("No new years to generate - all years already exist");
      return true; // Return true since it's not really an error
    }

    console.log(`Inserting ${years.length} new model years:`, years.map(y => y.year));

    // Insert the model years
    const { data, error } = await supabase
      .from('model_years')
      .insert(years)
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

// New function to create a single model year
export const createModelYear = async (modelId: string, yearData: {
  year: number;
  changes?: string;
  msrp_usd?: number;
  marketing_tagline?: string;
  is_available?: boolean;
  image_url?: string;
}): Promise<boolean> => {
  try {
    console.log("Creating model year:", yearData.year, "for model:", modelId);
    
    const { data, error } = await supabase
      .from('model_years')
      .insert({
        motorcycle_id: modelId,
        ...yearData
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating model year:", error);
      return false;
    }

    console.log("Successfully created model year:", data);
    return true;
  } catch (error) {
    console.error("Error in createModelYear:", error);
    return false;
  }
};
