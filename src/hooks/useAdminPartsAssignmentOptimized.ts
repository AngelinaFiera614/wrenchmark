import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears, deleteModelYear } from "@/services/models/modelYearService";
import { fetchConfigurations, deleteConfiguration } from "@/services/models/configurationService";
import { toast } from "sonner";
import { Configuration } from "@/types/motorcycle";

export const useAdminPartsAssignmentOptimized = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("navigator");
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingTrim, setIsEditingTrim] = useState(false);
  const [editingTrimConfig, setEditingTrimConfig] = useState<Configuration | undefined>(undefined);
  
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

  // Enhanced trim level editor handlers
  const handleAddTrim = () => {
    if (!selectedYear) {
      toast.error("Please select a model year first");
      return;
    }
    setEditingTrimConfig(undefined);
    setIsEditingTrim(true);
  };

  const handleEditTrim = (config: Configuration) => {
    setEditingTrimConfig(config);
    setIsEditingTrim(true);
  };

  const handleDeleteTrim = async (config: Configuration) => {
    try {
      console.log("Deleting trim level:", config.id);
      const success = await deleteConfiguration(config.id);
      
      if (success) {
        toast.success(`Trim level "${config.name}" has been deleted successfully.`);
        
        // If the deleted config was selected, clear selection
        if (selectedConfig === config.id) {
          setSelectedConfig(null);
        }
        
        // Refresh configurations
        refreshConfigurations();
      }
    } catch (error: any) {
      console.error("Error deleting trim level:", error);
      toast.error(`Failed to delete trim level: ${error.message}`);
      throw error;
    }
  };

  const handleCloseTrimEditor = () => {
    setIsEditingTrim(false);
    setEditingTrimConfig(undefined);
  };

  const handleSaveTrim = (config: Configuration) => {
    // Auto-select the newly created/edited configuration
    setSelectedConfig(config.id);
    setIsEditingTrim(false);
    setEditingTrimConfig(undefined);
    
    // Refresh configurations
    refreshConfigurations();
    
    toast.success(editingTrimConfig ? "Trim level updated successfully" : "Trim level created successfully");
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

  // New year deletion handler
  const handleYearDelete = async (yearId: string) => {
    try {
      const success = await deleteModelYear(yearId);
      if (success) {
        toast.success("Model year deleted successfully");
        
        // If the deleted year was selected, clear the selection
        if (selectedYear === yearId) {
          setSelectedYear(null);
          setSelectedConfig(null);
        }
        
        // Invalidate and refetch model years
        queryClient.invalidateQueries({ 
          queryKey: ["model-years-optimized", selectedModel] 
        });
      } else {
        toast.error("Failed to delete model year");
      }
    } catch (error) {
      console.error("Error deleting model year:", error);
      toast.error("Error deleting model year");
      throw error;
    }
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
    isEditingTrim,
    editingTrimConfig,
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
    handleYearDelete,
    handleAddTrim,
    handleEditTrim,
    handleDeleteTrim,
    handleCloseTrimEditor,
    handleSaveTrim,
  };
};
