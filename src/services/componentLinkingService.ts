
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

// Fixed: Link a component to a model (model-level assignment) - Proper upsert with better conflict handling
export const linkComponentToModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<LinkResult> => {
  try {
    console.log(`Attempting to link ${componentType} ${componentId} to model ${modelId}`);
    
    // First check if an assignment already exists
    const { data: existingAssignment, error: checkError } = await supabase
      .from('model_component_assignments')
      .select('id, component_id')
      .eq('model_id', modelId)
      .eq('component_type', componentType)
      .maybeSingle();

    if (checkError) {
      console.error(`Error checking existing assignment:`, checkError);
      return { success: false, error: checkError.message };
    }

    if (existingAssignment) {
      // Update existing assignment
      const { error: updateError } = await supabase
        .from('model_component_assignments')
        .update({
          component_id: componentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAssignment.id);

      if (updateError) {
        console.error(`Error updating existing assignment:`, updateError);
        return { success: false, error: updateError.message };
      }

      console.log(`Successfully updated existing ${componentType} assignment for model ${modelId}`);
    } else {
      // Create new assignment
      const { error: insertError } = await supabase
        .from('model_component_assignments')
        .insert({
          model_id: modelId,
          component_type: componentType,
          component_id: componentId,
          assignment_type: 'standard',
          is_default: true,
          notes: 'Assigned via admin interface'
        });

      if (insertError) {
        console.error(`Error creating new assignment:`, insertError);
        return { success: false, error: insertError.message };
      }

      console.log(`Successfully created new ${componentType} assignment for model ${modelId}`);
    }

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
