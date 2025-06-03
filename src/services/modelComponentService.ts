import { supabase } from "@/integrations/supabase/client";

export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_type: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';
  component_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComponentUsageStats {
  id: string;
  component_type: string;
  component_id: string;
  usage_count: number;
  model_count: number;
  trim_count: number;
  last_used_at: string | null;
}

export interface EffectiveComponents {
  engine_id: string | null;
  brake_system_id: string | null;
  frame_id: string | null;
  suspension_id: string | null;
  wheel_id: string | null;
  engine_inherited: boolean;
  brake_system_inherited: boolean;
  frame_inherited: boolean;
  suspension_inherited: boolean;
  wheel_inherited: boolean;
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
export const getEffectiveComponents = async (configId: string): Promise<EffectiveComponents | null> => {
  const { data, error } = await supabase.rpc('get_effective_components', {
    config_id: configId
  });
  
  if (error) {
    console.error('Error getting effective components:', error);
    throw error;
  }
  
  return data?.[0] || null;
};

// Set trim override for component
export const setTrimComponentOverride = async (
  configId: string,
  componentType: ModelComponentAssignment['component_type'],
  componentId: string | null
): Promise<boolean> => {
  const overrideField = `${componentType}_override`;
  const componentField = `${componentType}_id`;
  
  const updateData = {
    [overrideField]: componentId !== null,
    [componentField]: componentId,
    updated_at: new Date().toISOString()
  };
  
  const { error } = await supabase
    .from('model_configurations')
    .update(updateData)
    .eq('id', configId);
    
  if (error) {
    console.error('Error setting trim component override:', error);
    throw error;
  }
  
  return true;
};

// Get component usage statistics
export const getComponentUsageStats = async (
  componentType?: string,
  componentId?: string
): Promise<ComponentUsageStats[]> => {
  let query = supabase.from('component_usage_stats').select('*');
  
  if (componentType) {
    query = query.eq('component_type', componentType);
  }
  
  if (componentId) {
    query = query.eq('component_id', componentId);
  }
  
  const { data, error } = await query.order('usage_count', { ascending: false });
  
  if (error) {
    console.error('Error fetching component usage stats:', error);
    throw error;
  }
  
  return data || [];
};

// Check if component can be deleted (not in use)
export const canDeleteComponent = async (
  componentType: string,
  componentId: string
): Promise<{ canDelete: boolean; usageCount: number; models: string[]; trims: string[] }> => {
  // Check model assignments
  const { data: modelAssignments } = await supabase
    .from('model_component_assignments')
    .select(`
      model_id,
      motorcycle_models!inner(name)
    `)
    .eq('component_type', componentType)
    .eq('component_id', componentId);
    
  // Check trim assignments (direct assignments)
  const componentField = `${componentType}_id`;
  const { data: trimAssignments } = await supabase
    .from('model_configurations')
    .select(`
      id, 
      name,
      model_years!inner(
        motorcycle_models!inner(name)
      )
    `)
    .eq(componentField, componentId);
    
  const modelNames = modelAssignments?.map(a => (a as any).motorcycle_models?.name).filter(Boolean) || [];
  const trimNames = trimAssignments?.map(t => {
    const trimData = t as any;
    return `${trimData.model_years?.motorcycle_models?.name} - ${trimData.name}`;
  }).filter(Boolean) || [];
  
  const totalUsage = (modelAssignments?.length || 0) + (trimAssignments?.length || 0);
  
  return {
    canDelete: totalUsage === 0,
    usageCount: totalUsage,
    models: modelNames,
    trims: trimNames
  };
};
