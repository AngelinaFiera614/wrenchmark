
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { validateConfiguration } from "../validation/ValidationEngine";

interface ContextSidebarProps {
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  selectedModelData?: any;
  selectedYearData?: any;
  selectedConfigData?: any;
  models: any[];
  modelYears: any[];
  configurations: any[];
  onModelSelect: (modelId: string) => void;
  onYearSelect: (yearId: string) => void;
  onConfigSelect: (configId: string) => void;
}

const ContextSidebar = ({
  selectedModel,
  selectedYear,
  selectedConfig,
  selectedModelData,
  selectedYearData,
  selectedConfigData,
  models,
  modelYears,
  configurations,
  onModelSelect,
  onYearSelect,
  onConfigSelect
}: ContextSidebarProps) => {
  const [pinnedModels, setPinnedModels] = React.useState<Set<string>>(new Set());

  const togglePinModel = (modelId: string) => {
    setPinnedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  const getModelCompletionStatus = (modelId: string) => {
    const modelConfigs = configurations.filter(config => {
      const year = modelYears.find(y => y.id === config.model_year_id);
      return year?.motorcycle_id === modelId;
    });

    if (modelConfigs.length === 0) return { status: 'missing', count: 0, total: 0 };

    let completeCount = 0;
    modelConfigs.forEach(config => {
      const validation = validateConfiguration(config, selectedModelData, selectedYearData, configurations);
      if (validation.isValid && validation.completeness >= 80) {
        completeCount++;
      }
    });

    const completionRatio = completeCount / modelConfigs.length;
    let status = 'missing';
    if (completionRatio >= 0.8) status = 'complete';
    else if (completionRatio >= 0.4) status = 'partial';

    return { status, count: completeCount, total: modelConfigs.length };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'partial': return <Clock className="h-3 w-3 text-yellow-500" />;
      default: return <AlertTriangle className="h-3 w-3 text-red-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Selection */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-sm">Current Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {selectedModelData && (
            <div>
              <div className="text-xs text-explorer-text-muted">Model</div>
              <div className="text-sm text-explorer-text">{selectedModelData.name}</div>
            </div>
          )}
          {selectedYearData && (
            <div>
              <div className="text-xs text-explorer-text-muted">Year</div>
              <div className="text-sm text-explorer-text">{selectedYearData.year}</div>
            </div>
          )}
          {selectedConfigData && (
            <div>
              <div className="text-xs text-explorer-text-muted">Configuration</div>
              <div className="text-sm text-explorer-text">{selectedConfigData.name}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pinned Models */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-sm">Pinned Models</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from(pinnedModels).length === 0 ? (
            <div className="text-xs text-explorer-text-muted">No pinned models</div>
          ) : (
            <div className="space-y-2">
              {Array.from(pinnedModels).map(modelId => {
                const model = models.find(m => m.id === modelId);
                if (!model) return null;
                
                const completion = getModelCompletionStatus(modelId);
                
                return (
                  <div 
                    key={modelId}
                    className="flex items-center justify-between p-2 rounded bg-explorer-dark cursor-pointer hover:bg-explorer-chrome/20"
                    onClick={() => onModelSelect(modelId)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-explorer-text truncate">{model.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(completion.status)}
                        <span className="text-xs text-explorer-text-muted">
                          {completion.count}/{completion.total} complete
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinModel(modelId);
                      }}
                    >
                      <PinOff className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Models */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-sm">Available Models</CardTitle>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {models.slice(0, 10).map(model => {
              const isPinned = pinnedModels.has(model.id);
              const completion = getModelCompletionStatus(model.id);
              
              return (
                <div 
                  key={model.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-explorer-chrome/20 ${
                    selectedModel === model.id ? 'bg-accent-teal/20' : ''
                  }`}
                  onClick={() => onModelSelect(model.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-explorer-text truncate">{model.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {getStatusIcon(completion.status)}
                      <span className="text-xs text-explorer-text-muted">
                        {completion.count}/{completion.total}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinModel(model.id);
                    }}
                  >
                    {isPinned ? (
                      <PinOff className="h-3 w-3" />
                    ) : (
                      <Pin className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextSidebar;
