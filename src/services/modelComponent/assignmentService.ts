
import { supabase } from "@/integrations/supabase/client";
import { ModelComponentAssignment } from "./types";

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

export const bulkAssignComponents = async (
  assignments: Array<{
    modelId: string;
    componentType: ModelComponentAssignment['component_type'];
    componentId: string;
  }>
): Promise<boolean> => {
  const insertData = assignments.map(assignment => ({
    model_id: assignment.modelId,
    component_type: assignment.componentType,
    component_id: assignment.componentId,
    assignment_type: 'standard',
    is_default: true
  }));

  const { error } = await supabase
    .from('model_component_assignments')
    .upsert(insertData, {
      onConflict: 'model_id,component_type'
    });
    
  if (error) {
    console.error('Error bulk assigning components:', error);
    throw error;
  }
  
  return true;
};
