
import { useState, useCallback } from "react";
import { useOptimizedAdminData } from "./useOptimizedAdminData";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";

export const useAdminPartsLayoutState = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  // Use optimized data hooks
  const optimizedData = useOptimizedAdminData(selectedModel, selectedYear);

  // Fetch models with basic caching
  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ["motorcycle-models-basic"],
    queryFn: fetchAllMotorcycleModels,
    staleTime: 5 * 60 * 1000
  });

  // Fetch model years when model is selected
  const { data: modelYears = [], isLoading: yearsLoading } = useQuery({
    queryKey: ["model-years", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : Promise.resolve([]),
    enabled: !!selectedModel,
    staleTime: 10 * 60 * 1000
  });

  // Fetch configurations when year is selected
  const { data: configurations = [], isLoading: configsLoading, refetch: refetchConfigurations } = useQuery({
    queryKey: ["configurations", selectedYear],
    queryFn: () => selectedYear ? fetchConfigurations(selectedYear) : Promise.resolve([]),
    enabled: !!selectedYear,
    staleTime: 2 * 60 * 1000
  });

  // Handlers
  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  }, []);

  const handleYearSelect = useCallback((yearId: string) => {
    setSelectedYear(yearId);
    setSelectedConfig(null);
  }, []);

  const handleConfigSelect = useCallback((configId: string) => {
    setSelectedConfig(configId);
  }, []);

  const refreshConfigurations = useCallback(() => {
    refetchConfigurations();
  }, [refetchConfigurations]);

  // Derived data
  const selectedModelData = models.find(m => m.id === selectedModel);
  const selectedYearData = modelYears.find(y => y.id === selectedYear);
  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  return {
    // Selection state
    selectedModel,
    selectedYear,
    selectedConfig,
    
    // Data
    models,
    modelYears,
    configurations,
    
    // Derived data
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    
    // Loading states
    modelsLoading,
    yearsLoading,
    configsLoading,
    
    // Handlers
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshConfigurations,
    
    // Optimized data access
    optimizedData
  };
};
