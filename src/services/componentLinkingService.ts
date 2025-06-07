
import { supabase } from "@/integrations/supabase/client";

interface LinkResult {
  success: boolean;
  error?: string;
}

// Link a component to a configuration (with override)
export const linkComponentToConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<LinkResult> => {
  try {
    const overrideField = `${componentType}_override`;
    const componentField = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({
        [overrideField]: true,
        [componentField]: componentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', configurationId);

    if (error) {
      console.error(`Error linking component to configuration:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Successfully linked ${componentType} ${componentId} to configuration ${configurationId}`);
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error in linkComponentToConfiguration:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Unlink a component from a configuration (remove override)
export const unlinkComponentFromConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<LinkResult> => {
  try {
    const overrideField = `${componentType}_override`;
    const componentField = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({
        [overrideField]: false,
        [componentField]: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', configurationId);

    if (error) {
      console.error(`Error unlinking component from configuration:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Successfully unlinked ${componentType} from configuration ${configurationId}`);
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error in unlinkComponentFromConfiguration:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Link a component to a model (model-level assignment) - Fixed with proper upsert
export const linkComponentToModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<LinkResult> => {
  try {
    console.log(`Attempting to link ${componentType} ${componentId} to model ${modelId}`);
    
    // Use upsert to handle existing assignments
    const { error } = await supabase
      .from('model_component_assignments')
      .upsert({
        model_id: modelId,
        component_type: componentType,
        component_id: componentId,
        assignment_type: 'standard',
        is_default: true,
        notes: 'Assigned via admin interface',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'model_id, component_type'
      });

    if (error) {
      console.error(`Database error linking component:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Successfully linked ${componentType} ${componentId} to model ${modelId}`);
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error in linkComponentToModel:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Get component usage in configurations
export const getComponentUsageInConfigurations = async (
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
) => {
  try {
    const componentField = `${componentType}_id`;
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        id,
        name,
        model_years!inner(
          year,
          motorcycle_models!inner(name)
        )
      `)
      .eq(componentField, componentId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error getting component usage:", error);
    throw error;
  }
};

// Get model component assignments for a specific model
export const getModelComponentAssignments = async (modelId: string) => {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .select('*')
      .eq('model_id', modelId);

    if (error) {
      console.error('Error fetching model component assignments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getModelComponentAssignments:', error);
    throw error;
  }
};
