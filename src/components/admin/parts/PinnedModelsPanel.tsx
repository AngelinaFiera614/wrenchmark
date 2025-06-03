
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pin, PinOff, Eye } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";
import { usePinnedModels } from "@/hooks/usePinnedModels";

interface PinnedModelsPanelProps {
  models: MotorcycleModel[];
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
}

const PinnedModelsPanel = ({ models, selectedModel, onModelSelect }: PinnedModelsPanelProps) => {
  const { pinnedModelIds, unpinModel } = usePinnedModels();

  const pinnedModels = models.filter(model => pinnedModelIds.includes(model.id));

  if (pinnedModels.length === 0) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Pin className="h-4 w-4 text-accent-teal" />
            Pinned Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-explorer-text-muted text-sm">
            No pinned models yet. Pin models you're working on for quick access.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
        <div className="space-y-2">
          {pinnedModels.map((model) => (
            <div
              key={model.id}
              className={`group flex items-center justify-between p-3 rounded-md border transition-colors ${
                selectedModel === model.id
                  ? 'bg-accent-teal/20 border-accent-teal/30'
                  : 'bg-explorer-dark hover:bg-explorer-chrome/10 border-explorer-chrome/20'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {model.brand?.name || 'Unknown'} {model.name}
                </div>
                <div className="text-xs text-explorer-text-muted">
                  {model.type} • {model.production_status}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onModelSelect(model.id)}
                  className="h-6 w-6 opacity-70 hover:opacity-100"
                  title="Select this model"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => unpinModel(model.id)}
                  className="h-6 w-6 opacity-70 hover:opacity-100 text-orange-400 hover:text-orange-300"
                  title="Unpin this model"
                >
                  <PinOff className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PinnedModelsPanel;
