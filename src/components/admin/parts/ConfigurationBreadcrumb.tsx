
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConfigurationBreadcrumbProps {
  selectedModelData: any;
  selectedYearData: any;
  selectedConfigData: any;
}

const ConfigurationBreadcrumb = ({
  selectedModelData,
  selectedYearData,
  selectedConfigData
}: ConfigurationBreadcrumbProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-explorer-text-muted">Configuration Path:</span>
          {selectedModelData && (
            <>
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                {selectedModelData.brands?.[0]?.name} {selectedModelData.name}
              </Badge>
              {selectedYearData && (
                <>
                  <span className="text-explorer-text-muted">→</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    {selectedYearData.year}
                  </Badge>
                  {selectedConfigData && (
                    <>
                      <span className="text-explorer-text-muted">→</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        {selectedConfigData.name || "Standard"}
                      </Badge>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {!selectedModelData && (
            <span className="text-explorer-text-muted">Select a brand and model to begin configuration workflow</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationBreadcrumb;
