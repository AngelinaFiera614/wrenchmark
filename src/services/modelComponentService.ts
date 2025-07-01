import { supabase } from '@/integrations/supabase/client';

export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_type: string;
  component_id: string;
  assignment_type: string;
  is_default: boolean;
  effective_from_year?: number;
  effective_to_year?: number;
  notes?: string;
}

export interface ComponentUsage {
  componentId: string;
  componentType: string;
  usageCount: number;
  usedInModels: string[];
  usedInConfigurations: string[];
}

export type ComponentType = 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';

export async function getModelComponentAssignments(modelId: string): Promise<ModelComponentAssignment[]> {
  try {
    console.log('Fetching component assignments for model:', modelId);
    
    const { data, error } = await supabase
      .from('model_component_assignments')
      .select('*')
      .eq('model_id', modelId);

    if (error) {
      console.error('Error fetching model component assignments:', error);
      throw error;
    }

    console.log('Found component assignments:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getModelComponentAssignments:', error);
    return [];
  }
}

export async function createModelComponentAssignment(assignment: Omit<ModelComponentAssignment, 'id'>): Promise<ModelComponentAssignment | null> {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .insert([assignment])
      .select()
      .single();

    if (error) {
      console.error('Error creating model component assignment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createModelComponentAssignment:', error);
    return null;
  }
}

export async function updateModelComponentAssignment(id: string, updates: Partial<ModelComponentAssignment>): Promise<ModelComponentAssignment | null> {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating model component assignment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateModelComponentAssignment:', error);
    return null;
  }
}

export async function deleteModelComponentAssignment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('model_component_assignments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting model component assignment:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteModelComponentAssignment:', error);
    return false;
  }
}

// Assignment service functions
export async function assignComponentToModel(
  modelId: string,
  componentType: ComponentType,
  componentId: string
): Promise<ModelComponentAssignment | null> {
  try {
    console.log(`Assigning ${componentType} component ${componentId} to model ${modelId}`);
    
    // Use upsert with proper conflict resolution
    const { data, error } = await supabase
      .from('model_component_assignments')
      .upsert({
        model_id: modelId,
        component_type: componentType,
        component_id: componentId,
        assignment_type: 'standard',
        is_default: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'model_id,component_type',
        ignoreDuplicates: false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error assigning component to model:', error);
      throw new Error(`Failed to assign ${componentType}: ${error.message}`);
    }
    
    console.log('Component assignment successful:', data);
    return data;
  } catch (error) {
    console.error('Assignment service error:', error);
    throw error;
  }
}

export async function removeComponentFromModel(
  modelId: string,
  componentType: ComponentType
): Promise<boolean> {
  try {
    console.log(`Removing ${componentType} component from model ${modelId}`);
    
    const { error } = await supabase
      .from('model_component_assignments')
      .delete()
      .eq('model_id', modelId)
      .eq('component_type', componentType);
      
    if (error) {
      console.error('Error removing component from model:', error);
      throw new Error(`Failed to remove ${componentType}: ${error.message}`);
    }
    
    console.log('Component removal successful');
    return true;
  } catch (error) {
    console.error('Removal service error:', error);
    throw error;
  }
}

// Component usage and deletion functions
export async function canDeleteComponent(
  componentId: string,
  componentType: ComponentType
): Promise<{ canDelete: boolean; usage?: ComponentUsage }> {
  try {
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
    const canDelete = totalUsage === 0;
    
    const usage: ComponentUsage = {
      componentId,
      componentType,
      usageCount: totalUsage,
      usedInModels: modelNames,
      usedInConfigurations: trimNames
    };
    
    return { canDelete, usage };
  } catch (error) {
    console.error('Error checking component deletion eligibility:', error);
    return { canDelete: false };
  }
}

// Configuration service functions
export async function getConfigurationsWithComponents(selectedYear: string) {
  try {
    const { data: configurations, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engines(*),
        brake_systems(*),
        frames(*),
        suspensions(*),
        wheels(*)
      `)
      .eq('model_year_id', selectedYear);

    if (error) {
      console.error('Error fetching configurations with components:', error);
      throw error;
    }

    return configurations || [];
  } catch (error) {
    console.error('Error in getConfigurationsWithComponents:', error);
    return [];
  }
}
