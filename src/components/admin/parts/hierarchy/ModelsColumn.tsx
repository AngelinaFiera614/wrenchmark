
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Pin, PinOff } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";
import { usePinnedModels } from "@/hooks/usePinnedModels";

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
  const { pinModel, unpinModel, isPinned, canPin } = usePinnedModels();

  const filteredModels = models?.filter(model => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      model.name.toLowerCase().includes(query) ||
      (model.brands?.name || '').toLowerCase().includes(query) ||
      model.type.toLowerCase().includes(query)
    );
  }) || [];

  const handlePinToggle = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinned(modelId)) {
      unpinModel(modelId);
    } else if (canPin()) {
      pinModel(modelId);
    }
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text">
          Motorcycle Models
          <Badge variant="secondary" className="ml-2">
            {filteredModels.length}
          </Badge>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className={`group relative p-3 rounded-md border transition-colors cursor-pointer ${
                selectedModel === model.id
                  ? 'bg-accent-teal/20 border-accent-teal/30'
                  : 'bg-explorer-dark hover:bg-explorer-chrome/10 border-explorer-chrome/20'
              }`}
              onClick={() => onModelSelect(model.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {model.brands?.name || 'Unknown'} {model.name}
                  </div>
                  <div className="text-sm text-explorer-text-muted">
                    {model.type} • {model.production_status}
                  </div>
                  {model.production_start_year && (
                    <div className="text-xs text-explorer-text-muted">
                      {model.production_start_year}
                      {model.production_end_year && ` - ${model.production_end_year}`}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handlePinToggle(model.id, e)}
                  className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isPinned(model.id) 
                      ? 'text-accent-teal' 
                      : canPin() 
                        ? 'text-explorer-text-muted hover:text-accent-teal' 
                        : 'text-explorer-text-muted/50 cursor-not-allowed'
                  }`}
                  disabled={!isPinned(model.id) && !canPin()}
                  title={
                    isPinned(model.id) 
                      ? 'Unpin model' 
                      : canPin() 
                        ? 'Pin model for quick access' 
                        : 'Maximum 5 models can be pinned'
                  }
                >
                  {isPinned(model.id) ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelsColumn;
