import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";

export const useAdminPartsAssignmentOptimized = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("navigator");
  const [showPreview, setShowPreview] = useState(false);
  
  const queryClient = useQueryClient();

  // Optimized motorcycle models query with caching
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ["admin-motorcycle-models-parts"],
    queryFn: fetchAllMotorcycleModels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
  });

  // Optimized model years query with better caching
  const { data: modelYears, isLoading: yearsLoading } = useQuery({
    queryKey: ["model-years-optimized", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : [],
    enabled: !!selectedModel,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (renamed from cacheTime)
  });

  // Optimized configurations query
  const { data: configurations, isLoading: configsLoading } = useQuery({
    queryKey: ["configurations-optimized", selectedYear],
    queryFn: () => selectedYear ? fetchConfigurations(selectedYear) : [],
    enabled: !!selectedYear,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });

  // Memoized derived data to prevent unnecessary recalculations
  const selectedModelData = useMemo(() => 
    models?.find(m => m.id === selectedModel), 
    [models, selectedModel]
  );
  
  const selectedYearData = useMemo(() => 
    modelYears?.find(y => y.id === selectedYear), 
    [modelYears, selectedYear]
  );
  
  const selectedConfigData = useMemo(() => 
    configurations?.find(c => c.id === selectedConfig), 
    [configurations, selectedConfig]
  );

  // Optimized handlers with proper cache invalidation
  const handleModelSelect = (modelId: string) => {
    console.log("Selecting model:", modelId);
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
    
    // Prefetch model years for better UX
    queryClient.prefetchQuery({
      queryKey: ["model-years-optimized", modelId],
      queryFn: () => fetchModelYears(modelId),
      staleTime: 2 * 60 * 1000,
    });
  };

  const handleYearSelect = (yearId: string) => {
    console.log("Selecting year:", yearId);
    setSelectedYear(yearId);
    setSelectedConfig(null);
    
    // Prefetch configurations for better UX
    queryClient.prefetchQuery({
      queryKey: ["configurations-optimized", yearId],
      queryFn: () => fetchConfigurations(yearId),
      staleTime: 1 * 60 * 1000,
    });
  };

  const handleConfigSelect = (configId: string) => {
    console.log("Selecting config:", configId);
    setSelectedConfig(configId);
  };

  const handlePreviewConfig = () => {
    setShowPreview(true);
  };

  const handleComponentLinked = () => {
    // Invalidate only the specific queries that need refreshing
    queryClient.invalidateQueries({ 
      queryKey: ["configurations-optimized", selectedYear] 
    });
  };

  const refreshConfigurations = () => {
    queryClient.invalidateQueries({ 
      queryKey: ["configurations-optimized", selectedYear] 
    });
  };

  // Optimized data loading state
  const isLoading = modelsLoading || yearsLoading || configsLoading;

  return {
    // State
    selectedModel,
    selectedYear,
    selectedConfig,
    activeTab,
    showPreview,
    setActiveTab,
    setShowPreview,
    
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
    isLoading,
    
    // Handlers
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig,
    handleComponentLinked,
    refreshConfigurations,
  };
};
