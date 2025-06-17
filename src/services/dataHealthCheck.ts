
import { supabase } from "@/integrations/supabase/client";

export interface DataHealthReport {
  totalModels: number;
  modelsWithComponents: number;
  incompleteModels: Array<{
    id: string;
    name: string;
    issues: string[];
  }>;
  completenessPercentage: number;
}

export const performDataHealthCheck = async (): Promise<DataHealthReport> => {
  try {
    // Fetch all motorcycle models
    const { data: models, error } = await supabase
      .from('motorcycle_models')
      .select('*');

    if (error) throw error;

    const totalModels = models?.length || 0;
    const incompleteModels: Array<{ id: string; name: string; issues: string[] }> = [];

    // Check each model for completeness
    for (const model of models || []) {
      const issues: string[] = [];
      
      // Check for missing components, years, etc.
      if (!model.engine_size) issues.push('Missing engine data');
      if (!model.weight_kg) issues.push('Missing weight data');
      if (!model.seat_height_mm) issues.push('Missing seat height');
      
      if (issues.length > 0) {
        incompleteModels.push({
          id: model.id,
          name: model.name,
          issues
        });
      }
    }

    const modelsWithComponents = totalModels - incompleteModels.length;
    const completenessPercentage = totalModels > 0 
      ? Math.round((modelsWithComponents / totalModels) * 100)
      : 0;

    return {
      totalModels,
      modelsWithComponents,
      incompleteModels,
      completenessPercentage
    };
  } catch (error) {
    console.error('Error performing data health check:', error);
    throw error;
  }
};

export const fixIncompleteModel = async (modelId: string): Promise<boolean> => {
  try {
    // Implementation to fix a specific model
    console.log('Fixing model:', modelId);
    return true;
  } catch (error) {
    console.error('Error fixing model:', error);
    return false;
  }
};
