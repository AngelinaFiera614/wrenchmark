
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
