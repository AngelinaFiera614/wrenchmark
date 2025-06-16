
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Building2, AlertCircle, RefreshCw } from "lucide-react";

interface ModelSelectionPanelProps {
  models: any[];
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
  loading: boolean;
  error?: any;
  onRefresh?: () => void;
}

const ModelSelectionPanel: React.FC<ModelSelectionPanelProps> = ({
  models,
  selectedModel,
  onModelSelect,
  loading,
  error,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brands?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Models
            <Badge variant="secondary" className="ml-auto">
              {models.length}
            </Badge>
          </CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="border-explorer-chrome/30"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load models: {error.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-explorer-chrome/20 rounded animate-pulse" />
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">No models found</p>
            <p className="text-sm text-explorer-text-muted">
              Check your database connection or add some motorcycle models first.
            </p>
            {onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                className="mt-4 border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            )}
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
            <Search className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">No models match your search</p>
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="mt-2 text-accent-teal hover:bg-accent-teal/10"
            >
              Clear search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelSelectionPanel;
