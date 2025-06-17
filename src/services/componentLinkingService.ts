
import { supabase } from "@/integrations/supabase/client";

export interface ComponentAssignment {
  id: string;
  model_id: string;
  component_id: string;
  component_type: string;
  assignment_type: string;
  effective_from_year?: number;
  effective_to_year?: number;
  is_default: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ComponentLinkingStats {
  totalAssignments: number;
  assignmentsByType: Record<string, number>;
  modelsWithComponents: number;
  componentsInUse: number;
}

// Link a component to a motorcycle model
export async function linkComponentToModel(
  modelId: string, 
  componentId: string, 
  componentType: string,
  assignmentType: string = 'standard',
  effectiveFromYear?: number,
  effectiveToYear?: number,
  notes?: string
): Promise<ComponentAssignment | null> {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .insert({
        model_id: modelId,
        component_id: componentId,
        component_type: componentType,
        assignment_type: assignmentType,
        effective_from_year: effectiveFromYear,
        effective_to_year: effectiveToYear,
        is_default: true,
        notes: notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error linking component to model:', error);
    return null;
  }
}

// Unlink a component from a motorcycle model
export async function unlinkComponentFromModel(
  modelId: string,
  componentId: string,
  componentType: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('model_component_assignments')
      .delete()
      .eq('model_id', modelId)
      .eq('component_id', componentId)
      .eq('component_type', componentType);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unlinking component from model:', error);
    return false;
  }
}

// Get all component assignments for a model
export async function getModelComponentAssignments(modelId: string): Promise<ComponentAssignment[]> {
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
}

// Check if a component is assigned to a model
export async function isComponentAssignedToModel(
  modelId: string,
  componentId: string,
  componentType: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('model_component_assignments')
      .select('id')
      .eq('model_id', modelId)
      .eq('component_id', componentId)
      .eq('component_type', componentType)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking component assignment:', error);
    return false;
  }
}

// Link component to configuration
export async function linkComponentToConfiguration(
  configurationId: string,
  componentId: string,
  componentType: string
): Promise<boolean> {
  try {
    const updateField = `${componentType}_id`;
    const { error } = await supabase
      .from('model_configurations')
      .update({ [updateField]: componentId })
      .eq('id', configurationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error linking component to configuration:', error);
    return false;
  }
}

// Unlink component from configuration
export async function unlinkComponentFromConfiguration(
  configurationId: string,
  componentType: string
): Promise<boolean> {
  try {
    const updateField = `${componentType}_id`;
    const { error } = await supabase
      .from('model_configurations')
      .update({ [updateField]: null })
      .eq('id', configurationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unlinking component from configuration:', error);
    return false;
  }
}

// Check if component is assigned to configuration
export async function isComponentAssignedToConfiguration(
  configurationId: string,
  componentId: string,
  componentType: string
): Promise<boolean> {
  try {
    const selectField = `${componentType}_id`;
    const { data, error } = await supabase
      .from('model_configurations')
      .select(selectField)
      .eq('id', configurationId)
      .single();

    if (error) throw error;
    return data?.[selectField] === componentId;
  } catch (error) {
    console.error('Error checking configuration assignment:', error);
    return false;
  }
}

// Get component usage in configurations
export async function getComponentUsageInConfigurations(
  componentId: string,
  componentType: string
): Promise<any[]> {
  try {
    const selectField = `${componentType}_id`;
    const { data, error } = await supabase
      .from('model_configurations')
      .select('*')
      .eq(selectField, componentId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching component usage in configurations:', error);
    return [];
  }
}

// Get component linking statistics
export async function getComponentLinkingStats(): Promise<ComponentLinkingStats> {
  try {
    const { data: assignments, error } = await supabase
      .from('model_component_assignments')
      .select('component_type, model_id, component_id');

    if (error) throw error;

    const totalAssignments = assignments.length;
    const assignmentsByType: Record<string, number> = {};
    const uniqueModels = new Set();
    const uniqueComponents = new Set();

    assignments.forEach(assignment => {
      assignmentsByType[assignment.component_type] = 
        (assignmentsByType[assignment.component_type] || 0) + 1;
      uniqueModels.add(assignment.model_id);
      uniqueComponents.add(assignment.component_id);
    });

    return {
      totalAssignments,
      assignmentsByType,
      modelsWithComponents: uniqueModels.size,
      componentsInUse: uniqueComponents.size
    };
  } catch (error) {
    console.error('Error fetching component linking stats:', error);
    return {
      totalAssignments: 0,
      assignmentsByType: {},
      modelsWithComponents: 0,
      componentsInUse: 0
    };
  }
}

// Bulk link components to multiple models
export async function bulkLinkComponents(
  assignments: Array<{
    modelId: string;
    componentId: string;
    componentType: string;
    assignmentType?: string;
    effectiveFromYear?: number;
    effectiveToYear?: number;
    notes?: string;
  }>
): Promise<boolean> {
  try {
    const insertData = assignments.map(assignment => ({
      model_id: assignment.modelId,
      component_id: assignment.componentId,
      component_type: assignment.componentType,
      assignment_type: assignment.assignmentType || 'standard',
      effective_from_year: assignment.effectiveFromYear,
      effective_to_year: assignment.effectiveToYear,
      is_default: true,
      notes: assignment.notes
    }));

    const { error } = await supabase
      .from('model_component_assignments')
      .insert(insertData);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error bulk linking components:', error);
    return false;
  }
}
