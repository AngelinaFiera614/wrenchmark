
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, PinOff, CheckCircle, AlertTriangle, Clock, Search, Calendar, Settings } from "lucide-react";
import { usePinnedModels } from "@/hooks/usePinnedModels";
import { validateConfiguration } from "../../validation/ValidationEngine";

interface EnhancedContextSidebarProps {
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

const EnhancedContextSidebar = ({
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
}: EnhancedContextSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { pinnedModelIds, pinModel, unpinModel, isPinned, canPin } = usePinnedModels();

  const getModelCompletionStatus = (modelId: string) => {
    // Add null/undefined checks for configurations and modelYears
    if (!configurations || !modelYears || !Array.isArray(configurations) || !Array.isArray(modelYears)) {
      return { status: 'missing', count: 0, total: 0 };
    }

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

  // Add null check for models array
  const filteredModels = models?.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const pinnedModels = models?.filter(model => isPinned(model.id)) || [];

  return (
    <div className="space-y-4">
      {/* Current Selection Breadcrumb */}
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
              <div className="text-sm text-explorer-text">{selectedConfigData.name || 'Standard'}</div>
            </div>
          )}
          {!selectedModel && (
            <div className="text-sm text-explorer-text-muted">Select a model to begin</div>
          )}
        </CardContent>
      </Card>

      {/* Pinned Models */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-sm">
            Pinned Models ({pinnedModels.length}/5)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pinnedModels.length === 0 ? (
            <div className="text-xs text-explorer-text-muted">No pinned models</div>
          ) : (
            <div className="space-y-2">
              {pinnedModels.map(model => {
                const completion = getModelCompletionStatus(model.id);
                
                return (
                  <div 
                    key={model.id}
                    className={`flex items-center justify-between p-2 rounded bg-explorer-dark cursor-pointer hover:bg-explorer-chrome/20 ${
                      selectedModel === model.id ? 'ring-2 ring-accent-teal' : ''
                    }`}
                    onClick={() => onModelSelect(model.id)}
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
                        unpinModel(model.id);
                      }}
                    >
                      <PinOff className="h-3 w-3 text-accent-teal" />
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
        <CardContent>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-explorer-text-muted" />
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredModels.slice(0, 10).map(model => {
                const isPinnedModel = isPinned(model.id);
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
                        if (isPinnedModel) {
                          unpinModel(model.id);
                        } else if (canPin()) {
                          pinModel(model.id);
                        }
                      }}
                      disabled={!isPinnedModel && !canPin()}
                    >
                      {isPinnedModel ? (
                        <PinOff className="h-3 w-3 text-accent-teal" />
                      ) : (
                        <Pin className="h-3 w-3 text-explorer-text-muted hover:text-accent-teal" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Years - Only show when model is selected */}
      {selectedModel && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Model Years ({modelYears?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!modelYears || modelYears.length === 0 ? (
              <div className="text-xs text-explorer-text-muted">No years available</div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {modelYears.map(year => (
                  <div
                    key={year.id}
                    className={`p-2 rounded cursor-pointer hover:bg-explorer-chrome/20 ${
                      selectedYear === year.id ? 'bg-accent-teal/20 text-accent-teal' : 'text-explorer-text'
                    }`}
                    onClick={() => onYearSelect(year.id)}
                  >
                    <div className="text-sm font-medium">{year.year}</div>
                    {year.changes && (
                      <div className="text-xs text-explorer-text-muted truncate">{year.changes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Configurations/Trims - Only show when year is selected */}
      {selectedYear && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurations ({configurations?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!configurations || configurations.length === 0 ? (
              <div className="text-xs text-explorer-text-muted">No configurations available</div>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {configurations.map(config => (
                  <div
                    key={config.id}
                    className={`p-2 rounded cursor-pointer hover:bg-explorer-chrome/20 ${
                      selectedConfig === config.id ? 'bg-accent-teal/20 text-accent-teal' : 'text-explorer-text'
                    }`}
                    onClick={() => onConfigSelect(config.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">{config.name || 'Standard'}</div>
                      {config.is_default && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                    {config.trim_level && (
                      <div className="text-xs text-explorer-text-muted">{config.trim_level}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedContextSidebar;
