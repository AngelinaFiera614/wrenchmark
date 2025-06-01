import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";
import { fetchAllMotorcycles as fetchAllMotorcyclesQuery, fetchAllMotorcyclesForAdmin, publishSampleMotorcycles } from "@/services/motorcycles/motorcycleQueries";
import { transformMotorcycleData, createPlaceholderMotorcycleData, createDraftMotorcycleData } from "@/services/motorcycles/motorcycleTransforms";

export const publishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    console.log("Publishing motorcycle:", motorcycleId);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .eq('id', motorcycleId)
      .select()
      .single();

    if (error) {
      console.error("Publish error:", error);
      throw error;
    }

    console.log("Motorcycle published successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to publish motorcycle:", error);
    return false;
  }
};

export const unpublishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    console.log("Unpublishing motorcycle:", motorcycleId);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: true })
      .eq('id', motorcycleId)
      .select()
      .single();

    if (error) {
      console.error("Unpublish error:", error);
      throw error;
    }

    console.log("Motorcycle unpublished successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to unpublish motorcycle:", error);
    return false;
  }
};

export const updateMotorcycle = async (motorcycleId: string, updateData: Partial<Motorcycle>): Promise<boolean> => {
  try {
    console.log("Updating motorcycle:", motorcycleId, updateData);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', motorcycleId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      throw error;
    }

    console.log("Motorcycle updated successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to update motorcycle:", error);
    return false;
  }
};

export const createMotorcycle = async (motorcycleData: any): Promise<string | null> => {
  try {
    console.log("Creating motorcycle:", motorcycleData);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .insert(motorcycleData)
      .select()
      .single();

    if (error) {
      console.error("Create error:", error);
      throw error;
    }

    console.log("Motorcycle created successfully:", data);
    return data.id;
  } catch (error) {
    console.error("Failed to create motorcycle:", error);
    return null;
  }
};

export const deleteMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    console.log("Deleting motorcycle:", motorcycleId);
    
    const { error } = await supabase
      .from('motorcycle_models')
      .delete()
      .eq('id', motorcycleId);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    console.log("Motorcycle deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete motorcycle:", error);
    return false;
  }
};

// Updated getAllMotorcycles to use the fixed query with enhanced debugging
export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    console.log("=== STARTING getAllMotorcycles DEBUG ===");
    console.log("Fetching all motorcycles using fixed query...");
    
    const rawData = await fetchAllMotorcyclesQuery();
    console.log("Raw motorcycle data received:", rawData);
    console.log("Raw data length:", rawData?.length || 0);
    console.log("Raw data sample:", rawData?.[0]);
    
    if (!rawData || rawData.length === 0) {
      console.log("No published motorcycles found. Attempting to publish sample data...");
      
      // Try to publish some sample motorcycles
      try {
        const publishResult = await publishSampleMotorcycles(5);
        console.log("Publish sample result:", publishResult);
        
        // Retry fetching after publishing
        const retryData = await fetchAllMotorcyclesQuery();
        console.log("Retry data after publishing:", retryData);
        
        if (retryData && retryData.length > 0) {
          console.log("Successfully fetched motorcycles after publishing samples:", retryData.length);
          const transformedRetryData = retryData.map(transformMotorcycleData);
          console.log("Transformed retry data:", transformedRetryData);
          console.log("=== END getAllMotorcycles DEBUG (retry success) ===");
          return transformedRetryData;
        }
      } catch (publishError) {
        console.warn("Could not publish sample motorcycles:", publishError);
      }
      
      console.log("No motorcycles available to display");
      console.log("=== END getAllMotorcycles DEBUG (no data) ===");
      return [];
    }
    
    console.log("Starting data transformation...");
    // Transform the data to match the Motorcycle interface
    const transformedData = rawData.map((rawMotorcycle, index) => {
      console.log(`Transforming motorcycle ${index + 1}:`, rawMotorcycle);
      const transformed = transformMotorcycleData(rawMotorcycle);
      console.log(`Transformed motorcycle ${index + 1}:`, transformed);
      return transformed;
    });
    
    console.log("Final transformed motorcycle data:", transformedData.length, "motorcycles");
    console.log("Sample transformed motorcycle:", transformedData[0]);
    console.log("=== END getAllMotorcycles DEBUG (success) ===");
    return transformedData;
  } catch (error) {
    console.error("=== ERROR in getAllMotorcycles ===");
    console.error("Failed to fetch motorcycles:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    console.log("=== END getAllMotorcycles DEBUG (error) ===");
    throw error;
  }
};

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  try {
    console.log("=== STARTING getMotorcycleBySlug DEBUG ===");
    console.log("Fetching motorcycle by slug:", slug);
    
    // First get the motorcycle model with brand info
    const { data: motorcycleData, error: motorcycleError } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('is_draft', false)
      .maybeSingle();

    if (motorcycleError) {
      console.error("Error fetching motorcycle by slug:", motorcycleError);
      throw motorcycleError;
    }

    if (!motorcycleData) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }

    console.log("Found motorcycle model:", motorcycleData);
    
    // Get model years for this motorcycle
    const { data: modelYears, error: yearError } = await supabase
      .from('model_years')
      .select('*')
      .eq('motorcycle_id', motorcycleData.id)
      .order('year', { ascending: false });

    if (yearError) {
      console.error("Error fetching model years:", yearError);
    }

    console.log("Found model years:", modelYears);

    // Get configurations with full component data for all years
    let allConfigurations = [];
    if (modelYears && modelYears.length > 0) {
      for (const year of modelYears) {
        const { data: configData, error: configError } = await supabase
          .from('model_configurations')
          .select(`
            *,
            engines (*),
            brake_systems (*),
            frames (*),
            suspensions (*),
            wheels (*),
            color_variants (*)
          `)
          .eq('model_year_id', year.id)
          .order('is_default', { ascending: false });

        if (configError) {
          console.error("Error fetching configurations for year", year.year, ":", configError);
        } else {
          const configurationsWithYear = (configData || []).map(config => ({
            ...config,
            model_year: year
          }));
          allConfigurations.push(...configurationsWithYear);
        }
      }
    }

    console.log("All configurations found:", allConfigurations);

    // Get color options for all years
    let colorOptions = [];
    if (modelYears && modelYears.length > 0) {
      for (const year of modelYears) {
        const { data: colors, error: colorError } = await supabase
          .from('color_options')
          .select('*')
          .eq('model_year_id', year.id);

        if (!colorError && colors) {
          colorOptions.push(...colors.map(color => ({ ...color, year: year.year })));
        }
      }
    }

    console.log("Color options found:", colorOptions);

    // Transform the data with enhanced component information
    const enhancedMotorcycleData = {
      ...motorcycleData,
      model_years: modelYears || [],
      configurations: allConfigurations,
      color_options: colorOptions
    };

    console.log("Enhanced motorcycle data before transform:", enhancedMotorcycleData);
    const transformedData = transformMotorcycleData(enhancedMotorcycleData);
    
    console.log("Final transformed motorcycle data:", transformedData);
    console.log("=== END getMotorcycleBySlug DEBUG ===");
    return transformedData;
  } catch (error) {
    console.error("=== ERROR in getMotorcycleBySlug ===");
    console.error("Failed to fetch motorcycle by slug:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    console.log("Finding motorcycle by details:", { make, model, year });
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey (
          id,
          name,
          slug
        )
      `)
      .eq('name', model)
      .eq('production_start_year', year)
      .eq('is_draft', false)
      .maybeSingle();

    if (error) {
      console.error("Error finding motorcycle by details:", error);
      throw error;
    }

    if (!data) {
      console.log("No motorcycle found with details:", { make, model, year });
      return null;
    }

    console.log("Found motorcycle by details:", data);
    
    // Transform the data to match the Motorcycle interface
    const transformedData = transformMotorcycleData(data);
    
    console.log("Transformed motorcycle by details:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Failed to find motorcycle by details:", error);
    throw error;
  }
};

export const createPlaceholderMotorcycle = async (motorcycleData: {
  make: string;
  model: string;
  year: number;
  isDraft?: boolean;
}): Promise<Motorcycle> => {
  try {
    console.log("Creating placeholder motorcycle:", motorcycleData);
    
    // First, find or get the brand ID
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('name', motorcycleData.make)
      .single();

    if (brandError && brandError.code !== 'PGRST116') {
      console.error("Error finding brand:", brandError);
      throw brandError;
    }

    let brandId = brandData?.id;
    
    // If brand doesn't exist, create it
    if (!brandId) {
      console.log("Creating new brand:", motorcycleData.make);
      const { data: newBrand, error: createBrandError } = await supabase
        .from('brands')
        .insert({
          name: motorcycleData.make,
          slug: motorcycleData.make.toLowerCase().replace(/\s+/g, '-'),
        })
        .select('id')
        .single();
        
      if (createBrandError) {
        console.error("Error creating brand:", createBrandError);
        throw createBrandError;
      }
      
      brandId = newBrand.id;
    }

    // Create the placeholder motorcycle data
    const placeholderData = createPlaceholderMotorcycleData({
      ...motorcycleData,
      isDraft: motorcycleData.isDraft || false,
    });

    // Add the brand_id to the data
    const motorcycleDataWithBrand = {
      ...placeholderData,
      brand_id: brandId,
    };

    console.log("Creating motorcycle with data:", motorcycleDataWithBrand);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .insert(motorcycleDataWithBrand)
      .select(`
        *,
        brands (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error("Error creating placeholder motorcycle:", error);
      throw error;
    }

    console.log("Created placeholder motorcycle:", data);
    
    // Transform the data to match the Motorcycle interface
    const transformedData = transformMotorcycleData(data);
    
    console.log("Transformed placeholder motorcycle:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Failed to create placeholder motorcycle:", error);
    throw error;
  }
};

// Export the utility function for publishing sample data
export { publishSampleMotorcycles };
