
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MotorcycleModel } from '@/types/motorcycle';
import { fetchModelsForComparison } from '@/services/models/modelComparison';

export const useModelComparison = () => {
  const [selectedModels, setSelectedModels] = useState<MotorcycleModel[]>([]);
  
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
  };

  const clearComparison = () => {
    setSelectedModels([]);
  };

  return {
    selectedModels,
    availableModels,
    isLoading,
    error,
    addModelToComparison,
    removeModelFromComparison,
    clearComparison,
    canAddMore: selectedModels.length < 3
  };
};
