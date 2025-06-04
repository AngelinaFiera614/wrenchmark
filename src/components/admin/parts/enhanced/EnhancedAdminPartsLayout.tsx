
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useAdminPartsAssignmentRefactored } from "@/hooks/admin/useAdminPartsAssignmentRefactored";
import { validateConfiguration } from "../validation/ValidationEngine";
import { Configuration } from "@/types/motorcycle";
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
  
  const adminData = useAdminPartsAssignmentRefactored();

  // Validation for current configuration
  const validation = validateConfiguration(
    adminData.selectedConfigData,
    adminData.selectedModelData,
    adminData.selectedYearData,
    adminData.configurations
  );

  // Sync selectedYears with the main hook's selected year
  useEffect(() => {
    if (adminData.selectedYear && !selectedYears.includes(adminData.selectedYear)) {
      console.log("Syncing selectedYears with hook's selectedYear:", adminData.selectedYear);
      setSelectedYears([adminData.selectedYear]);
    }
  }, [adminData.selectedYear]);

  // Get all configurations for the selected years from the main hook
  const allConfigsForSelectedYears = React.useMemo(() => {
    if (selectedYears.length === 0) return [];
    
    // If we only have one year selected and it matches the main hook's selected year,
    // use the configurations from the main hook for consistency
    if (selectedYears.length === 1 && selectedYears[0] === adminData.selectedYear) {
      console.log("Using configurations from main hook for single selected year");
      return adminData.configurations;
    }
    
    // For multiple years, we'll need to fetch separately - but for now use what we have
    // This could be enhanced to fetch multi-year data if needed
    console.log("Multiple years selected, using available configurations");
    return adminData.configurations.filter((config: Configuration) => 
      selectedYears.some(yearId => config.model_year_id === yearId)
    );
  }, [selectedYears, adminData.configurations, adminData.selectedYear]);

  const handleRunValidation = () => {
    console.log("Running full validation...");
    console.log("Validation results:", validation);
  };

  const handleYearToggle = (yearId: string) => {
    setSelectedYears(prev => {
      const newYears = prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId];
      
      console.log("Year toggled:", yearId, "New selection:", newYears);
      
      // If we're selecting a single year, also update the main hook's selection
      if (newYears.length === 1 && newYears[0] !== adminData.selectedYear) {
        console.log("Updating main hook's selected year to:", newYears[0]);
        adminData.handleYearSelect(newYears[0]);
      }
      
      return newYears;
    });
  };

  const handleSelectAllYears = () => {
    const allYearIds = adminData.modelYears.map((year: any) => year.id);
    console.log("Selecting all years:", allYearIds);
    setSelectedYears(allYearIds);
  };

  const handleClearAllYears = () => {
    console.log("Clearing all year selections");
    setSelectedYears([]);
  };

  const handleCreateNew = (yearIds?: string[]) => {
    if (!adminData.selectedModel) {
      alert("Please select a model first");
      return;
    }
    
    // Use provided yearIds or selected years, fallback to current year
    const yearsToUse = yearIds ? yearIds : selectedYears.length > 0 ? selectedYears : adminData.selectedYear ? [adminData.selectedYear] : [];
    
    if (yearsToUse.length === 0) {
      alert("Please select at least one model year");
      return;
    }
    
    console.log("Creating new trim for years:", yearsToUse);
    setSelectedYears(yearsToUse);
    setEditingConfig(null);
    setIsCreatingNew(true);
  };

  const handleEditConfig = (config: any) => {
    console.log("Editing configuration:", config);
    setEditingConfig(config);
    setSelectedYears([config.model_year_id]);
    setIsCreatingNew(true);
  };

  const handleSaveConfig = async (savedConfig: any) => {
    console.log("=== CONFIGURATION SAVED ===");
    console.log("Saved configuration:", savedConfig);
    
    setIsCreatingNew(false);
    setEditingConfig(null);
    
    // Enhanced refresh logic for multi-year operations
    const yearsToRefresh = selectedYears.length > 0 ? selectedYears : (savedConfig?.model_year_id ? [savedConfig.model_year_id] : []);
    
    console.log("Refreshing configurations for years:", yearsToRefresh);
    
    try {
      // Refresh the configurations through the main hook
      await adminData.refreshConfigurations(yearsToRefresh);
      
      // Small delay to ensure cache invalidation completes
      setTimeout(() => {
        // If we have a saved config, select it
        if (savedConfig?.id) {
          console.log("Auto-selecting newly saved configuration:", savedConfig.id);
          adminData.handleConfigSelect(savedConfig.id);
          
          // If the saved config year isn't selected, select it
          if (savedConfig.model_year_id && adminData.selectedYear !== savedConfig.model_year_id) {
            console.log("Updating selected year to match saved config:", savedConfig.model_year_id);
            adminData.handleYearSelect(savedConfig.model_year_id);
          }
        }
      }, 100);
      
    } catch (error) {
      console.error("Error during configuration save callback:", error);
    }
  };

  const handleCancelEdit = () => {
    console.log("Cancelling trim edit");
    setIsCreatingNew(false);
    setEditingConfig(null);
  };

  const handleCopyConfig = (config: any) => {
    console.log("Copying configuration:", config);
    // Set up for creating a new config based on the copied one
    setEditingConfig({ ...config, name: `${config.name} (Copy)`, is_default: false });
    setSelectedYears([config.model_year_id]);
    setIsCreatingNew(true);
  };

  const handleDeleteConfig = (config: any) => {
    console.log("Deleting configuration:", config);
    // Implement delete logic
  };

  const handlePreviewConfig = (config: any) => {
    console.log("Previewing configuration:", config);
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

  const handleRefreshData = async () => {
    console.log("Manual refresh triggered for selected years:", selectedYears);
    if (selectedYears.length > 0) {
      await adminData.refreshConfigurations(selectedYears);
    } else if (adminData.selectedYear) {
      await adminData.refreshConfigurations([adminData.selectedYear]);
    }
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
                modelYearIds={selectedYears}
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
                    configurations={allConfigsForSelectedYears}
                    onCreateNew={handleCreateNew}
                    onEdit={handleEditConfig}
                    onCopy={handleCopyConfig}
                    onDelete={handleDeleteConfig}
                    onPreview={handlePreviewConfig}
                    onRefresh={handleRefreshData}
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
                      onConfigChange={() => adminData.refreshConfigurations()}
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
