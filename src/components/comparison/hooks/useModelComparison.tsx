
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MotorcycleModel } from '@/types/motorcycle';
import { fetchModelsForComparison } from '@/services/models/modelComparison';

export interface SelectedState {
  [modelId: string]: {
    yearId?: string;
    configId?: string;
  };
}

// Define simplified interfaces for comparison
interface ModelYear {
  id: string;
  year: number;
  configurations?: Configuration[];
}

interface Configuration {
  id: string;
  name?: string;
}

export const useModelComparison = () => {
  const [selectedModels, setSelectedModels] = useState<MotorcycleModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedState, setSelectedState] = useState<SelectedState>({});
  
  const {
    data: availableModels = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['models-for-comparison'],
    queryFn: () => fetchModelsForComparison()
  });

  const addModelToComparison = (model: MotorcycleModel) => {
    if (selectedModels.length < 3 && !selectedModels.find(m => m.id === model.id)) {
      setSelectedModels(prev => [...prev, model]);
    }
  };

  const removeModelFromComparison = (modelId: string) => {
    setSelectedModels(prev => prev.filter(m => m.id !== modelId));
    setSelectedState(prev => {
      const newState = { ...prev };
      delete newState[modelId];
      return newState;
    });
  };

  const handleRemoveModel = (slug: string) => {
    const model = selectedModels.find(m => m.slug === slug);
    if (model) {
      removeModelFromComparison(model.id);
    }
  };

  const handleYearChange = (modelId: string, yearId: string) => {
    setSelectedState(prev => ({
      ...prev,
      [modelId]: { ...prev[modelId], yearId }
    }));
  };

  const handleConfigChange = (modelId: string, configId: string) => {
    setSelectedState(prev => ({
      ...prev,
      [modelId]: { ...prev[modelId], configId }
    }));
  };

  const getSelectedYear = (model: MotorcycleModel): ModelYear | undefined => {
    const yearId = selectedState[model.id]?.yearId;
    // Since MotorcycleModel doesn't have model_years, return undefined for now
    // This will need to be implemented when the model structure is updated
    return undefined;
  };

  const getSelectedConfig = (model: MotorcycleModel): Configuration | undefined => {
    const configId = selectedState[model.id]?.configId;
    const selectedYear = getSelectedYear(model);
    return selectedYear?.configurations?.find(config => config.id === configId);
  };

  const clearComparison = () => {
    setSelectedModels([]);
    setSelectedState({});
  };

  return {
    // Original properties
    selectedModels,
    availableModels,
    isLoading,
    error,
    addModelToComparison,
    removeModelFromComparison,
    clearComparison,
    canAddMore: selectedModels.length < 3,
    
    // Additional properties expected by ModelComparison
    models: selectedModels,
    activeTab,
    setActiveTab,
    selectedState,
    handleRemoveModel,
    handleYearChange,
    handleConfigChange,
    getSelectedYear,
    getSelectedConfig
  };
};
