
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import AdminModelYearDialog from "../models/AdminModelYearDialog";
import ModelsColumn from "./hierarchy/ModelsColumn";
import ModelYearsColumn from "./hierarchy/ModelYearsColumn";
import ConfigurationsColumn from "./hierarchy/ConfigurationsColumn";
import { useHierarchyActions } from "./hierarchy/useHierarchyActions";

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
  isLoading
}: ModelHierarchyNavigatorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddYearDialog, setShowAddYearDialog] = useState(false);
  
  const { generatingYears, handleRetryModelYears, handleGenerateModelYears } = useHierarchyActions();

  const selectedModelData = models?.find(m => m.id === selectedModel);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ModelsColumn
        models={models}
        selectedModel={selectedModel}
        onModelSelect={onModelSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ModelYearsColumn
        modelYears={modelYears}
        selectedModel={selectedModel}
        selectedYear={selectedYear}
        selectedModelData={selectedModelData}
        onYearSelect={onYearSelect}
        onRetryModelYears={() => handleRetryModelYears(selectedModel, onModelSelect)}
        onGenerateModelYears={() => handleGenerateModelYears(selectedModel, onModelSelect)}
        onAddYearClick={() => setShowAddYearDialog(true)}
        generatingYears={generatingYears}
        isLoading={isLoading}
      />

      <ConfigurationsColumn
        configurations={configurations}
        selectedYear={selectedYear}
        selectedConfig={selectedConfig}
        onConfigSelect={onConfigSelect}
      />

      <AdminModelYearDialog
        open={showAddYearDialog}
        model={selectedModelData}
        onClose={() => setShowAddYearDialog(false)}
      />
    </div>
  );
};

export default ModelHierarchyNavigator;
