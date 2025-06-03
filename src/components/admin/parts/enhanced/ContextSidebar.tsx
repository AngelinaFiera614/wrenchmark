
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Calendar, Settings, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import { usePinnedModels } from "@/hooks/usePinnedModels";

interface ContextSidebarProps {
  models: MotorcycleModel[];
  modelYears: ModelYear[];
  configurations: Configuration[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  selectedModelData?: MotorcycleModel;
  selectedYearData?: ModelYear;
  selectedConfigData?: Configuration;
  handleModelSelect: (modelId: string) => void;
  handleYearSelect: (yearId: string) => void;
  handleConfigSelect: (configId: string) => void;
}

const ContextSidebar = ({
  models,
  modelYears,
  configurations,
  selectedModel,
  selectedYear,
  selectedConfig,
  selectedModelData,
  selectedYearData,
  selectedConfigData,
  handleModelSelect,
  handleYearSelect,
  handleConfigSelect
}: ContextSidebarProps) => {
  const { pinnedModelIds, unpinModel } = usePinnedModels();
  const pinnedModels = models.filter(model => pinnedModelIds.includes(model.id));

  const getStatusIcon = (item: any, type: 'model' | 'year' | 'config') => {
    // Mock completion logic - replace with actual validation
    const hasBasicData = item.name || item.year;
    const hasAdvancedData = type === 'config' ? 
      (item.engine_id && item.brake_system_id) : 
      (type === 'year' ? item.msrp_usd : item.base_description);
    
    if (hasBasicData && hasAdvancedData) return <CheckCircle className="h-3 w-3 text-green-400" />;
    if (hasBasicData) return <Clock className="h-3 w-3 text-yellow-400" />;
    return <AlertCircle className="h-3 w-3 text-red-400" />;
  };

  return (
    <div className="space-y-6 h-full">
      {/* Pinned Models */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Pin className="h-4 w-4 text-accent-teal" />
            Pinned Models
            <Badge variant="secondary" className="ml-auto">
              {pinnedModels.length}/5
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pinnedModels.length === 0 ? (
            <div className="text-center py-4 text-explorer-text-muted text-sm">
              No pinned models yet. Pin models you're working on for quick access.
            </div>
          ) : (
            <div className="space-y-2">
              {pinnedModels.map((model) => (
                <div
                  key={model.id}
                  className={`group flex items-center justify-between p-3 rounded-md border transition-colors cursor-pointer ${
                    selectedModel === model.id
                      ? 'bg-accent-teal/20 border-accent-teal/30'
                      : 'bg-explorer-dark hover:bg-explorer-chrome/10 border-explorer-chrome/20'
                  }`}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(model, 'model')}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {model.brand?.name || 'Unknown'} {model.name}
                      </div>
                      <div className="text-xs text-explorer-text-muted">
                        {model.type} • {model.production_status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Context Navigation - Only show when model selected */}
      {selectedModel && (
        <Card className="bg-explorer-card border-explorer-chrome/30 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Settings className="h-4 w-4 text-accent-teal" />
              Context Navigation
            </CardTitle>
            {selectedModelData && (
              <div className="text-sm text-explorer-text-muted">
                {selectedModelData.brand?.name} {selectedModelData.name}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <Tabs defaultValue="years" className="h-full">
              <TabsList className="grid w-full grid-cols-2 bg-explorer-dark border-explorer-chrome/30">
                <TabsTrigger 
                  value="years"
                  className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Years
                </TabsTrigger>
                <TabsTrigger 
                  value="trims"
                  className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Trims
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="years" className="mt-4 space-y-2">
                {modelYears.length === 0 ? (
                  <div className="text-center py-4 text-explorer-text-muted text-sm">
                    No years found for this model
                  </div>
                ) : (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {modelYears.map((year) => (
                      <Button
                        key={year.id}
                        variant="ghost"
                        onClick={() => handleYearSelect(year.id)}
                        className={`w-full justify-start p-2 h-auto ${
                          selectedYear === year.id
                            ? 'bg-accent-teal/20 text-accent-teal'
                            : 'hover:bg-explorer-chrome/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {getStatusIcon(year, 'year')}
                          <div className="flex-1 text-left">
                            <div className="font-medium">{year.year}</div>
                            {year.changes && (
                              <div className="text-xs text-explorer-text-muted truncate">
                                {year.changes}
                              </div>
                            )}
                          </div>
                          {year.is_available && (
                            <Badge variant="secondary" className="text-xs">
                              Available
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="trims" className="mt-4 space-y-2">
                {!selectedYear ? (
                  <div className="text-center py-4 text-explorer-text-muted text-sm">
                    Select a year to view trim levels
                  </div>
                ) : configurations.length === 0 ? (
                  <div className="text-center py-4 text-explorer-text-muted text-sm">
                    No trim levels found for this year
                  </div>
                ) : (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {configurations.map((config) => (
                      <Button
                        key={config.id}
                        variant="ghost"
                        onClick={() => handleConfigSelect(config.id)}
                        className={`w-full justify-start p-2 h-auto ${
                          selectedConfig === config.id
                            ? 'bg-accent-teal/20 text-accent-teal'
                            : 'hover:bg-explorer-chrome/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {getStatusIcon(config, 'config')}
                          <div className="flex-1 text-left">
                            <div className="font-medium">
                              {config.name || `Configuration ${config.id.slice(0, 8)}`}
                            </div>
                            {config.trim_level && (
                              <div className="text-xs text-explorer-text-muted">
                                {config.trim_level}
                              </div>
                            )}
                          </div>
                          {config.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContextSidebar;
