
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Eye, Copy, History } from "lucide-react";
import ModelHierarchyNavigator from "@/components/admin/parts/ModelHierarchyNavigator";
import ConfigurationManager from "@/components/admin/parts/ConfigurationManager";
import ComponentLibrary from "@/components/admin/parts/ComponentLibrary";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";

const AdminPartsAssignment = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("navigator");
  const [showPreview, setShowPreview] = useState(false);

  // Fetch motorcycle models
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ["admin-motorcycle-models-parts"],
    queryFn: fetchAllMotorcycleModels
  });

  // Fetch model years for selected model
  const { data: modelYears, isLoading: yearsLoading } = useQuery({
    queryKey: ["model-years", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : [],
    enabled: !!selectedModel
  });

  // Fetch configurations for selected year
  const { data: configurations, isLoading: configsLoading } = useQuery({
    queryKey: ["configurations", selectedYear],
    queryFn: () => selectedYear ? fetchConfigurations(selectedYear) : [],
    enabled: !!selectedYear
  });

  const selectedModelData = models?.find(m => m.id === selectedModel);
  const selectedYearData = modelYears?.find(y => y.id === selectedYear);
  const selectedConfigData = configurations?.find(c => c.id === selectedConfig);

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  };

  const handleYearSelect = (yearId: string) => {
    setSelectedYear(yearId);
    setSelectedConfig(null);
  };

  const handleConfigSelect = (configId: string) => {
    setSelectedConfig(configId);
  };

  const handlePreviewConfig = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Parts Assignment</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage component assignments for motorcycle configurations
          </p>
        </div>
        
        {selectedConfig && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviewConfig}
              className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Configuration
            </Button>
            <Button
              variant="outline"
              className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Copy className="mr-2 h-4 w-4" />
              Clone Configuration
            </Button>
            <Button
              variant="outline"
              className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <History className="mr-2 h-4 w-4" />
              View History
            </Button>
          </div>
        )}
      </div>

      {/* Breadcrumb Navigation */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-explorer-text-muted">Navigation:</span>
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
              <span className="text-explorer-text-muted">Select a model to begin</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigator">Model Navigator</TabsTrigger>
          <TabsTrigger value="configurations" disabled={!selectedYear}>
            Configurations
          </TabsTrigger>
          <TabsTrigger value="components">Component Library</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="navigator" className="space-y-4">
          <ModelHierarchyNavigator
            models={models || []}
            modelYears={modelYears || []}
            configurations={configurations || []}
            selectedModel={selectedModel}
            selectedYear={selectedYear}
            selectedConfig={selectedConfig}
            onModelSelect={handleModelSelect}
            onYearSelect={handleYearSelect}
            onConfigSelect={handleConfigSelect}
            isLoading={modelsLoading || yearsLoading || configsLoading}
          />
        </TabsContent>

        <TabsContent value="configurations" className="space-y-4">
          {selectedYear && (
            <ConfigurationManager
              modelYearId={selectedYear}
              configurations={configurations || []}
              selectedConfig={selectedConfig}
              onConfigSelect={handleConfigSelect}
              onConfigChange={() => {
                // Refetch configurations when changes are made
                // This would typically trigger a refetch
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <ComponentLibrary />
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-explorer-text-muted mb-4" />
                <p className="text-explorer-text-muted">
                  Bulk operations will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Preview Modal */}
      {showPreview && selectedConfigData && (
        <ConfigurationPreview
          configuration={selectedConfigData}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default AdminPartsAssignment;
