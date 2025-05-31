
import React from "react";
import AdminPartsAssignmentHeader from "@/components/admin/parts/AdminPartsAssignmentHeader";
import ConfigurationBreadcrumb from "@/components/admin/parts/ConfigurationBreadcrumb";
import AdminPartsAssignmentTabs from "@/components/admin/parts/AdminPartsAssignmentTabs";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import { useAdminPartsAssignment } from "@/hooks/useAdminPartsAssignment";

const AdminPartsAssignment = () => {
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

      <ConfigurationBreadcrumb 
        selectedModelData={selectedModelData}
        selectedYearData={selectedYearData}
        selectedConfigData={selectedConfigData}
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
