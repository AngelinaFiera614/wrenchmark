
import { useState, useEffect } from 'react';
import { MotorcycleModel } from '@/types/motorcycle';

const PINNED_MODELS_KEY = 'wrenchmark_pinned_models';
const MAX_PINNED_MODELS = 5;

export const usePinnedModels = () => {
  const [pinnedModelIds, setPinnedModelIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(PINNED_MODELS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPinnedModelIds(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing pinned models:', error);
        setPinnedModelIds([]);
      }
    }
  }, []);

  const savePinnedModels = (modelIds: string[]) => {
    localStorage.setItem(PINNED_MODELS_KEY, JSON.stringify(modelIds));
    setPinnedModelIds(modelIds);
  };

  const pinModel = (modelId: string) => {
    if (pinnedModelIds.includes(modelId)) return;
    
    const newPinned = [...pinnedModelIds, modelId].slice(0, MAX_PINNED_MODELS);
    savePinnedModels(newPinned);
  };

  const unpinModel = (modelId: string) => {
    const newPinned = pinnedModelIds.filter(id => id !== modelId);
    savePinnedModels(newPinned);
  };

  const isPinned = (modelId: string) => {
    return pinnedModelIds.includes(modelId);
  };

  const canPin = () => {
    return pinnedModelIds.length < MAX_PINNED_MODELS;
  };

  return {
    pinnedModelIds,
    pinModel,
    unpinModel,
    isPinned,
    canPin,
    maxPinned: MAX_PINNED_MODELS
  };
};
