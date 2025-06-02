
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";

interface OptimizedNavigationColumnProps {
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
  onRefresh: () => void;
}

const OptimizedNavigationColumn = ({
  models,
  modelYears,
  configurations,
  selectedModel,
  selectedYear,
  selectedConfig,
  onModelSelect,
  onYearSelect,
  onConfigSelect,
  isLoading,
  onRefresh
}: OptimizedNavigationColumnProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());

  // Memoized filtered and grouped models
  const filteredModelsByBrand = useMemo(() => {
    let filteredModels = models || [];

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

    // Group by brand and sort
    return filteredModels.reduce((acc, model) => {
      const brandName = model.brand?.name || "Unknown Brand";
      if (!acc[brandName]) {
        acc[brandName] = [];
      }
      acc[brandName].push(model);
      return acc;
    }, {} as Record<string, MotorcycleModel[]>);
  }, [models, searchQuery]);

  const toggleBrandExpansion = (brandName: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brandName)) {
      newExpanded.delete(brandName);
    } else {
      newExpanded.add(brandName);
    }
    setExpandedBrands(newExpanded);
  };

  const selectedModelData = models?.find(m => m.id === selectedModel);
  const totalFilteredModels = Object.values(filteredModelsByBrand).reduce(
    (sum, brandModels) => sum + brandModels.length,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Models Column */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              Models
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {searchQuery ? `${totalFilteredModels} filtered` : `${models?.length || 0} total`}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRefresh}
                className="h-7 w-7 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search models, brands, types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {Object.keys(filteredModelsByBrand).length === 0 ? (
            <div className="p-8 text-center text-explorer-text-muted">
              {searchQuery ? "No models found matching your search" : "No models available"}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(filteredModelsByBrand).map(([brandName, brandModels]) => (
                <div key={brandName}>
                  <Button
                    variant="ghost"
                    onClick={() => toggleBrandExpansion(brandName)}
                    className="w-full justify-between p-3 hover:bg-explorer-chrome/10 border-b border-explorer-chrome/20"
                  >
                    <span className="font-medium text-explorer-text">{brandName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {brandModels.length}
                    </Badge>
                  </Button>
                  {expandedBrands.has(brandName) && (
                    <div>
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Years Column */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Model Years ({modelYears?.length || 0})
            {selectedModelData && (
              <Badge variant="outline" className="text-xs">
                {selectedModelData.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedModel ? (
            <div className="p-8 text-center text-explorer-text-muted">
              Select a model to view years
            </div>
          ) : modelYears?.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-2">
                No model years found
              </p>
              <p className="text-xs text-explorer-text-muted">
                This model may need year generation
              </p>
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
                      <div className="flex gap-2">
                        {year.is_available && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                            Available
                          </Badge>
                        )}
                      </div>
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
            Trim Levels ({configurations?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedYear ? (
            <div className="p-8 text-center text-explorer-text-muted">
              Select a model year to view trim levels
            </div>
          ) : configurations?.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-2">
                No trim levels found
              </p>
              <p className="text-xs text-explorer-text-muted">
                This year may need trim level configuration
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {configurations.map((config) => (
                <Button
                  key={config.id}
                  variant="ghost"
                  onClick={() => onConfigSelect(config.id)}
                  className={`w-full justify-start text-left p-4 h-auto border-b border-explorer-chrome/10 last:border-b-0 ${
                    selectedConfig === config.id
                      ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                      : 'text-explorer-text hover:bg-explorer-chrome/10'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-lg">{config.name || "Standard"}</span>
                      {config.is_default && (
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                          Default
                        </Badge>
                      )}
                    </div>
                    
                    {config.price_premium_usd && (
                      <div className="text-sm text-green-400 mb-2">
                        +${config.price_premium_usd.toLocaleString()} premium
                      </div>
                    )}
                    
                    {config.trim_level && (
                      <div className="text-xs text-explorer-text-muted mb-2">
                        Trim: {config.trim_level}
                      </div>
                    )}
                    
                    {config.special_features && config.special_features.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {config.special_features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-1">
                            {feature}
                          </Badge>
                        ))}
                        {config.special_features.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{config.special_features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
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

export default OptimizedNavigationColumn;
