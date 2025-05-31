
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface ConfigurationsColumnProps {
  configurations: Configuration[];
  selectedYear: string | null;
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
}

const ConfigurationsColumn = ({
  configurations,
  selectedYear,
  selectedConfig,
  onConfigSelect
}: ConfigurationsColumnProps) => {
  return (
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
        ) : configurations.length === 0 ? (
          <div className="p-8 text-center">
            <Settings className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">
              No configurations found
            </p>
            <p className="text-xs text-explorer-text-muted">
              This model year may not have any configurations set up yet
            </p>
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
  );
};

export default ConfigurationsColumn;
