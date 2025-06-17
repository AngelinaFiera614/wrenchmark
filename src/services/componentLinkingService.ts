
import { supabase } from "@/integrations/supabase/client";

export interface ComponentLinkResult {
  success: boolean;
  error?: string;
}

export const linkComponentToConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<ComponentLinkResult> => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({ [fieldName]: componentId })
      .eq('id', configurationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error linking component:', error);
    return { success: false, error: error.message };
  }
};

export const unlinkComponentFromConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<ComponentLinkResult> => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({ [fieldName]: null })
      .eq('id', configurationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error unlinking component:', error);
    return { success: false, error: error.message };
  }
};

export const getComponentUsageInConfigurations = async (
  componentId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
) => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select('id, name, model_year_id')
      .eq(fieldName, componentId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching component usage:', error);
    return [];
  }
};

// Additional functions for model-level assignments
export const linkComponentToModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<ComponentLinkResult> => {
  try {
    const { error } = await supabase
      .from('model_component_assignments')
      .insert({
        model_id: modelId,
        component_type: componentType,
        component_id: componentId,
        is_default: true
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error linking component to model:', error);
    return { success: false, error: error.message };
  }
};

export const unlinkComponentFromModel = async (
  modelId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<ComponentLinkResult> => {
  try {
    const { error } = await supabase
      .from('model_component_assignments')
      .delete()
      .eq('model_id', modelId)
      .eq('component_type', componentType)
      .eq('component_id', componentId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error unlinking component from model:', error);
    return { success: false, error: error.message };
  }
};

export const getModelComponentAssignments = async (modelId: string) => {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .select('*')
      .eq('model_id', modelId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching model component assignments:', error);
    return [];
  }
};

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
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return !!data;
  } catch (error) {
    console.error('Error checking component assignment:', error);
    return false;
  }
};

export const isComponentAssignedToConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<boolean> => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(fieldName)
      .eq('id', configurationId)
      .single();

    if (error) throw error;

    return data?.[fieldName] === componentId;
  } catch (error) {
    console.error('Error checking configuration component assignment:', error);
    return false;
  }
};
