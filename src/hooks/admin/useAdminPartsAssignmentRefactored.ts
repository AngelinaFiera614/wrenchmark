
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminDataQueries } from "./useAdminDataQueries";
import { useAdminCacheManagement } from "./useAdminCacheManagement";
import { useAdminSelectionHandlers } from "./useAdminSelectionHandlers";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";

export const useAdminPartsAssignmentRefactored = () => {
  const { toast } = useToast();
  
  // Selection state
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState("navigator");
  const [showPreview, setShowPreview] = useState(false);

  // Use optimized data queries
  const {
    models,
    modelYears,
    configurations,
    modelsLoading,
    yearsLoading,
    configsLoading,
    modelsError,
    yearsError,
    configsError,
    refetchConfigurations
  } = useAdminDataQueries(selectedModel, selectedYear);

  // Ensure configurations is always an array
  const safeConfigurations = Array.isArray(configurations) ? configurations : [];

  // Cache management
  const { refreshConfigurations, fetchConfigurationsForYears } = useAdminCacheManagement(
    selectedYear,
    safeConfigurations
  );

  // Selection handlers
  const {
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig
  } = useAdminSelectionHandlers(
    setSelectedModel,
    setSelectedYear,
    setSelectedConfig,
    setShowPreview
  );

  // Derived data with proper typing
  const selectedModelData = models.find((m: MotorcycleModel) => m.id === selectedModel);
  const selectedYearData = modelYears.find((y: ModelYear) => y.id === selectedYear);
  const selectedConfigData = safeConfigurations.find((c: Configuration) => c.id === selectedConfig);

  const handleComponentLinked = () => {
    // Refresh configurations when components are linked
    refetchConfigurations();
    toast({
      title: "Component Updated",
      description: "Component assignment has been updated successfully.",
    });
  };

  // Reset selections when data changes
  useEffect(() => {
    if (selectedYear && !modelYears.find((y: ModelYear) => y.id === selectedYear)) {
      console.log("Resetting year selection - year no longer available");
      setSelectedYear(null);
      setSelectedConfig(null);
    }
  }, [modelYears, selectedYear]);

  useEffect(() => {
    if (selectedConfig && !safeConfigurations.find((c: Configuration) => c.id === selectedConfig)) {
      console.log("Resetting config selection - config no longer available");
      setSelectedConfig(null);
    }
  }, [safeConfigurations, selectedConfig]);

  // Debug logging with improved error information
  useEffect(() => {
    console.log("=== HOOK STATE UPDATE ===");
    console.log("Selected model:", selectedModel);
    console.log("Selected year:", selectedYear);
    console.log("Selected config:", selectedConfig);
    console.log("Configurations count:", safeConfigurations.length);
    console.log("Model years count:", modelYears.length);
    console.log("Sample configuration:", safeConfigurations[0]);
    if (modelsError || yearsError || configsError) {
      console.error("Errors:", {
        modelsError: modelsError?.message,
        yearsError: yearsError?.message,
        configsError: configsError?.message
      });
    }
  }, [selectedModel, selectedYear, selectedConfig, safeConfigurations.length, modelYears.length, modelsError, yearsError, configsError]);

  return {
    // Selection state
    selectedModel,
    selectedYear,
    selectedConfig,
    
    // UI state
    activeTab,
    showPreview,
    
    // Data
    models,
    modelYears,
    configurations: safeConfigurations,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    
    // Loading states
    modelsLoading,
    yearsLoading,
    configsLoading,
    
    // Error states
    modelsError,
    yearsError,
    configsError,
    
    // Handlers
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig,
    handleComponentLinked,
    refreshConfigurations: refetchConfigurations,
    fetchConfigurationsForYears,
    setActiveTab,
    setShowPreview,
  };
};
