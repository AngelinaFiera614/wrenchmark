
import React from "react";
import AdminPartsAssignmentHeader from "@/components/admin/parts/AdminPartsAssignmentHeader";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import ModelNavigatorSection from "@/components/admin/parts/enhanced/ModelNavigatorSection";
import YearsSection from "@/components/admin/parts/enhanced/YearsSection";
import TrimSection from "@/components/admin/parts/enhanced/TrimSection";
import ComponentsSection from "@/components/admin/parts/enhanced/ComponentsSection";
import { useAdminPartsAssignmentOptimized } from "@/hooks/useAdminPartsAssignmentOptimized";

const AdminPartsAssignmentOptimized = () => {
  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    showPreview,
    setShowPreview,
    models,
    modelYears,
    configurations,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    isLoading,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig,
    refreshConfigurations,
  } = useAdminPartsAssignmentOptimized();

  return (
    <div className="space-y-6">
      <AdminPartsAssignmentHeader 
        selectedConfig={selectedConfig}
        onPreviewConfig={handlePreviewConfig}
      />

      {/* Model Navigator Section - Teal Outlined, Full Width */}
      <ModelNavigatorSection
        models={models || []}
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        isLoading={isLoading}
      />

      {/* Years Section */}
      <YearsSection
        modelYears={modelYears || []}
        selectedModel={selectedModel}
        selectedYear={selectedYear}
        selectedModelData={selectedModelData}
        onYearSelect={handleYearSelect}
        isLoading={isLoading}
      />

      {/* Trim Section */}
      <TrimSection
        configurations={configurations || []}
        selectedYear={selectedYear}
        selectedConfig={selectedConfig}
        onConfigSelect={handleConfigSelect}
        onConfigChange={refreshConfigurations}
      />

      {/* Components Section */}
      <ComponentsSection
        selectedConfig={selectedConfigData}
        onRefresh={refreshConfigurations}
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

export default AdminPartsAssignmentOptimized;
