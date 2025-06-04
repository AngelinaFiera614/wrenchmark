
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";

// Mock service functions - these would be replaced with actual service calls
const createConfiguration = async (data: any): Promise<Configuration> => {
  console.log("Creating configuration:", data);
  // Simulate API call
  return { ...data, id: `config-${Date.now()}` } as Configuration;
};

const updateConfiguration = async (id: string, data: any): Promise<Configuration> => {
  console.log("Updating configuration:", id, data);
  // Simulate API call
  return { ...data, id } as Configuration;
};

const validateTrimLevelForm = (formData: any, modelYearId: string) => {
  if (!formData.name || formData.name.trim().length === 0) {
    throw new Error("Trim level name is required");
  }
  if (!modelYearId) {
    throw new Error("Model year is required");
  }
};

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
      
      // Handle default configuration constraint
      if (configData.is_default && !configuration?.id) {
        // If this is a new default configuration, we need to ensure no other default exists
        console.log("Creating new default configuration, checking for existing defaults...");
      }
      
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
