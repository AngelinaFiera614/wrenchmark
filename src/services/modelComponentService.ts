
import { supabase } from "@/integrations/supabase/client";

export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_type: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';
  component_id: string;
  assignment_type: string;
  is_default: boolean;
  effective_from_year?: number;
  effective_to_year?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Get model-level component assignments
export const getModelComponentAssignments = async (modelId: string): Promise<ModelComponentAssignment[]> => {
  const { data, error } = await supabase
    .from('model_component_assignments')
    .select('*')
    .eq('model_id', modelId);
    
  if (error) {
    console.error('Error fetching model component assignments:', error);
    throw error;
  }
  
  return data || [];
};

// Assign component to model
export const assignComponentToModel = async (
  modelId: string,
  componentType: ModelComponentAssignment['component_type'],
  componentId: string
): Promise<ModelComponentAssignment | null> => {
  const { data, error } = await supabase
    .from('model_component_assignments')
    .insert({
      model_id: modelId,
      component_type: componentType,
      component_id: componentId,
      is_default: true
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error assigning component to model:', error);
    throw error;
  }
  
  return data;
};

// Update model component assignment
export const updateModelComponentAssignment = async (
  modelId: string,
  componentType: ModelComponentAssignment['component_type'],
  componentId: string
): Promise<ModelComponentAssignment | null> => {
  const { data, error } = await supabase
    .from('model_component_assignments')
    .update({ component_id: componentId, updated_at: new Date().toISOString() })
    .eq('model_id', modelId)
    .eq('component_type', componentType)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating model component assignment:', error);
    throw error;
  }
  
  return data;
};

// Remove component from model
export const removeComponentFromModel = async (
  modelId: string,
  componentType: ModelComponentAssignment['component_type']
): Promise<boolean> => {
  const { error } = await supabase
    .from('model_component_assignments')
    .delete()
    .eq('model_id', modelId)
    .eq('component_type', componentType);
    
  if (error) {
    console.error('Error removing component from model:', error);
    throw error;
  }
  
  return true;
};

// Get effective components for a configuration (with inheritance)
export const getEffectiveComponents = async (configurationId: string) => {
  const { data, error } = await supabase
    .rpc('get_effective_components', { config_id: configurationId });
    
  if (error) {
    console.error('Error getting effective components:', error);
    throw error;
  }
  
  return data;
};
