
import { supabase } from "@/integrations/supabase/client";

export interface DataHealthReport {
  totalModels: number;
  modelsWithYears: number;
  modelsWithConfigurations: number;
  modelsWithComponents: number;
  incompleteModels: {
    id: string;
    name: string;
    issues: string[];
  }[];
  completenessPercentage: number;
}

export const performDataHealthCheck = async (): Promise<DataHealthReport> => {
  try {
    console.log("Starting data health check...");

    // Get all active models with their relationships
    const { data: models, error } = await supabase
      .from('motorcycle_models')
      .select(`
        id,
        name,
        production_status,
        model_years:model_years(
          id,
          year,
          configurations:model_configurations(
            id,
            name,
            engine_id,
            brake_system_id,
            frame_id,
            suspension_id,
            wheel_id
          )
        )
      `)
      .eq('production_status', 'active');

    if (error || !models) {
      console.error("Error fetching models for health check:", error);
      throw error;
    }

    let modelsWithYears = 0;
    let modelsWithConfigurations = 0;
    let modelsWithComponents = 0;
    const incompleteModels: DataHealthReport['incompleteModels'] = [];

    models.forEach(model => {
      const issues: string[] = [];
      const hasYears = model.model_years && model.model_years.length > 0;
      const hasConfigurations = hasYears && model.model_years.some(year => 
        year.configurations && year.configurations.length > 0
      );
      const hasComponents = hasConfigurations && model.model_years.some(year =>
        year.configurations.some(config => 
          config.engine_id || config.brake_system_id || config.frame_id
        )
      );

      if (hasYears) modelsWithYears++;
      if (hasConfigurations) modelsWithConfigurations++;
      if (hasComponents) modelsWithComponents++;

      // Identify issues
      if (!hasYears) {
        issues.push("No model years");
      } else if (!hasConfigurations) {
        issues.push("No trim configurations");
      } else if (!hasComponents) {
        issues.push("Missing component assignments");
      }

      if (issues.length > 0) {
        incompleteModels.push({
          id: model.id,
          name: model.name,
          issues
        });
      }
    });

    const completenessPercentage = models.length > 0 
      ? Math.round((modelsWithComponents / models.length) * 100)
      : 0;

    const report: DataHealthReport = {
      totalModels: models.length,
      modelsWithYears,
      modelsWithConfigurations,
      modelsWithComponents,
      incompleteModels,
      completenessPercentage
    };

    console.log("Data health check complete:", {
      total: report.totalModels,
      complete: modelsWithComponents,
      completeness: `${completenessPercentage}%`,
      incomplete: incompleteModels.length
    });

    return report;
  } catch (error) {
    console.error("Error in data health check:", error);
    throw error;
  }
};

export const fixIncompleteModel = async (modelId: string): Promise<boolean> => {
  try {
    console.log("Fixing incomplete model:", modelId);
    
    const { generateModelYearsEnhanced } = await import("@/services/models/modelYearGeneration");
    
    const success = await generateModelYearsEnhanced(modelId, {
      includeHistorical: false,
      createDefaultTrims: true,
      batchSize: 3
    });

    if (success) {
      console.log("Successfully fixed model:", modelId);
    }

    return success;
  } catch (error) {
    console.error("Error fixing incomplete model:", error);
    return false;
  }
};
