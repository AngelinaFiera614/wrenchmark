
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

export const getConfigurationComponents = async (configurationId: string) => {
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
    .eq('id', configurationId)
    .single();

  if (error) {
    console.error('Error fetching configuration components:', error);
    throw error;
  }

  return data;
};

export const updateConfigurationComponent = async (
  configurationId: string,
  componentType: string,
  componentId: string | null
) => {
  const updateData: any = {};
  updateData[`${componentType}_id`] = componentId;

  const { data, error } = await supabase
    .from('model_configurations')
    .update(updateData)
    .eq('id', configurationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating configuration component:', error);
    throw error;
  }

  return data;
};
