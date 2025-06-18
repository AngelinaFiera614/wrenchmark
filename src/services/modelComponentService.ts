
import { supabase } from "@/integrations/supabase/client";

export interface ModelComponentAssignment {
  id: string;
  model_id: string;
  component_id: string;
  component_type: string;
  assignment_type: string;
  is_default: boolean;
  effective_from_year?: number;
  effective_to_year?: number;
  notes?: string;
}

export interface ConfigurationWithComponents {
  id: string;
  name: string;
  model_year_id: string;
  engine_id?: string;
  brake_system_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
  is_default: boolean;
  // Component data
  engine?: any;
  brake_system?: any;
  frame?: any;
  suspension?: any;
  wheel?: any;
}

// Get model component assignments
export async function getModelComponentAssignments(modelId: string): Promise<ModelComponentAssignment[]> {
  const { data, error } = await supabase
    .from('model_component_assignments')
    .select('*')
    .eq('model_id', modelId);

  if (error) {
    console.error('Error fetching model component assignments:', error);
    return [];
  }

  return data || [];
}

// Create component assignment
export async function createComponentAssignment(assignment: Omit<ModelComponentAssignment, 'id'>): Promise<boolean> {
  const { error } = await supabase
    .from('model_component_assignments')
    .insert(assignment);

  if (error) {
    console.error('Error creating component assignment:', error);
    return false;
  }

  return true;
}

// Update configuration with components
export async function updateConfigurationComponents(
  configurationId: string,
  components: {
    engine_id?: string;
    brake_system_id?: string;
    frame_id?: string;
    suspension_id?: string;
    wheel_id?: string;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('model_configurations')
    .update(components)
    .eq('id', configurationId);

  if (error) {
    console.error('Error updating configuration components:', error);
    return false;
  }

  return true;
}

// Get configurations with component data
export async function getConfigurationsWithComponents(modelYearId: string): Promise<ConfigurationWithComponents[]> {
  const { data, error } = await supabase
    .from('model_configurations')
    .select(`
      *,
      engines:engine_id(*),
      brake_systems:brake_system_id(*),
      frames:frame_id(*),
      suspensions:suspension_id(*),
      wheels:wheel_id(*)
    `)
    .eq('model_year_id', modelYearId);

  if (error) {
    console.error('Error fetching configurations with components:', error);
    return [];
  }

  return (data || []).map(config => ({
    ...config,
    engine: config.engines || undefined,
    brake_system: config.brake_systems || undefined,
    frame: config.frames || undefined,
    suspension: config.suspensions || undefined,
    wheel: config.wheels || undefined
  }));
}

// Sync model assignments to configuration
export async function syncModelAssignmentsToConfiguration(
  configurationId: string,
  modelId: string
): Promise<boolean> {
  try {
    // Get model default assignments
    const assignments = await getModelComponentAssignments(modelId);
    
    const updates: any = {};
    
    assignments.forEach(assignment => {
      if (assignment.is_default) {
        switch (assignment.component_type) {
          case 'engine':
            updates.engine_id = assignment.component_id;
            break;
          case 'brake_system':
            updates.brake_system_id = assignment.component_id;
            break;
          case 'frame':
            updates.frame_id = assignment.component_id;
            break;
          case 'suspension':
            updates.suspension_id = assignment.component_id;
            break;
          case 'wheel':
            updates.wheel_id = assignment.component_id;
            break;
        }
      }
    });

    if (Object.keys(updates).length > 0) {
      return await updateConfigurationComponents(configurationId, updates);
    }

    return true;
  } catch (error) {
    console.error('Error syncing model assignments to configuration:', error);
    return false;
  }
}
