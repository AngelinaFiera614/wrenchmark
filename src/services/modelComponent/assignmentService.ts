
import { supabase } from "@/integrations/supabase/client";
import { ModelComponentAssignment, ComponentType } from "./types";

export const assignComponentToModel = async (
  modelId: string,
  componentType: ComponentType,
  componentId: string
): Promise<ModelComponentAssignment | null> => {
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
};

export const removeComponentFromModel = async (
  modelId: string,
  componentType: ComponentType
): Promise<boolean> => {
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
};

export const bulkAssignComponents = async (
  assignments: Array<{
    modelId: string;
    componentType: ComponentType;
    componentId: string;
  }>
): Promise<boolean> => {
  try {
    console.log('Bulk assigning components:', assignments);
    
    const insertData = assignments.map(assignment => ({
      model_id: assignment.modelId,
      component_type: assignment.componentType,
      component_id: assignment.componentId,
      assignment_type: 'standard',
      is_default: true,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('model_component_assignments')
      .upsert(insertData, {
        onConflict: 'model_id,component_type',
        ignoreDuplicates: false
      });
      
    if (error) {
      console.error('Error bulk assigning components:', error);
      throw new Error(`Bulk assignment failed: ${error.message}`);
    }
    
    console.log('Bulk assignment successful');
    return true;
  } catch (error) {
    console.error('Bulk assignment service error:', error);
    throw error;
  }
};
