import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, RefreshCw, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateModelYears } from "@/services/models/modelYearService";
import ModelsColumn from "../../hierarchy/ModelsColumn";
import ModelYearsColumn from "../../hierarchy/ModelYearsColumn";
import TrimLevelsColumn from "../../hierarchy/TrimLevelsColumn";
import SimpleComponentsManager from "../SimpleComponentsManager";
import HorizontalTrimManager from "../HorizontalTrimManager";
import { useAdminPartsLayoutState } from "@/hooks/admin/useAdminPartsLayoutState";

const HierarchicalPartsLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [generatingYears, setGeneratingYears] = useState(false);
  const [activeTab, setActiveTab] = useState("components");
  
  const { toast } = useToast();

  // Destructure properties directly from hook
  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    selectedModelData,
    modelYears,
    models,
    configurations,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshConfigurations
  } = useAdminPartsLayoutState();

  const handleGenerateModelYears = async () => {
    if (!selectedModel || !selectedModelData) return;
    
    setGeneratingYears(true);
    try {
      console.log("Generating model years for model:", selectedModelData.name);
      await generateModelYears(selectedModel);
      
      toast({
        title: "Success!",
        description: "Model years generated successfully."
      });
      
      // Refresh model years data
      if (refreshConfigurations) {
        await refreshConfigurations();
      }
    } catch (error: any) {
      console.error("Error generating model years:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate model years: ${error.message}`
      });
    } finally {
      setGeneratingYears(false);
    }
  };

  const handleRetryModelYears = () => {
    if (refreshConfigurations) {
      refreshConfigurations();
    }
  };

  const handleComponentLinked = () => {
    if (refreshConfigurations) {
      refreshConfigurations();
    }
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setEditingConfig(null);
  };

  const handleEditConfig = (config: any) => {
    setIsCreatingNew(true);
    setEditingConfig(config);
  };

  const handleSaveConfig = async (configData: any) => {
    setIsCreatingNew(false);
    setEditingConfig(null);
    handleComponentLinked();
  };

  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    setEditingConfig(null);
  };

  if (isCreatingNew) {
    return (
      <div className="space-y-6">
        <HorizontalTrimManager
          modelYearIds={selectedYear ? [selectedYear] : []}
          configuration={editingConfig}
          onSave={handleSaveConfig}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Parts & Components Management</CardTitle>
          <p className="text-explorer-text-muted">
            Hierarchical view: Select Model → Year → Trim Level, then assign components
          </p>
        </CardHeader>
      </Card>

      {/* Three-Column Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Models Column */}
        <ModelsColumn
          models={models || []}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Model Years Column */}
        <ModelYearsColumn
          modelYears={modelYears || []}
          selectedModel={selectedModel}
          selectedYear={selectedYear}
          selectedModelData={selectedModelData}
          onYearSelect={handleYearSelect}
          onRetryModelYears={handleRetryModelYears}
          onGenerateModelYears={handleGenerateModelYears}
          generatingYears={generatingYears}
          isLoading={false}
        />

        {/* Trim Levels Column */}
        <TrimLevelsColumn
          configurations={configurations || []}
          selectedYear={selectedYear}
          selectedConfig={selectedConfig}
          onConfigSelect={handleConfigSelect}
        />
      </div>

      {/* Component Library */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-explorer-text">Component Library</CardTitle>
            {selectedYear && (
              <Button
                onClick={handleCreateNew}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Trim Level
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Component Assignment
              </TabsTrigger>
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Component Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="space-y-6">
              {!selectedModel ? (
                <div className="text-center py-8 text-explorer-text-muted">
                  Select a model from the hierarchy above to assign components
                </div>
              ) : (
                <SimpleComponentsManager
                  selectedModel={selectedModelData}
                  selectedConfiguration={null}
                  onComponentLinked={handleComponentLinked}
                />
              )}
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
              <SimpleComponentsManager
                selectedModel={selectedModelData}
                selectedConfiguration={null}
                onComponentLinked={handleComponentLinked}
                showManagementView={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HierarchicalPartsLayout;
