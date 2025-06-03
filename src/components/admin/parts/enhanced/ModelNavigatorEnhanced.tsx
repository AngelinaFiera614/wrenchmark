
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ModelHierarchyNavigator from "../ModelHierarchyNavigator";

interface ModelNavigatorEnhancedProps {
  models: any[];
  modelYears: any[];
  configurations: any[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  handleModelSelect: (modelId: string) => void;
  handleYearSelect: (yearId: string) => void;
  handleConfigSelect: (configId: string) => void;
  modelsLoading: boolean;
  yearsLoading: boolean;
  configsLoading: boolean;
}

const ModelNavigatorEnhanced = (props: ModelNavigatorEnhancedProps) => {
  const isLoading = props.modelsLoading || props.yearsLoading || props.configsLoading;

  return (
    <div className="space-y-6">
      {/* Enhanced Navigation Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Model Hierarchy Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Navigate through the motorcycle model hierarchy. Select a model to view its years, 
              then select a year to view available trim configurations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Enhanced Model Hierarchy */}
      <ModelHierarchyNavigator
        models={props.models}
        modelYears={props.modelYears}
        configurations={props.configurations}
        selectedModel={props.selectedModel}
        selectedYear={props.selectedYear}
        selectedConfig={props.selectedConfig}
        onModelSelect={props.handleModelSelect}
        onYearSelect={props.handleYearSelect}
        onConfigSelect={props.handleConfigSelect}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModelNavigatorEnhanced;
