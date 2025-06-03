
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface TrimSectionProps {
  configurations: Configuration[];
  selectedYear: string | null;
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
  onAddTrim: () => void;
}

const TrimSection = ({
  configurations,
  selectedYear,
  selectedConfig,
  onConfigSelect,
  onConfigChange,
  onAddTrim
}: TrimSectionProps) => {
  if (!selectedYear) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Trim Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            Select a model year to view trim levels
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center justify-between">
          <div className="flex items-center gap-2">
            Trim Levels
            <Badge variant="secondary">
              {configurations.length} trims
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={onAddTrim}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trim
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {configurations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">No trim levels found</p>
            <p className="text-xs text-explorer-text-muted">
              This year may need trim level configuration
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configurations.map((config) => (
              <Button
                key={config.id}
                variant="ghost"
                onClick={() => onConfigSelect(config.id)}
                className={`h-auto p-4 text-left ${
                  selectedConfig === config.id
                    ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30 border'
                    : 'bg-explorer-dark hover:bg-explorer-chrome/10 border border-explorer-chrome/20'
                }`}
              >
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{config.name || "Standard"}</span>
                    {config.is_default && (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        Default
                      </Badge>
                    )}
                  </div>
                  
                  {config.price_premium_usd && (
                    <div className="text-sm text-green-400">
                      +${config.price_premium_usd.toLocaleString()} premium
                    </div>
                  )}
                  
                  {config.trim_level && (
                    <div className="text-xs text-explorer-text-muted">
                      Trim: {config.trim_level}
                    </div>
                  )}
                  
                  {config.special_features && config.special_features.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {config.special_features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs px-2 py-1">
                          {feature}
                        </Badge>
                      ))}
                      {config.special_features.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{config.special_features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrimSection;
