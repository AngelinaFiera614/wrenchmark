
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { useConfigurationMetrics } from "@/hooks/useConfigurationMetrics";
import { createConfiguration, updateConfiguration } from "@/services/models/configurationService";
import { AlertCircle, CheckCircle } from "lucide-react";
import TrimLevelEditorHeader from "./trim-level-editor/TrimLevelEditorHeader";
import TrimLevelEditorTabs from "./trim-level-editor/TrimLevelEditorTabs";
import ErrorDisplay from "./trim-level-editor/ErrorDisplay";

interface TrimLevelEditorProps {
  modelYearId: string;
  configuration?: Configuration;
  onSave: (config: Configuration) => void;
  onCancel: () => void;
}

const TrimLevelEditor = ({ 
  modelYearId, 
  configuration, 
  onSave, 
  onCancel 
}: TrimLevelEditorProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: configuration?.name || "",
    engine_id: configuration?.engine_id || "",
    brake_system_id: configuration?.brake_system_id || "",
    frame_id: configuration?.frame_id || "",
    suspension_id: configuration?.suspension_id || "",
    wheel_id: configuration?.wheel_id || "",
    seat_height_mm: configuration?.seat_height_mm || "",
    weight_kg: configuration?.weight_kg || "",
    wheelbase_mm: configuration?.wheelbase_mm || "",
    fuel_capacity_l: configuration?.fuel_capacity_l || "",
    ground_clearance_mm: configuration?.ground_clearance_mm || "",
    is_default: configuration?.is_default || false,
    market_region: configuration?.market_region || "",
    price_premium_usd: configuration?.price_premium_usd || "",
  });

  const [selectedComponents, setSelectedComponents] = useState({
    engine: configuration?.engine || null,
    brakes: configuration?.brakes || null,
    frame: configuration?.frame || null,
    suspension: configuration?.suspension || null,
    wheels: configuration?.wheels || null,
  });

  // Create a mock configuration for metrics calculation
  const mockConfig: Configuration = {
    id: configuration?.id || 'temp',
    model_year_id: modelYearId,
    name: formData.name,
    engine_id: formData.engine_id,
    brake_system_id: formData.brake_system_id,
    frame_id: formData.frame_id,
    suspension_id: formData.suspension_id,
    wheel_id: formData.wheel_id,
    seat_height_mm: Number(formData.seat_height_mm) || undefined,
    weight_kg: Number(formData.weight_kg) || undefined,
    wheelbase_mm: Number(formData.wheelbase_mm) || undefined,
    fuel_capacity_l: Number(formData.fuel_capacity_l) || undefined,
    ground_clearance_mm: Number(formData.ground_clearance_mm) || undefined,
    is_default: formData.is_default,
    market_region: formData.market_region,
    price_premium_usd: Number(formData.price_premium_usd) || undefined,
    engine: selectedComponents.engine,
    brakes: selectedComponents.brakes,
    frame: selectedComponents.frame,
    suspension: selectedComponents.suspension,
    wheels: selectedComponents.wheels,
  };

  const metrics = useConfigurationMetrics(mockConfig);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (lastError) setLastError(null);
  };

  const handleComponentSelect = (componentType: string, componentId: string, component: any) => {
    console.log(`Selected ${componentType}:`, componentId, component);
    handleInputChange(`${componentType}_id`, componentId);
    setSelectedComponents(prev => ({ ...prev, [componentType]: component }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error("Trim level name is required");
    }
    
    if (!modelYearId) {
      throw new Error("Model year ID is missing");
    }

    // Validate numeric fields if they're provided
    const numericFields = [
      { field: 'seat_height_mm', label: 'Seat height' },
      { field: 'weight_kg', label: 'Weight' },
      { field: 'wheelbase_mm', label: 'Wheelbase' },
      { field: 'fuel_capacity_l', label: 'Fuel capacity' },
      { field: 'ground_clearance_mm', label: 'Ground clearance' },
      { field: 'price_premium_usd', label: 'Price premium' }
    ];

    for (const { field, label } of numericFields) {
      const value = formData[field as keyof typeof formData];
      if (value !== '' && value !== null && value !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          throw new Error(`${label} must be a valid number`);
        }
        if (field !== 'price_premium_usd' && numValue <= 0) {
          throw new Error(`${label} must be a positive number`);
        }
        if (field === 'price_premium_usd' && numValue < 0) {
          throw new Error(`${label} cannot be negative`);
        }
      }
    }
  };

  const handleSave = async () => {
    setLastError(null);
    
    try {
      validateForm();
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

      const configData = {
        model_year_id: modelYearId,
        name: formData.name.trim(),
        engine_id: formData.engine_id || null,
        brake_system_id: formData.brake_system_id || null,
        frame_id: formData.frame_id || null,
        suspension_id: formData.suspension_id || null,
        wheel_id: formData.wheel_id || null,
        seat_height_mm: formData.seat_height_mm ? Number(formData.seat_height_mm) : null,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        wheelbase_mm: formData.wheelbase_mm ? Number(formData.wheelbase_mm) : null,
        fuel_capacity_l: formData.fuel_capacity_l ? Number(formData.fuel_capacity_l) : null,
        ground_clearance_mm: formData.ground_clearance_mm ? Number(formData.ground_clearance_mm) : null,
        is_default: formData.is_default,
        market_region: formData.market_region || null,
        price_premium_usd: formData.price_premium_usd ? Number(formData.price_premium_usd) : null,
      };

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
          action: <CheckCircle className="h-4 w-4 text-green-500" />
        });
        
        onSave(savedConfig);
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
        action: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <TrimLevelEditorHeader
        isEditing={!!configuration}
        onSave={handleSave}
        onCancel={onCancel}
        saving={saving}
        formData={formData}
      />

      {/* Error Display */}
      {lastError && <ErrorDisplay error={lastError} />}

      <TrimLevelEditorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        onInputChange={handleInputChange}
        onComponentSelect={handleComponentSelect}
        metrics={metrics}
      />
    </div>
  );
};

export default TrimLevelEditor;
