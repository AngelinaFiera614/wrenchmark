
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";

export const useAdminPartsLayoutState = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  
  const queryClient = useQueryClient();

  // Fetch motorcycle models
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ["admin-motorcycle-models-parts"],
    queryFn: fetchAllMotorcycleModels
  });

  // Fetch model years for selected model
  const { data: modelYears, isLoading: yearsLoading } = useQuery({
    queryKey: ["model-years", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : [],
    enabled: !!selectedModel
  });

  // Fetch configurations for selected year
  const { data: configurations, isLoading: configsLoading } = useQuery({
    queryKey: ["configurations", selectedYear],
    queryFn: () => selectedYear ? fetchConfigurations(selectedYear) : [],
    enabled: !!selectedYear
  });

  const selectedModelData = models?.find(m => m.id === selectedModel);
  const selectedYearData = modelYears?.find(y => y.id === selectedYear);
  const selectedConfigData = configurations?.find(c => c.id === selectedConfig);

  // For compatibility with EnhancedAdminPartsLayout
  const allConfigsForSelectedYears = configurations || [];
  const validation = { isValid: true, completeness: 100, issues: [] };

  const handleModelSelect = (modelId: string) => {
    console.log("Selecting model:", modelId);
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
    setSelectedYears([]);
    queryClient.invalidateQueries({ queryKey: ["model-years", modelId] });
  };

  const handleYearSelect = (yearId: string) => {
    console.log("Selecting year:", yearId);
    setSelectedYear(yearId);
    setSelectedConfig(null);
    setSelectedYears([yearId]);
    queryClient.invalidateQueries({ queryKey: ["configurations", yearId] });
  };

  const handleConfigSelect = (configId: string) => {
    console.log("Selecting config:", configId);
    setSelectedConfig(configId);
  };

  const refreshConfigurations = async (yearIds?: string[]) => {
    console.log("=== REFRESHING CONFIGURATIONS ===");
    console.log("Year IDs to refresh:", yearIds);
    console.log("Currently selected year:", selectedYear);
    
    const yearsToRefresh = yearIds || (selectedYear ? [selectedYear] : []);
    
    if (yearsToRefresh.length === 0) {
      console.log("No years to refresh");
      return;
    }

    console.log("Invalidating cache for years:", yearsToRefresh);
    
    // Invalidate specific year queries
    for (const yearId of yearsToRefresh) {
      await queryClient.invalidateQueries({ 
        queryKey: ["configurations", yearId],
        exact: true
      });
    }
    
    console.log("Cache invalidation completed successfully");
  };

  return {
    // State
    selectedModel,
    selectedYear,
    selectedConfig,
    selectedYears,
    setSelectedYears,
    
    // Data
    models,
    modelYears,
    configurations,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    allConfigsForSelectedYears,
    validation,
    
    // Loading states
    modelsLoading,
    yearsLoading,
    configsLoading,
    
    // Handlers
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshConfigurations,
    
    // Admin data object for compatibility
    adminData: {
      selectedModel,
      selectedYear,
      selectedConfig,
      selectedModelData,
      selectedYearData,
      selectedConfigData,
      models,
      modelYears,
      configurations,
      handleModelSelect,
      handleYearSelect,
      handleConfigSelect,
      refreshConfigurations
    }
  };
};
