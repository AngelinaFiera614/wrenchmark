
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Core CRUD operations for configurations
export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year:", modelYearId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engine:engine_id(*),
        brakes:brake_system_id(*),
        frame:frame_id(*),
        suspension:suspension_id(*),
        wheels:wheel_id(*),
        colors:color_options(*)
      `)
      .eq('model_year_id', modelYearId)
      .order('is_default', { ascending: false });
      
    if (error) {
      console.error("Error fetching configurations:", error);
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
    
    console.log("Fetched configurations:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    throw error;
  }
};

export const createConfiguration = async (configData: Omit<Configuration, 'id' | 'engine' | 'brakes' | 'frame' | 'suspension' | 'wheels' | 'colors'>): Promise<Configuration | null> => {
  try {
    console.log("Creating configuration with data:", configData);
    
    // Validate required fields
    if (!configData.model_year_id) {
      throw new Error("Model year ID is required");
    }
    
    if (!configData.name || configData.name.trim() === '') {
      throw new Error("Configuration name is required");
    }

    // Clean the data - remove any undefined or empty string values for foreign keys
    const cleanConfigData = {
      ...configData,
      engine_id: configData.engine_id || null,
      brake_system_id: configData.brake_system_id || null,
      frame_id: configData.frame_id || null,
      suspension_id: configData.suspension_id || null,
      wheel_id: configData.wheel_id || null,
      // Ensure numeric fields are properly converted or null
      seat_height_mm: configData.seat_height_mm ? Number(configData.seat_height_mm) : null,
      weight_kg: configData.weight_kg ? Number(configData.weight_kg) : null,
      wheelbase_mm: configData.wheelbase_mm ? Number(configData.wheelbase_mm) : null,
      fuel_capacity_l: configData.fuel_capacity_l ? Number(configData.fuel_capacity_l) : null,
      ground_clearance_mm: configData.ground_clearance_mm ? Number(configData.ground_clearance_mm) : null,
      price_premium_usd: configData.price_premium_usd ? Number(configData.price_premium_usd) : null,
    };

    // Validate positive dimensions
    const dimensionFields = ['seat_height_mm', 'weight_kg', 'wheelbase_mm', 'fuel_capacity_l', 'ground_clearance_mm'];
    for (const field of dimensionFields) {
      const value = cleanConfigData[field as keyof typeof cleanConfigData];
      if (value !== null && value !== undefined && Number(value) <= 0) {
        throw new Error(`${field.replace(/_/g, ' ')} must be a positive number`);
      }
    }

    // Validate price premium is not negative
    if (cleanConfigData.price_premium_usd !== null && cleanConfigData.price_premium_usd < 0) {
      throw new Error("Price premium cannot be negative");
    }

    const { data: basicConfig, error: insertError } = await supabase
      .from('model_configurations')
      .insert(cleanConfigData)
      .select('*')
      .single();
      
    if (insertError) {
      console.error("Error creating configuration:", insertError);
      throw new Error(`Failed to create configuration: ${insertError.message}`);
    }

    console.log("Configuration created successfully:", basicConfig);

    // Fetch the configuration with relationships
    try {
      const { data: configWithRelations, error: relationError } = await supabase
        .from('model_configurations')
        .select(`
          *,
          engine:engine_id(*),
          brakes:brake_system_id(*),
          frame:frame_id(*),
          suspension:suspension_id(*),
          wheels:wheel_id(*)
        `)
        .eq('id', basicConfig.id)
        .single();

      if (relationError) {
        console.warn("Could not fetch relationships, returning basic config:", relationError);
        return basicConfig;
      }

      return configWithRelations;
    } catch (relationError) {
      console.warn("Relationship fetch failed, returning basic config:", relationError);
      return basicConfig;
    }
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    throw error;
  }
};

export const updateConfiguration = async (id: string, configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Updating configuration:", id, "with data:", configData);
    
    // Remove read-only fields that shouldn't be updated
    const { engine, brakes, frame, suspension, wheels, colors, created_at, updated_at, ...updateData } = configData;
    
    // Clean foreign key values
    if (updateData.engine_id === '') updateData.engine_id = null;
    if (updateData.brake_system_id === '') updateData.brake_system_id = null;
    if (updateData.frame_id === '') updateData.frame_id = null;
    if (updateData.suspension_id === '') updateData.suspension_id = null;
    if (updateData.wheel_id === '') updateData.wheel_id = null;

    // Convert numeric fields
    if (updateData.seat_height_mm !== undefined) {
      updateData.seat_height_mm = updateData.seat_height_mm ? Number(updateData.seat_height_mm) : null;
    }
    if (updateData.weight_kg !== undefined) {
      updateData.weight_kg = updateData.weight_kg ? Number(updateData.weight_kg) : null;
    }
    if (updateData.wheelbase_mm !== undefined) {
      updateData.wheelbase_mm = updateData.wheelbase_mm ? Number(updateData.wheelbase_mm) : null;
    }
    if (updateData.fuel_capacity_l !== undefined) {
      updateData.fuel_capacity_l = updateData.fuel_capacity_l ? Number(updateData.fuel_capacity_l) : null;
    }
    if (updateData.ground_clearance_mm !== undefined) {
      updateData.ground_clearance_mm = updateData.ground_clearance_mm ? Number(updateData.ground_clearance_mm) : null;
    }
    if (updateData.price_premium_usd !== undefined) {
      updateData.price_premium_usd = updateData.price_premium_usd ? Number(updateData.price_premium_usd) : null;
    }

    const { data, error } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error updating configuration:", error);
      throw new Error(`Failed to update configuration: ${error.message}`);
    }
    
    console.log("Configuration updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in updateConfiguration:", error);
    throw error;
  }
};

export const deleteConfiguration = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting configuration:", id);
    
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting configuration:", error);
      throw new Error(`Failed to delete configuration: ${error.message}`);
    }
    
    console.log("Configuration deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteConfiguration:", error);
    throw error;
  }
};
