
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations, fetchConfigurationsForMultipleYears } from "@/services/models/configurationService";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";

export const useAdminPartsAssignmentOptimized = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Selection state
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState("navigator");
  const [showPreview, setShowPreview] = useState(false);

  // Data queries with proper typing
  const { 
    data: models = [], 
    isLoading: modelsLoading 
  } = useQuery<MotorcycleModel[]>({
    queryKey: ["motorcycle-models"],
    queryFn: fetchAllMotorcycleModels,
  });

  const { 
    data: modelYears = [], 
    isLoading: yearsLoading 
  } = useQuery<ModelYear[]>({
    queryKey: ["model-years", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : Promise.resolve([]),
    enabled: !!selectedModel,
  });

  // Enhanced configurations query that handles both single and multiple years
  const { 
    data: configurations = [], 
    isLoading: configsLoading 
  } = useQuery<Configuration[]>({
    queryKey: ["configurations", selectedYear],
    queryFn: () => selectedYear ? fetchConfigurations(selectedYear) : Promise.resolve([]),
    enabled: !!selectedYear,
  });

  // Derived data with proper typing
  const selectedModelData = models.find(m => m.id === selectedModel);
  const selectedYearData = modelYears.find(y => y.id === selectedYear);
  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  // Handlers
  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  };

  const handleYearSelect = (yearId: string) => {
    setSelectedYear(yearId);
    setSelectedConfig(null);
  };

  const handleConfigSelect = (configId: string) => {
    setSelectedConfig(configId);
  };

  const handlePreviewConfig = (configId: string) => {
    setSelectedConfig(configId);
    setShowPreview(true);
  };

  const handleComponentLinked = () => {
    // Refresh configurations when components are linked
    queryClient.invalidateQueries({ queryKey: ["configurations", selectedYear] });
    toast({
      title: "Component Updated",
      description: "Component assignment has been updated successfully.",
    });
  };

  const refreshConfigurations = useCallback((yearIds?: string[]) => {
    console.log("Refreshing configurations for years:", yearIds);
    
    if (yearIds && yearIds.length > 0) {
      // Refresh specific years - invalidate each year's cache
      yearIds.forEach(yearId => {
        queryClient.invalidateQueries({ 
          queryKey: ["configurations", yearId] 
        });
      });
      
      // Also refresh multi-year queries if they exist
      queryClient.invalidateQueries({ 
        queryKey: ["configurations-multi", ...yearIds.sort()] 
      });
    } else if (selectedYear) {
      // Refresh currently selected year
      queryClient.invalidateQueries({ 
        queryKey: ["configurations", selectedYear] 
      });
    }
    
    // Also refresh the general configurations query pattern
    queryClient.invalidateQueries({ 
      queryKey: ["configurations"], 
      exact: false 
    });
    
    // Force a refetch of the current configurations
    if (selectedYear) {
      queryClient.refetchQueries({
        queryKey: ["configurations", selectedYear]
      });
    }
  }, [queryClient, selectedYear]);

  // Function to fetch configurations for multiple years (used by components)
  const fetchConfigurationsForYears = useCallback(async (yearIds: string[]): Promise<Configuration[]> => {
    if (yearIds.length === 0) return [];
    
    try {
      const configs = await fetchConfigurationsForMultipleYears(yearIds);
      return configs;
    } catch (error) {
      console.error("Error fetching configurations for multiple years:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch configurations for selected years."
      });
      return [];
    }
  }, [toast]);

  // Reset selections when data changes
  useEffect(() => {
    if (selectedYear && !modelYears.find(y => y.id === selectedYear)) {
      setSelectedYear(null);
      setSelectedConfig(null);
    }
  }, [modelYears, selectedYear]);

  useEffect(() => {
    if (selectedConfig && !configurations.find(c => c.id === selectedConfig)) {
      setSelectedConfig(null);
    }
  }, [configurations, selectedConfig]);

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
    configurations,
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
    handlePreviewConfig,
    handleComponentLinked,
    refreshConfigurations,
    fetchConfigurationsForYears,
    setActiveTab,
    setShowPreview,
  };
};
