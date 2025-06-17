
import { supabase } from "@/integrations/supabase/client";

export interface ComponentLinkResult {
  success: boolean;
  error?: string;
}

export const linkComponentToConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string
): Promise<ComponentLinkResult> => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({ [fieldName]: componentId })
      .eq('id', configurationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error linking component:', error);
    return { success: false, error: error.message };
  }
};

export const unlinkComponentFromConfiguration = async (
  configurationId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
): Promise<ComponentLinkResult> => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({ [fieldName]: null })
      .eq('id', configurationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error unlinking component:', error);
    return { success: false, error: error.message };
  }
};

export const getComponentUsageInConfigurations = async (
  componentId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'
) => {
  try {
    const fieldName = `${componentType}_id`;
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select('id, name, model_year_id')
      .eq(fieldName, componentId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching component usage:', error);
    return [];
  }
};
