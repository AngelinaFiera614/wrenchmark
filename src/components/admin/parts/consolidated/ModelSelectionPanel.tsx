
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Building2, AlertCircle, RefreshCw, Database } from "lucide-react";

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
    (model.brands?.name && model.brands.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getModelDisplayName = (model: any) => {
    const brandName = model.brands?.name || "Unknown Brand";
    const productionYears = model.production_start_year 
      ? `${model.production_start_year}${model.production_end_year ? `-${model.production_end_year}` : "-Present"}`
      : "Unknown Years";
    
    return { brandName, productionYears };
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Select Motorcycle Model
            </CardTitle>
            <p className="text-sm text-explorer-text-muted mt-1">
              Choose a motorcycle model to manage its configurations
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {models.length} models
            </Badge>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder="Search by model name or brand..."
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
              Failed to load models. Database connection issue detected.
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="mt-2 ml-2"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-explorer-chrome/20 rounded animate-pulse" />
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-explorer-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-explorer-text mb-2">No Models Found</h3>
            <p className="text-sm text-explorer-text-muted mb-4">
              {error ? "Database connection issue" : "No motorcycle models available"}
            </p>
            {onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {error ? "Retry Connection" : "Refresh Models"}
              </Button>
            )}
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredModels.map((model) => {
              const { brandName, productionYears } = getModelDisplayName(model);
              
              return (
                <Button
                  key={model.id}
                  variant={selectedModel === model.id ? "default" : "ghost"}
                  onClick={() => onModelSelect(model.id)}
                  className={`w-full justify-start text-left h-auto p-4 ${
                    selectedModel === model.id
                      ? "bg-accent-teal text-black hover:bg-accent-teal/80"
                      : "text-explorer-text hover:bg-explorer-chrome/20"
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-base">{model.name}</div>
                      {selectedModel === model.id && (
                        <Badge variant="secondary" className="bg-black/20 text-black text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm opacity-80 font-medium">
                        {brandName}
                      </div>
                      <div className="text-sm opacity-70">
                        {productionYears}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">No models match your search</p>
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="text-accent-teal hover:bg-accent-teal/10"
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
