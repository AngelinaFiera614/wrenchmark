
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
