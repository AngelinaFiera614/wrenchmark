
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";

export const useAdminPartsAssignment = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("navigator");
  const [showPreview, setShowPreview] = useState(false);
  
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

  const handleModelSelect = (modelId: string) => {
    console.log("Selecting model:", modelId);
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
    // Invalidate and refetch model years
    queryClient.invalidateQueries({ queryKey: ["model-years", modelId] });
  };

  const handleYearSelect = (yearId: string) => {
    console.log("Selecting year:", yearId);
    setSelectedYear(yearId);
    setSelectedConfig(null);
    // Invalidate and refetch configurations
    queryClient.invalidateQueries({ queryKey: ["configurations", yearId] });
  };

  const handleConfigSelect = (configId: string) => {
    console.log("Selecting config:", configId);
    setSelectedConfig(configId);
  };

  const handlePreviewConfig = () => {
    setShowPreview(true);
  };

  const handleComponentLinked = () => {
    // Refetch configurations when a component is linked
    queryClient.invalidateQueries({ queryKey: ["configurations", selectedYear] });
  };

  const refreshConfigurations = () => {
    queryClient.invalidateQueries({ queryKey: ["configurations", selectedYear] });
  };

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
    
    // Handlers
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig,
    handleComponentLinked,
    refreshConfigurations,
  };
};
