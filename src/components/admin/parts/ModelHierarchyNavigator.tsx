
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Calendar, Settings, Wrench } from "lucide-react";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import ModelSearchInput from "./ModelSearchInput";

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

  // Filter and group models based on search query
  const filteredModelsByBrand = useMemo(() => {
    let filteredModels = models;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredModels = models.filter((model) => {
        const brandName = model.brand?.name?.toLowerCase() || "";
        const modelName = model.name?.toLowerCase() || "";
        const modelType = model.type?.toLowerCase() || "";
        
        return (
          brandName.includes(query) ||
          modelName.includes(query) ||
          modelType.includes(query)
        );
      });
    }

    // Group filtered models by brand
    return filteredModels.reduce((acc, model) => {
      const brandName = model.brand?.name || "Unknown Brand";
      if (!acc[brandName]) {
        acc[brandName] = [];
      }
      acc[brandName].push(model);
      return acc;
    }, {} as Record<string, MotorcycleModel[]>);
  }, [models, searchQuery]);

  const totalFilteredModels = Object.values(filteredModelsByBrand).reduce(
    (sum, brandModels) => sum + brandModels.length,
    0
  );

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
      {/* Models Column */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Models
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {searchQuery ? `${totalFilteredModels} filtered` : `${models.length} total`}
            </Badge>
          </div>
          
          <ModelSearchInput
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search models, brands, types..."
          />
        </CardHeader>
        <CardContent className="p-0">
          {Object.keys(filteredModelsByBrand).length === 0 ? (
            <div className="p-8 text-center text-explorer-text-muted">
              {searchQuery ? "No models found matching your search" : "No models available"}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(filteredModelsByBrand).map(([brandName, brandModels]) => (
                <Collapsible key={brandName} defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-explorer-chrome/10 border-b border-explorer-chrome/20">
                    <span className="font-medium text-explorer-text">{brandName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {brandModels.length}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-explorer-text-muted" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {brandModels.map((model) => (
                      <Button
                        key={model.id}
                        variant="ghost"
                        onClick={() => onModelSelect(model.id)}
                        className={`w-full justify-start text-left p-3 h-auto ${
                          selectedModel === model.id
                            ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                            : 'text-explorer-text hover:bg-explorer-chrome/10'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-explorer-text-muted">
                            {model.type} • {model.production_start_year}
                            {model.production_end_year && ` - ${model.production_end_year}`}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Years Column */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Model Years ({modelYears.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedModel ? (
            <div className="p-8 text-center text-explorer-text-muted">
              Select a model to view years
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {modelYears.map((year) => (
                <Button
                  key={year.id}
                  variant="ghost"
                  onClick={() => onYearSelect(year.id)}
                  className={`w-full justify-start text-left p-3 h-auto border-b border-explorer-chrome/10 last:border-b-0 ${
                    selectedYear === year.id
                      ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                      : 'text-explorer-text hover:bg-explorer-chrome/10'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{year.year}</span>
                      <Badge variant="secondary" className="text-xs">
                        {year.configurations?.length || 0} configs
                      </Badge>
                    </div>
                    {year.changes && (
                      <div className="text-xs text-explorer-text-muted mt-1">
                        {year.changes}
                      </div>
                    )}
                    {year.msrp_usd && (
                      <div className="text-xs text-green-400 mt-1">
                        MSRP: ${year.msrp_usd.toLocaleString()}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurations Column */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurations ({configurations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedYear ? (
            <div className="p-8 text-center text-explorer-text-muted">
              Select a model year to view configurations
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {configurations.map((config) => (
                <Button
                  key={config.id}
                  variant="ghost"
                  onClick={() => onConfigSelect(config.id)}
                  className={`w-full justify-start text-left p-3 h-auto border-b border-explorer-chrome/10 last:border-b-0 ${
                    selectedConfig === config.id
                      ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                      : 'text-explorer-text hover:bg-explorer-chrome/10'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{config.name || "Standard"}</span>
                      {config.is_default && (
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                          Default
                        </Badge>
                      )}
                    </div>
                    {config.trim_level && (
                      <div className="text-xs text-explorer-text-muted mt-1">
                        Trim: {config.trim_level}
                      </div>
                    )}
                    {config.market_region && (
                      <div className="text-xs text-explorer-text-muted">
                        Region: {config.market_region}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {config.engine_id && (
                        <Badge variant="outline" className="text-xs">E</Badge>
                      )}
                      {config.brake_system_id && (
                        <Badge variant="outline" className="text-xs">B</Badge>
                      )}
                      {config.frame_id && (
                        <Badge variant="outline" className="text-xs">F</Badge>
                      )}
                      {config.suspension_id && (
                        <Badge variant="outline" className="text-xs">S</Badge>
                      )}
                      {config.wheel_id && (
                        <Badge variant="outline" className="text-xs">W</Badge>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelHierarchyNavigator;
