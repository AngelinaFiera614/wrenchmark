
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useAdminPartsAssignmentOptimized } from "@/hooks/useAdminPartsAssignmentOptimized";
import { validateConfiguration } from "../validation/ValidationEngine";
import ContextSidebar from "./ContextSidebar";
import ModelNavigatorEnhanced from "./ModelNavigatorEnhanced";
import SplitViewTrimManager from "./SplitViewTrimManager";
import ComponentLibraryEnhanced from "./ComponentLibraryEnhanced";
import StickyNavigationTabs from "../navigation/StickyNavigationTabs";

type AdminMode = "navigator" | "trim-manager" | "component-library";

const EnhancedAdminPartsLayout = () => {
  const [activeMode, setActiveMode] = useState<AdminMode>("navigator");
  const [activeSectionTab, setActiveSectionTab] = useState("basic");
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
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

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleTogglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
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
              {activeMode === "trim-manager" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTogglePreviewMode}
                    className={isPreviewMode ? "bg-accent-teal/20 text-accent-teal" : ""}
                  >
                    {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTogglePreview}
                    className={showPreview ? "bg-blue-500/20 text-blue-400" : ""}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showPreview ? "Hide Live Preview" : "Show Live Preview"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Section Navigation - Only show in trim manager mode */}
      {activeMode === "trim-manager" && adminData.selectedConfig && (
        <StickyNavigationTabs
          activeTab={activeSectionTab}
          onTabChange={setActiveSectionTab}
          sectionStatus={validation.sectionStatus}
          completeness={validation.completeness}
        />
      )}

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
            {/* Three-Mode Navigation */}
            <Card className="bg-explorer-card border-explorer-chrome/30 mb-6">
              <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as AdminMode)}>
                <TabsList className="grid w-full grid-cols-3 bg-explorer-dark border-explorer-chrome/30">
                  <TabsTrigger 
                    value="navigator"
                    className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
                  >
                    Model Navigator
                  </TabsTrigger>
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
                  <TabsContent value="navigator" className="m-0 h-full">
                    <ModelNavigatorEnhanced {...adminData} />
                  </TabsContent>
                  
                  <TabsContent value="trim-manager" className="m-0 h-full">
                    <SplitViewTrimManager 
                      selectedYear={adminData.selectedYear}
                      selectedConfig={adminData.selectedConfig}
                      selectedConfigData={adminData.selectedConfigData}
                      selectedModelData={adminData.selectedModelData}
                      selectedYearData={adminData.selectedYearData}
                      configurations={adminData.configurations}
                      handleConfigSelect={adminData.handleConfigSelect}
                      refreshConfigurations={adminData.refreshConfigurations}
                      showPreview={showPreview}
                      isPreviewMode={isPreviewMode}
                      onTogglePreview={handleTogglePreview}
                      onTogglePreviewMode={handleTogglePreviewMode}
                      activeSectionTab={activeSectionTab}
                      validation={validation}
                    />
                  </TabsContent>
                  
                  <TabsContent value="component-library" className="m-0 h-full">
                    <ComponentLibraryEnhanced {...adminData} />
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
