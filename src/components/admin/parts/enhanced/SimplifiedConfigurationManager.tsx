
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelYear, Configuration, MotorcycleModel } from "@/types/motorcycle";
import EnhancedModelsColumn from "../hierarchy/EnhancedModelsColumn";
import YearsSection from "./YearsSection";
import TrimSection from "./TrimSection";

interface SimplifiedConfigurationManagerProps {
  models: MotorcycleModel[];
  modelYears: ModelYear[];
  configurations: Configuration[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  onModelSelect: (modelId: string) => void;
  onYearSelect: (yearId: string) => void;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
  isLoading: boolean;
}

const SimplifiedConfigurationManager = ({
  models,
  modelYears,
  configurations,
  selectedModel,
  selectedYear,
  selectedConfig,
  onModelSelect,
  onYearSelect,
  onConfigSelect,
  onConfigChange,
  isLoading
}: SimplifiedConfigurationManagerProps) => {
  const [activeTab, setActiveTab] = useState("selection");

  const selectedModelData = models?.find(m => m.id === selectedModel);
  const selectedYearData = modelYears?.find(y => y.id === selectedYear);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="selection">Model & Year Selection</TabsTrigger>
          <TabsTrigger value="trims">Trim Level Management</TabsTrigger>
        </TabsList>

        <TabsContent value="selection" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedModelsColumn
              models={models}
              selectedModel={selectedModel}
              onModelSelect={onModelSelect}
            />

            <YearsSection
              modelYears={modelYears}
              selectedModel={selectedModel}
              selectedYear={selectedYear}
              selectedModelData={selectedModelData}
              onYearSelect={onYearSelect}
              isLoading={isLoading}
            />
          </div>

          {/* Quick Selection Summary */}
          {selectedModelData && selectedYearData && (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Current Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-explorer-text-muted">Model</p>
                    <p className="font-medium text-explorer-text">
                      {selectedModelData.brand?.name} {selectedModelData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Year</p>
                    <p className="font-medium text-explorer-text">{selectedYearData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Configurations</p>
                    <p className="font-medium text-explorer-text">{configurations.length}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => setActiveTab("trims")}
                    disabled={!selectedYear}
                    className="bg-accent-teal text-black hover:bg-accent-teal/80"
                  >
                    Manage Trim Levels →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trims" className="space-y-6">
          {!selectedYear ? (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-8 text-center">
                <p className="text-explorer-text-muted mb-4">
                  Please select a model and year first to manage trim levels.
                </p>
                <Button
                  onClick={() => setActiveTab("selection")}
                  variant="outline"
                  className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
                >
                  ← Back to Selection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TrimSection
              modelYearId={selectedYear}
              configurations={configurations}
              selectedConfig={selectedConfig}
              onConfigSelect={onConfigSelect}
              onConfigChange={onConfigChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedConfigurationManager;
