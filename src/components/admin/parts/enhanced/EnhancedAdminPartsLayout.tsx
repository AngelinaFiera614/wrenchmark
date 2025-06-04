
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Eye, EyeOff, RotateCcw, Plus } from "lucide-react";
import { useAdminPartsAssignmentOptimized } from "@/hooks/useAdminPartsAssignmentOptimized";
import { validateConfiguration } from "../validation/ValidationEngine";
import ContextSidebar from "./ContextSidebar";
import ComponentLibraryEnhanced from "./ComponentLibraryEnhanced";
import HorizontalTrimManager from "./HorizontalTrimManager";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";

type AdminMode = "trim-manager" | "component-library";

const EnhancedAdminPartsLayout = () => {
  const [activeMode, setActiveMode] = useState<AdminMode>("trim-manager");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  
  const adminData = useAdminPartsAssignmentOptimized();

  // Validation for current configuration
  const validation = validateConfiguration(
    adminData.selectedConfigData,
    adminData.selectedModelData,
    adminData.selectedYearData,
    adminData.configurations
  );

  const handleRunValidation = () => {
    console.log("Running full validation...");
    console.log("Validation results:", validation);
  };

  const handleCreateNew = () => {
    if (!adminData.selectedYear) {
      alert("Please select a model and year first");
      return;
    }
    setEditingConfig(null);
    setIsCreatingNew(true);
  };

  const handleEditConfig = (config: any) => {
    setEditingConfig(config);
    setIsCreatingNew(true);
  };

  const handleSaveConfig = (savedConfig: any) => {
    console.log("Configuration saved:", savedConfig);
    setIsCreatingNew(false);
    setEditingConfig(null);
    adminData.refreshConfigurations();
    adminData.handleConfigSelect(savedConfig.id);
  };

  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    setEditingConfig(null);
  };

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text">
      {/* Header */}
      <div className="border-b border-explorer-chrome/30 bg-explorer-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-explorer-text">MOTORCYCLE CONFIGURATIONS</h1>
              <p className="text-explorer-text-muted">Manage models, trims, and components</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunValidation}
                className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Run Full Validation
              </Button>
              {activeMode === "trim-manager" && adminData.selectedYear && (
                <Button
                  onClick={handleCreateNew}
                  className="bg-accent-teal text-black hover:bg-accent-teal/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Trim Level
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Context Sensitive */}
          <div className="xl:col-span-1">
            <ContextSidebar 
              selectedModel={adminData.selectedModel}
              selectedYear={adminData.selectedYear}
              selectedConfig={adminData.selectedConfig}
              selectedModelData={adminData.selectedModelData}
              selectedYearData={adminData.selectedYearData}
              selectedConfigData={adminData.selectedConfigData}
              models={adminData.models}
              modelYears={adminData.modelYears}
              configurations={adminData.configurations}
              onModelSelect={adminData.handleModelSelect}
              onYearSelect={adminData.handleYearSelect}
              onConfigSelect={adminData.handleConfigSelect}
            />
          </div>

          {/* Main Panel */}
          <div className="xl:col-span-3 flex flex-col">
            {/* Two-Mode Navigation */}
            <Card className="bg-explorer-card border-explorer-chrome/30 mb-6">
              <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as AdminMode)}>
                <TabsList className="grid w-full grid-cols-2 bg-explorer-dark border-explorer-chrome/30">
                  <TabsTrigger 
                    value="trim-manager"
                    className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
                  >
                    Trim Level Manager
                  </TabsTrigger>
                  <TabsTrigger 
                    value="component-library"
                    className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
                  >
                    Component Library
                  </TabsTrigger>
                </TabsList>

                {/* Mode Content */}
                <div className="flex-1 mt-6">
                  <TabsContent value="trim-manager" className="m-0 h-full">
                    {isCreatingNew ? (
                      <HorizontalTrimManager
                        modelYearId={adminData.selectedYear!}
                        configuration={editingConfig}
                        onSave={handleSaveConfig}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <TrimLevelManagerEnhanced
                        modelYearId={adminData.selectedYear || ""}
                        configurations={adminData.configurations}
                        selectedConfig={adminData.selectedConfig}
                        onConfigSelect={adminData.handleConfigSelect}
                        onConfigChange={adminData.refreshConfigurations}
                        validation={validation}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="component-library" className="m-0 h-full">
                    <ComponentLibraryEnhanced
                      selectedConfig={adminData.selectedConfig}
                      selectedConfigData={adminData.selectedConfigData}
                      handleComponentLinked={adminData.handleComponentLinked}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminPartsLayout;
