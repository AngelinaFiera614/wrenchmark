
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
    isLoading: configsLoading,
    refetch: refetchConfigurations
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
    console.log("Model selected:", modelId);
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  };

  const handleYearSelect = (yearId: string) => {
    console.log("Year selected:", yearId);
    setSelectedYear(yearId);
    setSelectedConfig(null);
  };

  const handleConfigSelect = (configId: string) => {
    console.log("Config selected:", configId);
    setSelectedConfig(configId);
  };

  const handlePreviewConfig = (configId: string) => {
    setSelectedConfig(configId);
    setShowPreview(true);
  };

  const handleComponentLinked = () => {
    // Refresh configurations when components are linked
    refreshConfigurations();
    toast({
      title: "Component Updated",
      description: "Component assignment has been updated successfully.",
    });
  };

  const refreshConfigurations = useCallback(async (yearIds?: string[]) => {
    console.log("=== REFRESHING CONFIGURATIONS ===");
    console.log("Year IDs to refresh:", yearIds);
    console.log("Currently selected year:", selectedYear);
    
    try {
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
      
      // Invalidate multi-year queries
      await queryClient.invalidateQueries({ 
        queryKey: ["configurations-multi"],
        exact: false
      });
      
      // Invalidate any pattern-based configuration queries
      await queryClient.invalidateQueries({ 
        queryKey: ["configurations"],
        exact: false
      });
      
      // Force refetch of the current configuration if we have a selected year
      if (selectedYear && yearsToRefresh.includes(selectedYear)) {
        console.log("Force refetching current year configurations");
        await refetchConfigurations();
      }
      
      console.log("Cache invalidation completed successfully");
      
    } catch (error) {
      console.error("Error during cache refresh:", error);
      toast({
        variant: "destructive",
        title: "Refresh Error",
        description: "Failed to refresh configuration data."
      });
    }
  }, [queryClient, selectedYear, refetchConfigurations, toast]);

  // Function to fetch configurations for multiple years (used by components)
  const fetchConfigurationsForYears = useCallback(async (yearIds: string[]): Promise<Configuration[]> => {
    if (yearIds.length === 0) return [];
    
    console.log("Fetching configurations for multiple years:", yearIds);
    
    try {
      // For single year, use the existing single-year fetch
      if (yearIds.length === 1 && yearIds[0] === selectedYear) {
        console.log("Using cached single-year configurations");
        return configurations;
      }
      
      // For multiple years or different years, fetch fresh data
      const configs = await fetchConfigurationsForMultipleYears(yearIds);
      console.log("Fetched multi-year configurations:", configs.length);
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
  }, [configurations, selectedYear, toast]);

  // Reset selections when data changes
  useEffect(() => {
    if (selectedYear && !modelYears.find(y => y.id === selectedYear)) {
      console.log("Resetting year selection - year no longer available");
      setSelectedYear(null);
      setSelectedConfig(null);
    }
  }, [modelYears, selectedYear]);

  useEffect(() => {
    if (selectedConfig && !configurations.find(c => c.id === selectedConfig)) {
      console.log("Resetting config selection - config no longer available");
      setSelectedConfig(null);
    }
  }, [configurations, selectedConfig]);

  // Debug logging
  useEffect(() => {
    console.log("=== HOOK STATE UPDATE ===");
    console.log("Selected model:", selectedModel);
    console.log("Selected year:", selectedYear);
    console.log("Selected config:", selectedConfig);
    console.log("Configurations count:", configurations.length);
    console.log("Model years count:", modelYears.length);
  }, [selectedModel, selectedYear, selectedConfig, configurations.length, modelYears.length]);

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
