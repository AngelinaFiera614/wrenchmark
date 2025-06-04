
import { useCallback } from "react";

export const useAdminSelectionHandlers = (
  setSelectedModel: (model: string | null) => void,
  setSelectedYear: (year: string | null) => void,
  setSelectedConfig: (config: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  const handleModelSelect = useCallback((modelId: string) => {
    console.log("Model selected:", modelId);
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  }, [setSelectedModel, setSelectedYear, setSelectedConfig]);

  const handleYearSelect = useCallback((yearId: string) => {
    console.log("Year selected:", yearId);
    setSelectedYear(yearId);
    setSelectedConfig(null);
  }, [setSelectedYear, setSelectedConfig]);

  const handleConfigSelect = useCallback((configId: string) => {
    console.log("Config selected:", configId);
    setSelectedConfig(configId);
  }, [setSelectedConfig]);

  const handlePreviewConfig = useCallback((configId: string) => {
    setSelectedConfig(configId);
    setShowPreview(true);
  }, [setSelectedConfig, setShowPreview]);

  return {
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig
  };
};
