
import { supabase } from "@/integrations/supabase/client";
import { EffectiveComponents } from "./types";
import { ModelComponentAssignment } from "./types";

// Get effective components for a configuration (with inheritance)
export const getEffectiveComponents = async (configId: string): Promise<EffectiveComponents | null> => {
  const { data, error } = await supabase.rpc('get_effective_components', {
    config_id: configId
  });
  
  if (error) {
    console.error('Error getting effective components:', error);
    throw error;
  }
  
  return data?.[0] || null;
};

// Set trim override for component
export const setTrimComponentOverride = async (
  configId: string,
  componentType: ModelComponentAssignment['component_type'],
  componentId: string | null
): Promise<boolean> => {
  const overrideField = `${componentType}_override`;
  const componentField = `${componentType}_id`;
  
  const updateData = {
    [overrideField]: componentId !== null,
    [componentField]: componentId,
    updated_at: new Date().toISOString()
  };
  
  const { error } = await supabase
    .from('model_configurations')
    .update(updateData)
    .eq('id', configId);
    
  if (error) {
    console.error('Error setting trim component override:', error);
    throw error;
  }
  
  return true;
};
