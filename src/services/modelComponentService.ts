
import { supabase } from '@/integrations/supabase/client';

export interface ComponentUsage {
  componentId: string;
  componentType: string;
  usageCount: number;
  usedInModels: string[];
  usedInConfigurations: string[];
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
