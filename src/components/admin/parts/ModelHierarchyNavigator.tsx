
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import SimplifiedConfigurationManager from "./enhanced/SimplifiedConfigurationManager";

interface ModelHierarchyNavigatorProps {
  models: MotorcycleModel[];
  modelYears: ModelYear[];
  configurations: Configuration[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  onModelSelect: (modelId: string) => void;
  onYearSelect: (yearId: string) => void;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
  isLoading: boolean;
}

const ModelHierarchyNavigator = ({
  models,
  modelYears,
  configurations,
  selectedModel,
  selectedYear,
  selectedConfig,
  onModelSelect,
  onYearSelect,
  onConfigSelect,
  onConfigChange,
  isLoading
}: ModelHierarchyNavigatorProps) => {

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal mx-auto"></div>
          <p className="text-explorer-text-muted mt-4">Loading model hierarchy...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <SimplifiedConfigurationManager
      models={models}
      modelYears={modelYears}
      configurations={configurations}
      selectedModel={selectedModel}
      selectedYear={selectedYear}
      selectedConfig={selectedConfig}
      onModelSelect={onModelSelect}
      onYearSelect={onYearSelect}
      onConfigSelect={onConfigSelect}
      onConfigChange={onConfigChange}
      isLoading={isLoading}
    />
  );
};

export default ModelHierarchyNavigator;
