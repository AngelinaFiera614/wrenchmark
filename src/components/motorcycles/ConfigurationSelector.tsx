
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Configuration {
  id: string;
  name?: string;
  is_default?: boolean;
  engines?: {
    displacement_cc?: number;
    power_hp?: number;
  };
  seat_height_mm?: number;
  weight_kg?: number;
  modelYear?: {
    year: number;
  };
}

interface ConfigurationSelectorProps {
  configurations: Configuration[];
  selectedConfigId?: string;
  onConfigurationSelect: (config: Configuration) => void;
}

const ConfigurationSelector = ({ 
  configurations, 
  selectedConfigId, 
  onConfigurationSelect 
}: ConfigurationSelectorProps) => {
  if (!configurations || configurations.length === 0) {
    return null;
  }

  // Group configurations by year if they have model year data
  const configsByYear = configurations.reduce((acc, config) => {
    const year = config.modelYear?.year || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(config);
    return acc;
  }, {} as Record<string, Configuration[]>);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Available Configurations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(configsByYear).map(([year, yearConfigs]) => (
            <div key={year} className="space-y-2">
              {Object.keys(configsByYear).length > 1 && (
                <h4 className="text-sm font-medium text-muted-foreground">
                  {year}
                </h4>
              )}
              <div className="flex flex-wrap gap-2">
                {yearConfigs.map((config) => {
                  const hasEngineData = config.engines && config.engines.displacement_cc && config.engines.displacement_cc > 0;
                  const hasDimensionData = config.seat_height_mm && config.seat_height_mm > 0 && config.weight_kg && config.weight_kg > 0;
                  
                  return (
                    <Button
                      key={config.id}
                      variant={selectedConfigId === config.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onConfigurationSelect(config)}
                      className="relative"
                    >
                      {config.name || `Configuration ${config.id.slice(0, 8)}`}
                      <div className="flex gap-1 ml-2">
                        {config.is_default && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-accent-teal/20 text-accent-teal"
                          >
                            Default
                          </Badge>
                        )}
                        {hasEngineData && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-green-500/20 text-green-600"
                          >
                            Engine
                          </Badge>
                        )}
                        {hasDimensionData && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-blue-500/20 text-blue-600"
                          >
                            Specs
                          </Badge>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationSelector;
