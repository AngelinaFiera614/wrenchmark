
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Plus, CheckCircle, AlertTriangle } from "lucide-react";

interface TrimManagementPanelProps {
  configurations: any[];
  selectedConfig: string | null;
  selectedYearData?: any;
  onConfigSelect: (configId: string) => void;
  loading: boolean;
}

const TrimManagementPanel: React.FC<TrimManagementPanelProps> = ({
  configurations,
  selectedConfig,
  selectedYearData,
  onConfigSelect,
  loading
}) => {
  const getConfigCompleteness = (config: any) => {
    const requiredComponents = ['engine_id', 'brake_system_id', 'frame_id'];
    const presentComponents = requiredComponents.filter(comp => config[comp]).length;
    return (presentComponents / requiredComponents.length) * 100;
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Configurations
            <Badge variant="secondary" className="ml-auto">
              {configurations.length}
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Config
          </Button>
        </div>
        {selectedYearData && (
          <p className="text-sm text-explorer-text-muted">
            {selectedYearData.year} Model Year
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-explorer-chrome/20 rounded animate-pulse" />
            ))}
          </div>
        ) : configurations.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {configurations.map((config) => {
              const completeness = getConfigCompleteness(config);
              return (
                <Button
                  key={config.id}
                  variant={selectedConfig === config.id ? "default" : "ghost"}
                  onClick={() => onConfigSelect(config.id)}
                  className={`w-full justify-start text-left h-auto p-3 ${
                    selectedConfig === config.id
                      ? "bg-accent-teal text-black hover:bg-accent-teal/80"
                      : "text-explorer-text hover:bg-explorer-chrome/20"
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {config.name || config.trim_level || "Standard"}
                      </span>
                      {completeness >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                      )}
                    </div>
                    
                    {config.description && (
                      <div className="text-sm opacity-70 mb-2">
                        {config.description}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {config.engines && (
                        <Badge variant="outline" className="text-xs">
                          {config.engines.displacement_cc}cc
                        </Badge>
                      )}
                      {config.brake_systems && (
                        <Badge variant="outline" className="text-xs">
                          {config.brake_systems.type}
                        </Badge>
                      )}
                      {config.msrp_usd && (
                        <Badge variant="outline" className="text-xs text-green-400">
                          ${config.msrp_usd.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="w-full bg-explorer-chrome/30 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all ${
                            completeness >= 80 ? 'bg-green-400' :
                            completeness >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${completeness}%` }}
                        />
                      </div>
                      <div className="text-xs text-explorer-text-muted mt-1">
                        {Math.round(completeness)}% complete
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Settings2 className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">No configurations found for this year</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrimManagementPanel;
