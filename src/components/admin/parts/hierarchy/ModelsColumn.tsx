
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Wrench } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";
import ModelSearchInput from "../ModelSearchInput";

interface ModelsColumnProps {
  models: MotorcycleModel[];
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ModelsColumn = ({
  models,
  selectedModel,
  onModelSelect,
  searchQuery,
  onSearchChange
}: ModelsColumnProps) => {
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

  return (
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
          onSearchChange={onSearchChange}
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
  );
};

export default ModelsColumn;
