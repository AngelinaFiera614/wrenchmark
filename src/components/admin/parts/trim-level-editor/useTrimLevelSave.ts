
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { createConfiguration, updateConfiguration } from "@/services/models/configurationService";

const validateTrimLevelForm = (formData: any, modelYearIds: string[]) => {
  if (!formData.name || formData.name.trim().length === 0) {
    throw new Error("Trim level name is required");
  }
  if (!modelYearIds || modelYearIds.length === 0) {
    throw new Error("At least one model year is required");
  }
};

export const useTrimLevelSave = (
  modelYearIds: string[],
  configuration?: Configuration,
  onSave?: (config: Configuration) => void
) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleSave = async (formData: any, getCleanConfigData: () => any) => {
    setLastError(null);
    
    try {
      validateTrimLevelForm(formData, modelYearIds);
    } catch (validationError: any) {
      const errorMessage = validationError.message;
      setLastError(errorMessage);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errorMessage,
      });
      return;
    }

    setSaving(true);
    
    try {
      console.log("=== STARTING TRIM LEVEL SAVE OPERATION ===");
      console.log("Model Year IDs:", modelYearIds);
      console.log("Configuration ID:", configuration?.id);
      console.log("Form Data:", formData);

      const configData = getCleanConfigData();
      console.log("Cleaned config data:", configData);

      let savedConfigs: Configuration[] = [];

      if (configuration?.id) {
        // Update existing configuration
        console.log("Updating existing configuration...");
        const savedConfig = await updateConfiguration(configuration.id, configData);
        if (savedConfig) {
          savedConfigs.push(savedConfig);
        }
      } else {
        // Create new configurations for all selected model years
        console.log("Creating new configurations for model years:", modelYearIds);
        
        for (const modelYearId of modelYearIds) {
          const configDataForYear = {
            ...configData,
            model_year_id: modelYearId
          };
          
          console.log(`Creating configuration for year ${modelYearId}:`, configDataForYear);
          const savedConfig = await createConfiguration(configDataForYear);
          if (savedConfig) {
            savedConfigs.push(savedConfig);
            console.log(`Successfully created configuration for year ${modelYearId}:`, savedConfig);
          }
        }
      }

      if (savedConfigs.length > 0) {
        console.log("=== SAVE OPERATION SUCCESSFUL ===");
        console.log("Saved configurations:", savedConfigs);
        
        const isMultiple = savedConfigs.length > 1;
        toast({
          title: "Success!",
          description: `${formData.name} has been ${configuration ? 'updated' : 'created'} successfully${isMultiple ? ` for ${savedConfigs.length} model years` : ''}.`,
        });
        
        if (onSave) {
          // For multiple configurations, call onSave for each one
          if (isMultiple) {
            savedConfigs.forEach((config, index) => {
              console.log(`Calling onSave callback ${index + 1}/${savedConfigs.length} with:`, config);
              setTimeout(() => onSave(config), index * 50); // Small delay between calls
            });
          } else {
            console.log("Calling onSave callback with:", savedConfigs[0]);
            onSave(savedConfigs[0]);
          }
        }
      } else {
        throw new Error("No configuration data returned from save operation");
      }
    } catch (error: any) {
      console.error("=== SAVE OPERATION FAILED ===");
      console.error("Error details:", error);
      
      let errorMessage = "Failed to save trim level. Please try again.";
      
      // Handle specific error types
      if (error?.message?.includes("violates row-level security policy")) {
        errorMessage = "Permission denied. Please ensure you have admin privileges.";
      } else if (error?.message?.includes("foreign key")) {
        errorMessage = "Invalid component reference. Please check your component selections.";
      } else if (error?.message?.includes("unique constraint") || error?.message?.includes("duplicate key")) {
        if (error.message.includes("idx_model_configurations_default_per_year")) {
          errorMessage = "There can only be one default configuration per model year. Please uncheck 'Base Model' for existing configurations first, or edit the existing default configuration.";
        } else if (error.message.includes("duplicate key value violates unique constraint")) {
          errorMessage = "A trim level with this name already exists for this model year. Please choose a different name.";
        } else {
          errorMessage = "A trim level with this name already exists for this model year.";
        }
      } else if (error?.message?.includes("check_positive_dimensions")) {
        errorMessage = "All dimension values must be positive numbers.";
      } else if (error?.message?.includes("null value in column")) {
        const columnMatch = error.message.match(/null value in column "([^"]+)"/);
        if (columnMatch) {
          const columnName = columnMatch[1];
          errorMessage = `Required field missing: ${columnName.replace('_', ' ')}`;
        } else {
          errorMessage = "Required fields are missing. Please check all required information is filled out.";
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setLastError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    handleSave,
    saving,
    lastError,
    setLastError
  };
};
