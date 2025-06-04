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

  // Data queries with proper typing and enhanced error handling
  const { 
    data: models = [], 
    isLoading: modelsLoading,
    error: modelsError
  } = useQuery<MotorcycleModel[]>({
    queryKey: ["motorcycle-models"],
    queryFn: fetchAllMotorcycleModels,
    onError: (error) => {
      console.error("Error fetching motorcycle models:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Models",
        description: "Failed to load motorcycle models. Please try refreshing."
      });
    }
  });

  const { 
    data: modelYears = [], 
    isLoading: yearsLoading,
    error: yearsError
  } = useQuery<ModelYear[]>({
    queryKey: ["model-years", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : Promise.resolve([]),
    enabled: !!selectedModel,
    onError: (error) => {
      console.error("Error fetching model years:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Model Years",
        description: "Failed to load model years. Please try again."
      });
    }
  });

  // Enhanced configurations query with better error handling
  const { 
    data: configurations = [], 
    isLoading: configsLoading,
    error: configsError,
    refetch: refetchConfigurations
  } = useQuery<Configuration[]>({
    queryKey: ["configurations", selectedYear],
    queryFn: () => {
      if (!selectedYear) {
        console.log("No selected year, returning empty configurations");
        return Promise.resolve([]);
      }
      console.log("Fetching configurations for year:", selectedYear);
      return fetchConfigurations(selectedYear);
    },
    enabled: !!selectedYear,
    onError: (error) => {
      console.error("Error fetching configurations:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Configurations",
        description: "Failed to load trim configurations. Please try again."
      });
    },
    onSuccess: (data) => {
      console.log("Configurations query successful:", {
        yearId: selectedYear,
        count: data.length,
        configurations: data.map(c => ({ id: c.id, name: c.name }))
      });
    }
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
      
      // Add a small delay and then log what we have in cache
      setTimeout(() => {
        console.log("Post-refresh configurations check:", {
          selectedYear,
          configurationsCount: configurations.length,
          configsError: configsError?.message
        });
      }, 100);
      
    } catch (error) {
      console.error("Error during cache refresh:", error);
      toast({
        variant: "destructive",
        title: "Refresh Error",
        description: "Failed to refresh configuration data."
      });
    }
  }, [queryClient, selectedYear, refetchConfigurations, toast, configurations.length, configsError]);

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

  // Debug logging with error information
  useEffect(() => {
    console.log("=== HOOK STATE UPDATE ===");
    console.log("Selected model:", selectedModel);
    console.log("Selected year:", selectedYear);
    console.log("Selected config:", selectedConfig);
    console.log("Configurations count:", configurations.length);
    console.log("Model years count:", modelYears.length);
    console.log("Errors:", {
      modelsError: modelsError?.message,
      yearsError: yearsError?.message,
      configsError: configsError?.message
    });
  }, [selectedModel, selectedYear, selectedConfig, configurations.length, modelYears.length, modelsError, yearsError, configsError]);

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
    refreshConfigurations,
    fetchConfigurationsForYears,
    setActiveTab,
    setShowPreview,
  };
};
