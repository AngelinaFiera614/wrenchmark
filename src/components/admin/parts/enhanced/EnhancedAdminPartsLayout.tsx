
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AdminPartsLayoutHeader from "./layout/AdminPartsLayoutHeader";
import AdminPartsLayoutSidebar from "./layout/AdminPartsLayoutSidebar";
import AdminPartsLayoutMainContent from "./layout/AdminPartsLayoutMainContent";
import HorizontalTrimManager from "./HorizontalTrimManager";
import { useAdminPartsLayoutState } from "./layout/useAdminPartsLayoutState";
import { useAdminPartsLayoutActions } from "./layout/useAdminPartsLayoutActions";

const EnhancedAdminPartsLayout = () => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);

  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    selectedYears,
    setSelectedYears,
    adminData,
    allConfigsForSelectedYears,
    validation
  } = useAdminPartsLayoutState();

  const {
    handleRunValidation,
    handleYearToggle,
    handleSelectAllYears,
    handleClearAllYears,
    handleCreateNew,
    handleEditConfig,
    handleCopyConfig,
    handleDeleteConfig,
    handlePreviewConfig,
    handleManageComponents,
    handleBulkAssign,
    handleRefreshData,
    handleSaveConfig,
    handleCancelEdit,
    // Copy dialog state
    copyDialogOpen,
    copySourceConfig,
    handleCopyDialogClose,
    handleCopySuccess
  } = useAdminPartsLayoutActions({
    selectedYears,
    setSelectedYears,
    setIsCreatingNew,
    setEditingConfig,
    adminData
  });

  if (isCreatingNew) {
    return (
      <div className="space-y-6">
        <HorizontalTrimManager
          modelYearIds={selectedYears}
          configuration={editingConfig}
          onSave={handleSaveConfig}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPartsLayoutHeader
        selectedModel={selectedModel}
        selectedYear={selectedYear}
        selectedConfig={selectedConfig}
        onRunValidation={handleRunValidation}
        validation={validation}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <AdminPartsLayoutSidebar
          selectedModel={selectedModel}
          selectedYear={selectedYear}
          selectedConfig={selectedConfig}
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

        <AdminPartsLayoutMainContent
          selectedModel={selectedModel}
          selectedYear={selectedYear}
          selectedYears={selectedYears}
          modelYears={adminData.modelYears}
          allConfigsForSelectedYears={allConfigsForSelectedYears}
          onYearToggle={handleYearToggle}
          onSelectAllYears={handleSelectAllYears}
          onClearAllYears={handleClearAllYears}
          onCreateNew={handleCreateNew}
          onEditConfig={handleEditConfig}
          onCopyConfig={handleCopyConfig}
          onDeleteConfig={handleDeleteConfig}
          onPreviewConfig={handlePreviewConfig}
          onRefreshData={handleRefreshData}
          onManageComponents={handleManageComponents}
          onBulkAssign={handleBulkAssign}
          configurations={adminData.configurations}
          selectedConfig={selectedConfig}
          onConfigSelect={adminData.handleConfigSelect}
          refreshConfigurations={adminData.refreshConfigurations}
          validation={validation}
          copyDialogOpen={copyDialogOpen}
          copySourceConfig={copySourceConfig}
          onCopyDialogClose={handleCopyDialogClose}
          onCopySuccess={handleCopySuccess}
        />
      </div>
    </div>
  );
};

export default EnhancedAdminPartsLayout;
