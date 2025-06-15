
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConfigurationListSectionProps {
  configurations: any[];
  selectedConfig: string | null;
  onSelectConfig: (id: string) => void;
  loading: boolean;
  onShowBulkOps: () => void;
}

const ConfigurationListSection: React.FC<ConfigurationListSectionProps> = ({
  configurations,
  selectedConfig,
  onSelectConfig,
  loading,
  onShowBulkOps
}) => (
  <Card className="bg-explorer-card border-explorer-chrome/30">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-explorer-text">Configurations</CardTitle>
        <Button
          size="sm"
          onClick={onShowBulkOps}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          Bulk Operations
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 bg-explorer-chrome/20 rounded animate-pulse" />
          ))}
        </div>
      ) : configurations.length > 0 ? (
        <div className="space-y-3">
          {configurations.map((config) => (
            <div
              key={config.id}
              className={`p-3 border rounded cursor-pointer transition-all ${
                selectedConfig === config.id
                  ? 'border-accent-teal bg-accent-teal/10'
                  : 'border-explorer-chrome/30 hover:border-explorer-chrome/50'
              }`}
              onClick={() => onSelectConfig(config.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-explorer-text">
                    {config.name || "Standard Configuration"}
                  </h4>
                  <p className="text-sm text-explorer-text-muted">
                    {config.trim_level && `${config.trim_level} • `}
                    {config.market_region || 'Global'}
                  </p>
                </div>
                {config.is_default && (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-explorer-text-muted text-sm">No configurations found</p>
      )}
    </CardContent>
  </Card>
);

export default ConfigurationListSection;
