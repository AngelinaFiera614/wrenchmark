
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, DollarSign, Palette } from "lucide-react";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";
import ComponentsSection from "./ComponentsSection";
import ColorManagementSection from "./ColorManagementSection";
import { Configuration } from "@/types/motorcycle";

interface TrimSectionProps {
  modelYearId: string | null;
  configurations: Configuration[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const TrimSection = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange
}: TrimSectionProps) => {
  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  if (!modelYearId) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
            <h3 className="text-lg font-medium text-explorer-text mb-2">
              Select a Model Year
            </h3>
            <p className="text-explorer-text-muted">
              Choose a model year to manage trim levels and configurations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleManageComponents = () => {
    console.log("Opening component library...");
    // Implement component management
  };

  const handleBulkAssign = () => {
    console.log("Opening bulk assign dialog...");
    // Implement bulk assignment
  };

  return (
    <div className="space-y-6">
      {/* Trim Levels Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-accent-teal" />
              <CardTitle className="text-explorer-text">Trim Levels & Configurations</CardTitle>
            </div>
            <Badge variant="outline" className="bg-explorer-dark border-explorer-chrome/30">
              {configurations.length} {configurations.length === 1 ? 'Configuration' : 'Configurations'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-explorer-text-muted">Pricing & MSRP</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 text-blue-400" />
              <span className="text-explorer-text-muted">Component Overrides</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-purple-400" />
              <span className="text-explorer-text-muted">Color Options</span>
            </div>
          </div>
          <p className="text-sm text-explorer-text-muted">
            Create different trim levels with specific pricing, component configurations, and color options.
          </p>
        </CardContent>
      </Card>

      {/* Trim Level Manager */}
      <TrimLevelManagerEnhanced
        modelYearId={modelYearId}
        configurations={configurations}
        selectedConfig={selectedConfig}
        onConfigSelect={onConfigSelect}
        onConfigChange={onConfigChange}
      />

      {/* Components Section */}
      <ComponentsSection
        selectedYears={modelYearId ? [modelYearId] : []}
        onManageComponents={handleManageComponents}
        onBulkAssign={handleBulkAssign}
      />

      {/* Color Management Section */}
      <ColorManagementSection
        selectedConfig={selectedConfigData}
        onRefresh={onConfigChange}
      />
    </div>
  );
};

export default TrimSection;
