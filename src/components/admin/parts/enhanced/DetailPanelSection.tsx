
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor } from "lucide-react";

interface DetailPanelSectionProps {
  config?: any;
}

const DetailPanelSection: React.FC<DetailPanelSectionProps> = ({ config }) => {
  if (!config) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-8 text-center">
          <Monitor className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
          <p className="text-explorer-text-muted">
            Select a configuration to view details
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text">Configuration Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-explorer-text">{config.name}</h4>
          {config.msrp_usd && (
            <p className="text-sm text-explorer-text-muted">
              ${config.msrp_usd.toLocaleString()}
            </p>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-explorer-text-muted">Engine:</span>
            <span className="text-explorer-text">
              {config.engines?.name || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-explorer-text-muted">Brakes:</span>
            <span className="text-explorer-text">
              {config.brake_systems?.type || 'Not set'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailPanelSection;
