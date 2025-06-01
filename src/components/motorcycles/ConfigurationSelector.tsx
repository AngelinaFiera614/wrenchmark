
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Configuration } from "@/types/motorcycle";

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

  // Group configurations by year if they have model_year data
  const configsByYear = configurations.reduce((acc, config) => {
    const year = config.model_year?.year || 'Unknown';
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
                {yearConfigs.map((config) => (
                  <Button
                    key={config.id}
                    variant={selectedConfigId === config.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onConfigurationSelect(config)}
                    className="relative"
                  >
                    {config.name || `Configuration ${config.id.slice(0, 8)}`}
                    {config.is_default && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 text-xs bg-accent-teal/20 text-accent-teal"
                      >
                        Default
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationSelector;
