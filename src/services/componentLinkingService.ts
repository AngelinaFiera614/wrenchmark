
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
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
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
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Link a component to a model (model-level assignment)
export const linkComponentToModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<LinkResult> => {
  try {
    const { error } = await supabase
      .from('model_component_assignments')
      .upsert({
        model_id: modelId,
        component_type: componentType,
        component_id: componentId,
        assignment_type: 'standard',
        is_default: true,
        notes: 'Assigned via admin interface'
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
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
