
import React from "react";
import AdminPartsAssignmentHeader from "@/components/admin/parts/AdminPartsAssignmentHeader";
import AdminPartsAssignmentTabs from "@/components/admin/parts/AdminPartsAssignmentTabs";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import EnhancedTrimLevelManagerPhase2 from "@/components/admin/parts/enhanced/EnhancedTrimLevelManagerPhase2";
import { useAdminPartsAssignment } from "@/hooks/useAdminPartsAssignment";

const AdminPartsAssignmentEnhanced = () => {
  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    activeTab,
    showPreview,
    setActiveTab,
    setShowPreview,
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
  } = useAdminPartsAssignment();

  const isLoading = modelsLoading || yearsLoading || configsLoading;

  return (
    <div className="space-y-6">
      <AdminPartsAssignmentHeader 
        selectedConfig={selectedConfig}
        onPreviewConfig={handlePreviewConfig}
      />

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
        isLoading={isLoading}
      />

      {/* Enhanced Phase 2 Manager - Only show when we have a year selected */}
      {selectedYear && (
        <EnhancedTrimLevelManagerPhase2
          modelYearId={selectedYear}
          configurations={configurations || []}
          selectedConfig={selectedConfig}
          selectedModelData={selectedModelData}
          selectedYearData={selectedYearData}
          selectedConfigData={selectedConfigData}
          onConfigSelect={handleConfigSelect}
          onConfigChange={refreshConfigurations}
        />
      )}

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

export default AdminPartsAssignmentEnhanced;
