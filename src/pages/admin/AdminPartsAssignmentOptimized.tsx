
import React from "react";
import { useAdminPartsAssignment } from "@/hooks/useAdminPartsAssignment";
import AdminPartsAssignmentHeader from "@/components/admin/parts/AdminPartsAssignmentHeader";
import AdminPartsAssignmentTabs from "@/components/admin/parts/AdminPartsAssignmentTabs";
import ModelHierarchyNavigator from "@/components/admin/parts/ModelHierarchyNavigator";
import ComponentAssignmentGrid from "@/components/admin/parts/ComponentAssignmentGrid";
import TrimLevelManagerEnhanced from "@/components/admin/parts/TrimLevelManagerEnhanced";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import PinnedModelsPanel from "@/components/admin/parts/PinnedModelsPanel";

const AdminPartsAssignmentOptimized = () => {
  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    activeTab,
    showPreview,
    models,
    modelYears,
    configurations,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    modelsLoading,
    yearsLoading,
    configsLoading,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig,
    handleComponentLinked,
    refreshConfigurations,
    setActiveTab,
    setShowPreview,
  } = useAdminPartsAssignment();

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text">
      <AdminPartsAssignmentHeader 
        selectedConfig={selectedConfig}
        onPreviewConfig={handlePreviewConfig}
      />
      
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Pinned Models */}
          <div className="xl:col-span-1">
            <PinnedModelsPanel
              models={models || []}
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
            />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            <AdminPartsAssignmentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              models={models || []}
              modelYears={modelYears || []}
              configurations={configurations || []}
              selectedModel={selectedModel}
              selectedYear={selectedYear}
              selectedConfig={selectedConfig}
              selectedConfigData={selectedConfigData}
              onModelSelect={handleModelSelect}
              onYearSelect={handleYearSelect}
              onConfigSelect={handleConfigSelect}
              onComponentLinked={handleComponentLinked}
              refreshConfigurations={refreshConfigurations}
              isLoading={modelsLoading || yearsLoading || configsLoading}
            />

            <div className="space-y-6">
              {activeTab === "navigator" && (
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
              )}

              {activeTab === "components" && selectedModel && (
                <ComponentAssignmentGrid
                  selectedModel={selectedModel}
                  selectedModelData={selectedModelData}
                  onComponentLinked={handleComponentLinked}
                />
              )}

              {activeTab === "configurations" && selectedYear && (
                <TrimLevelManagerEnhanced
                  modelYearId={selectedYear}
                  configurations={configurations || []}
                  selectedConfig={selectedConfig}
                  onConfigSelect={handleConfigSelect}
                  onConfigChange={refreshConfigurations}
                />
              )}

              {showPreview && selectedConfigData && (
                <ConfigurationPreview
                  configuration={selectedConfigData}
                  selectedModelData={selectedModelData}
                  selectedYearData={selectedYearData}
                  onClose={() => setShowPreview(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPartsAssignmentOptimized;
