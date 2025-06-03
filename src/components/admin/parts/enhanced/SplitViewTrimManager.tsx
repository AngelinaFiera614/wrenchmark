
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye } from "lucide-react";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";
import LiveMotorcyclePreview from "./LiveMotorcyclePreview";

interface SplitViewTrimManagerProps {
  selectedYear: string | null;
  selectedConfig: string | null;
  selectedConfigData?: any;
  selectedModelData?: any;
  selectedYearData?: any;
  configurations: any[];
  handleConfigSelect: (configId: string) => void;
  refreshConfigurations: () => void;
  showPreview: boolean;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onTogglePreviewMode: () => void;
}

const SplitViewTrimManager = ({
  selectedYear,
  selectedConfig,
  selectedConfigData,
  selectedModelData,
  selectedYearData,
  configurations,
  handleConfigSelect,
  refreshConfigurations,
  showPreview,
  isPreviewMode,
  onTogglePreview,
  onTogglePreviewMode
}: SplitViewTrimManagerProps) => {
  if (!selectedYear) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Trim Level Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Please select a model and year from the sidebar to manage trim levels.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 h-full" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
      {/* Left Panel - Editor */}
      <div className="space-y-6">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              {isPreviewMode ? <Eye className="h-4 w-4" /> : null}
              {isPreviewMode ? "Preview Mode" : "Edit Mode"}
            </CardTitle>
            {selectedModelData && selectedYearData && (
              <div className="text-sm text-explorer-text-muted">
                {selectedModelData.brand?.name} {selectedModelData.name} • {selectedYearData.year}
              </div>
            )}
          </CardHeader>
        </Card>

        {isPreviewMode && selectedConfigData ? (
          <LiveMotorcyclePreview 
            configuration={selectedConfigData}
            modelData={selectedModelData}
            yearData={selectedYearData}
            onFlaggedClick={onTogglePreviewMode}
          />
        ) : (
          <TrimLevelManagerEnhanced
            modelYearId={selectedYear}
            configurations={configurations}
            selectedConfig={selectedConfig}
            onConfigSelect={handleConfigSelect}
            onConfigChange={refreshConfigurations}
          />
        )}
      </div>

      {/* Right Panel - Live Preview (when enabled) */}
      {showPreview && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Live Preview</CardTitle>
            <div className="text-sm text-explorer-text-muted">
              Real-time preview of the motorcycle page
            </div>
          </CardHeader>
          <CardContent>
            {selectedConfigData ? (
              <LiveMotorcyclePreview 
                configuration={selectedConfigData}
                modelData={selectedModelData}
                yearData={selectedYearData}
                onFlaggedClick={onTogglePreviewMode}
                compact={true}
              />
            ) : (
              <div className="text-center py-8 text-explorer-text-muted">
                Select a configuration to see live preview
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SplitViewTrimManager;
