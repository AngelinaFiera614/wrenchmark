
import { supabase } from "@/integrations/supabase/client";
import { ComponentUsageStats } from "./types";

// Get component usage statistics
export const getComponentUsageStats = async (
  componentType?: string,
  componentId?: string
): Promise<ComponentUsageStats[]> => {
  let query = supabase.from('component_usage_stats').select('*');
  
  if (componentType) {
    query = query.eq('component_type', componentType);
  }
  
  if (componentId) {
    query = query.eq('component_id', componentId);
  }
  
  const { data, error } = await query.order('usage_count', { ascending: false });
  
  if (error) {
    console.error('Error fetching component usage stats:', error);
    throw error;
  }
  
  return data || [];
};

// Check if component can be deleted (not in use)
export const canDeleteComponent = async (
  componentType: string,
  componentId: string
): Promise<{ canDelete: boolean; usageCount: number; models: string[]; trims: string[] }> => {
  // Check model assignments
  const { data: modelAssignments } = await supabase
    .from('model_component_assignments')
    .select(`
      model_id,
      motorcycle_models!inner(name)
    `)
    .eq('component_type', componentType)
    .eq('component_id', componentId);
    
  // Check trim assignments (direct assignments)
  const componentField = `${componentType}_id`;
  const { data: trimAssignments } = await supabase
    .from('model_configurations')
    .select(`
      id, 
      name,
      model_years!inner(
        motorcycle_models!inner(name)
      )
    `)
    .eq(componentField, componentId);
    
  const modelNames = modelAssignments?.map(a => (a as any).motorcycle_models?.name).filter(Boolean) || [];
  const trimNames = trimAssignments?.map(t => {
    const trimData = t as any;
    return `${trimData.model_years?.motorcycle_models?.name} - ${trimData.name}`;
  }).filter(Boolean) || [];
  
  const totalUsage = (modelAssignments?.length || 0) + (trimAssignments?.length || 0);
  
  return {
    canDelete: totalUsage === 0,
    usageCount: totalUsage,
    models: modelNames,
    trims: trimNames
  };
};
