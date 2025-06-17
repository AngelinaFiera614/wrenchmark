
import { supabase } from '@/integrations/supabase/client';

export interface ComponentUsage {
  componentId: string;
  componentType: string;
  usageCount: number;
  usedInModels: string[];
  usedInConfigurations: string[];
}

export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_id: string;
  component_type: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';
  assignment_type: string;
  is_default: boolean;
  effective_from_year?: number;
  effective_to_year?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const canDeleteComponent = async (
  componentId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<{ canDelete: boolean; reason?: string; usage?: ComponentUsage }> => {
  try {
    // Check model-level assignments
    const { data: modelAssignments, error: modelError } = await supabase
      .from('model_component_assignments')
      .select('model_id')
      .eq('component_id', componentId)
      .eq('component_type', componentType);

    if (modelError) {
      console.error('Error checking model assignments:', modelError);
      throw modelError;
    }

    // Check configuration-level assignments
    const columnName = `${componentType}_id`;
    const { data: configAssignments, error: configError } = await supabase
      .from('model_configurations')
      .select('id, model_year_id')
      .eq(columnName, componentId);

    if (configError) {
      console.error('Error checking configuration assignments:', configError);
      throw configError;
    }

    const totalUsage = (modelAssignments?.length || 0) + (configAssignments?.length || 0);
    
    if (totalUsage > 0) {
      return {
        canDelete: false,
        reason: `Component is used in ${modelAssignments?.length || 0} models and ${configAssignments?.length || 0} configurations`,
        usage: {
          componentId,
          componentType,
          usageCount: totalUsage,
          usedInModels: modelAssignments?.map(m => m.model_id) || [],
          usedInConfigurations: configAssignments?.map(c => c.id) || []
        }
      };
    }

    return { canDelete: true };
  } catch (error) {
    console.error('Error checking component deletion eligibility:', error);
    return {
      canDelete: false,
      reason: 'Error checking component usage'
    };
  }
};

export const deleteComponent = async (
  componentId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<boolean> => {
  const eligibilityCheck = await canDeleteComponent(componentId, componentType);
  
  if (!eligibilityCheck.canDelete) {
    throw new Error(eligibilityCheck.reason || 'Component cannot be deleted');
  }

  // Map component type to table name
  const tableMap = {
    engine: 'engines',
    brake_system: 'brake_systems',
    frame: 'frames',
    suspension: 'suspensions',
    wheel: 'wheels'
  };

  const tableName = tableMap[componentType];
  
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', componentId);

  if (error) {
    console.error(`Error deleting ${componentType}:`, error);
    throw error;
  }

  return true;
};

export const getComponentUsageStats = async (
  componentId: string,
  componentType: string
): Promise<ComponentUsage | null> => {
  try {
    const eligibilityCheck = await canDeleteComponent(
      componentId,
      componentType as 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
    );
    
    return eligibilityCheck.usage || null;
  } catch (error) {
    console.error('Error getting component usage stats:', error);
    return null;
  }
};

// Add missing functions that are being imported elsewhere
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

export const assignComponentToModel = async (
  modelId: string,
  componentType: ModelComponentAssignment['component_type'],
  componentId: string
): Promise<ModelComponentAssignment | null> => {
  // First check if assignment already exists
  const { data: existing } = await supabase
    .from('model_component_assignments')
    .select('*')
    .eq('model_id', modelId)
    .eq('component_type', componentType)
    .single();

  if (existing) {
    // Update existing assignment
    const { data, error } = await supabase
      .from('model_component_assignments')
      .update({ 
        component_id: componentId, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', existing.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating model component assignment:', error);
      throw error;
    }
    
    return data;
  } else {
    // Create new assignment
    const { data, error } = await supabase
      .from('model_component_assignments')
      .insert({
        model_id: modelId,
        component_type: componentType,
        component_id: componentId,
        assignment_type: 'standard',
        is_default: true
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error assigning component to model:', error);
      throw error;
    }
    
    return data;
  }
};

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

export const updateModelComponentAssignment = async (
  assignmentId: string,
  updates: Partial<ModelComponentAssignment>
): Promise<ModelComponentAssignment> => {
  const { data, error } = await supabase
    .from('model_component_assignments')
    .update(updates)
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating model component assignment:', error);
    throw error;
  }

  return data;
};
