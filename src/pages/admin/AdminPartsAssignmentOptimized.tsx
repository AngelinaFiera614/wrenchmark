
import React from "react";
import AdminPartsAssignmentHeader from "@/components/admin/parts/AdminPartsAssignmentHeader";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import ModelNavigatorSection from "@/components/admin/parts/enhanced/ModelNavigatorSection";
import YearsSection from "@/components/admin/parts/enhanced/YearsSection";
import TrimSection from "@/components/admin/parts/enhanced/TrimSection";
import ComponentsSection from "@/components/admin/parts/enhanced/ComponentsSection";
import TrimLevelEditor from "@/components/admin/parts/TrimLevelEditor";
import { useAdminPartsAssignmentOptimized } from "@/hooks/useAdminPartsAssignmentOptimized";

const AdminPartsAssignmentOptimized = () => {
  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    showPreview,
    isEditingTrim,
    editingTrimConfig,
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
    handleYearDelete,
    handleAddTrim,
    handleCloseTrimEditor,
    handleSaveTrim,
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
        onYearDelete={handleYearDelete}
        isLoading={isLoading}
      />

      {/* Trim Section */}
      <TrimSection
        configurations={configurations || []}
        selectedYear={selectedYear}
        selectedConfig={selectedConfig}
        onConfigSelect={handleConfigSelect}
        onConfigChange={refreshConfigurations}
        onAddTrim={handleAddTrim}
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

      {/* Trim Level Editor Modal */}
      {isEditingTrim && selectedYear && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TrimLevelEditor
              modelYearId={selectedYear}
              configuration={editingTrimConfig}
              onSave={handleSaveTrim}
              onCancel={handleCloseTrimEditor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartsAssignmentOptimized;
