
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

// Fixed: Link a component to a model (model-level assignment) with proper duplicate handling
export const linkComponentToModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<LinkResult> => {
  try {
    console.log(`Attempting to link ${componentType} ${componentId} to model ${modelId}`);
    
    // First check if an assignment already exists for this component type
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
      // If the component is already assigned, don't create a duplicate
      if (existingAssignment.component_id === componentId) {
        console.log(`Component ${componentId} is already assigned to model ${modelId} for ${componentType}`);
        return { success: true };
      }
      
      // Update existing assignment to new component
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

// Remove a component assignment from a model
export const unlinkComponentFromModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<LinkResult> => {
  try {
    console.log(`Removing ${componentType} assignment from model ${modelId}`);
    
    const { error } = await supabase
      .from('model_component_assignments')
      .delete()
      .eq('model_id', modelId)
      .eq('component_type', componentType);

    if (error) {
      console.error(`Error removing component assignment:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Successfully removed ${componentType} assignment from model ${modelId}`);
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error in unlinkComponentFromModel:`, error);
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

// Check if a component is assigned to a specific model
export const isComponentAssignedToModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .select('id')
      .eq('model_id', modelId)
      .eq('component_type', componentType)
      .eq('component_id', componentId)
      .maybeSingle();

    if (error) {
      console.error('Error checking component assignment:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isComponentAssignedToModel:', error);
    return false;
  }
};

// Check if a component is assigned to a specific configuration (trim override)
export const isComponentAssignedToConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<boolean> => {
  try {
    const componentField = `${componentType}_id`;
    const overrideField = `${componentType}_override`;
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`${componentField}, ${overrideField}`)
      .eq('id', configurationId)
      .single();

    if (error) {
      console.error('Error checking configuration assignment:', error);
      return false;
    }

    return data && data[overrideField] === true && data[componentField] === componentId;
  } catch (error) {
    console.error('Error in isComponentAssignedToConfiguration:', error);
    return false;
  }
};
