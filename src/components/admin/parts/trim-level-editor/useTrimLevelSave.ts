
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { createConfiguration, updateConfiguration } from "@/services/models/configurationService";
import { validateTrimLevelForm } from "./validation";

export const useTrimLevelSave = (
  modelYearId: string,
  configuration?: Configuration,
  onSave?: (config: Configuration) => void
) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleSave = async (formData: any, getCleanConfigData: () => any) => {
    setLastError(null);
    
    try {
      validateTrimLevelForm(formData, modelYearId);
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
      console.log("Model Year ID:", modelYearId);
      console.log("Configuration ID:", configuration?.id);
      console.log("Form Data:", formData);

      const configData = getCleanConfigData();
      console.log("Cleaned config data:", configData);

      let savedConfig;
      if (configuration?.id) {
        console.log("Updating existing configuration...");
        savedConfig = await updateConfiguration(configuration.id, configData);
      } else {
        console.log("Creating new configuration...");
        savedConfig = await createConfiguration(configData);
      }

      if (savedConfig) {
        console.log("=== SAVE OPERATION SUCCESSFUL ===");
        console.log("Saved configuration:", savedConfig);
        
        toast({
          title: "Success!",
          description: `${formData.name} has been ${configuration ? 'updated' : 'created'} successfully.`,
        });
        
        if (onSave) {
          onSave(savedConfig);
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
          errorMessage = "There can only be one default configuration per model year. Please uncheck 'Base Model' or update the existing default configuration.";
        } else {
          errorMessage = "A trim level with this name already exists for this model year.";
        }
      } else if (error?.message?.includes("check_positive_dimensions")) {
        errorMessage = "All dimension values must be positive numbers.";
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
