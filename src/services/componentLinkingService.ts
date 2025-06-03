
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction, auditActions } from "@/services/security/adminAuditLogger";

export interface ComponentLinkingResult {
  success: boolean;
  error?: string;
}

export const linkComponentToConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<ComponentLinkingResult> => {
  try {
    // Get current configuration for audit logging
    const { data: currentConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', configurationId)
      .single();

    if (fetchError) {
      console.error('Error fetching current configuration:', fetchError);
      return { success: false, error: 'Failed to fetch configuration' };
    }

    const oldValue = currentConfig[`${componentType}_id`];
    
    // Update the configuration with the new component
    const updateData = { [`${componentType}_id`]: componentId };
    
    const { error: updateError } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', configurationId);

    if (updateError) {
      console.error('Error linking component:', updateError);
      return { success: false, error: 'Failed to link component' };
    }

    // Log the admin action (optional, remove if adminAuditLogger doesn't exist)
    try {
      await logAdminAction({
        action: `component_link_${componentType}`,
        tableName: 'model_configurations',
        recordId: configurationId,
        oldValues: { [`${componentType}_id`]: oldValue },
        newValues: { [`${componentType}_id`]: componentId }
      });
    } catch (auditError) {
      console.warn('Could not log admin action:', auditError);
      // Don't fail the operation if audit logging fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error in linkComponentToConfiguration:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

export const unlinkComponentFromConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<ComponentLinkingResult> => {
  try {
    // Get current configuration for audit logging
    const { data: currentConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', configurationId)
      .single();

    if (fetchError) {
      console.error('Error fetching current configuration:', fetchError);
      return { success: false, error: 'Failed to fetch configuration' };
    }

    const oldValue = currentConfig[`${componentType}_id`];
    
    // Remove the component from the configuration
    const updateData = { [`${componentType}_id`]: null };
    
    const { error: updateError } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', configurationId);

    if (updateError) {
      console.error('Error unlinking component:', updateError);
      return { success: false, error: 'Failed to unlink component' };
    }

    // Log the admin action
    await logAdminAction({
      action: `component_unlink_${componentType}`,
      tableName: 'model_configurations',
      recordId: configurationId,
      oldValues: { [`${componentType}_id`]: oldValue },
      newValues: { [`${componentType}_id`]: null }
    });

    return { success: true };
  } catch (error) {
    console.error('Error in unlinkComponentFromConfiguration:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

export const getComponentUsageInConfigurations = async (
  componentId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<{ configurations: any[], count: number }> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        id,
        name,
        model_year_id,
        model_years!inner(
          year,
          motorcycle_models!inner(
            name,
            brands!inner(name)
          )
        )
      `)
      .eq(`${componentType}_id`, componentId);

    if (error) {
      console.error('Error fetching component usage:', error);
      return { configurations: [], count: 0 };
    }

    return { configurations: data || [], count: data?.length || 0 };
  } catch (error) {
    console.error('Error in getComponentUsageInConfigurations:', error);
    return { configurations: [], count: 0 };
  }
};
