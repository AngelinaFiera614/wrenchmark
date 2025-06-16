
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2 } from "lucide-react";

interface ModelSelectionPanelProps {
  models: any[];
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
  loading: boolean;
}

const ModelSelectionPanel: React.FC<ModelSelectionPanelProps> = ({
  models,
  selectedModel,
  onModelSelect,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brands?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Models
          <Badge variant="secondary" className="ml-auto">
            {models.length}
          </Badge>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-explorer-chrome/20 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredModels.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? "default" : "ghost"}
                onClick={() => onModelSelect(model.id)}
                className={`w-full justify-start text-left h-auto p-3 ${
                  selectedModel === model.id
                    ? "bg-accent-teal text-black hover:bg-accent-teal/80"
                    : "text-explorer-text hover:bg-explorer-chrome/20"
                }`}
              >
                <div className="w-full">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm opacity-70">
                    {model.brands?.name} • {model.production_start_year}
                    {model.production_end_year ? `-${model.production_end_year}` : "-Present"}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">No models found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelSelectionPanel;
