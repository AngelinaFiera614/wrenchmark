
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useAdminPartsAssignmentOptimized } from "@/hooks/useAdminPartsAssignmentOptimized";
import { validateConfiguration } from "../validation/ValidationEngine";
import ContextSidebar from "./ContextSidebar";
import MultiYearSelector from "./MultiYearSelector";
import TrimLevelsSection from "./TrimLevelsSection";
import ComponentsSection from "./ComponentsSection";
import HorizontalTrimManager from "./HorizontalTrimManager";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";

const EnhancedAdminPartsLayout = () => {
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
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

  const handleYearToggle = (yearId: string) => {
    setSelectedYears(prev => 
      prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  const handleSelectAllYears = () => {
    setSelectedYears(adminData.modelYears.map(year => year.id));
  };

  const handleClearAllYears = () => {
    setSelectedYears([]);
  };

  const handleCreateNew = (yearId?: string) => {
    if (!adminData.selectedModel) {
      alert("Please select a model first");
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

  const handleCopyConfig = (config: any) => {
    console.log("Copying configuration:", config);
    // Implement copy logic
  };

  const handleDeleteConfig = (config: any) => {
    console.log("Deleting configuration:", config);
    // Implement delete logic
  };

  const handlePreviewConfig = (config: any) => {
    adminData.handleConfigSelect(config.id);
  };

  const handleManageComponents = () => {
    console.log("Opening component library...");
    // Implement component management
  };

  const handleBulkAssign = () => {
    console.log("Opening bulk assign dialog...");
    // Implement bulk assignment
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
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

          {/* Main Panel - Horizontal Sections */}
          <div className="xl:col-span-3 space-y-6">
            {isCreatingNew ? (
              <HorizontalTrimManager
                modelYearId={selectedYears[0] || adminData.selectedYear || ""}
                configuration={editingConfig}
                onSave={handleSaveConfig}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {/* Years Section */}
                {adminData.selectedModel && (
                  <MultiYearSelector
                    modelYears={adminData.modelYears}
                    selectedYears={selectedYears}
                    onYearToggle={handleYearToggle}
                    onSelectAll={handleSelectAllYears}
                    onClearAll={handleClearAllYears}
                  />
                )}

                {/* Trim Levels Section */}
                {adminData.selectedModel && (
                  <TrimLevelsSection
                    selectedYears={selectedYears}
                    configurations={adminData.configurations}
                    onCreateNew={handleCreateNew}
                    onEdit={handleEditConfig}
                    onCopy={handleCopyConfig}
                    onDelete={handleDeleteConfig}
                    onPreview={handlePreviewConfig}
                  />
                )}

                {/* Components Section */}
                {adminData.selectedModel && (
                  <ComponentsSection
                    selectedYears={selectedYears}
                    onManageComponents={handleManageComponents}
                    onBulkAssign={handleBulkAssign}
                  />
                )}

                {/* Legacy Trim Level Manager for existing functionality */}
                {adminData.selectedYear && (
                  <Card className="bg-explorer-card border-explorer-chrome/30 p-6">
                    <TrimLevelManagerEnhanced
                      modelYearId={adminData.selectedYear}
                      configurations={adminData.configurations}
                      selectedConfig={adminData.selectedConfig}
                      onConfigSelect={adminData.handleConfigSelect}
                      onConfigChange={adminData.refreshConfigurations}
                      validation={validation}
                      onEditConfig={handleEditConfig}
                    />
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminPartsLayout;
