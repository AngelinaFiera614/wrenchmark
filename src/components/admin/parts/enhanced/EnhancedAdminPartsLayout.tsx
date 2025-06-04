
import React from "react";
import HorizontalTrimManager from "./HorizontalTrimManager";
import AdminPartsLayoutHeader from "./layout/AdminPartsLayoutHeader";
import AdminPartsLayoutSidebar from "./layout/AdminPartsLayoutSidebar";
import AdminPartsLayoutMainContent from "./layout/AdminPartsLayoutMainContent";
import { useAdminPartsLayoutState } from "./layout/useAdminPartsLayoutState";
import { useAdminPartsLayoutActions } from "./layout/useAdminPartsLayoutActions";

const EnhancedAdminPartsLayout = () => {
  const {
    selectedYears,
    setSelectedYears,
    isCreatingNew,
    setIsCreatingNew,
    editingConfig,
    setEditingConfig,
    adminData,
    validation,
    allConfigsForSelectedYears
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
    handleCancelEdit
  } = useAdminPartsLayoutActions({
    selectedYears,
    setSelectedYears,
    setIsCreatingNew,
    setEditingConfig,
    adminData
  });

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text">
      <AdminPartsLayoutHeader onRunValidation={handleRunValidation} />

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <AdminPartsLayoutSidebar
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

          {isCreatingNew ? (
            <div className="xl:col-span-3">
              <HorizontalTrimManager
                modelYearIds={selectedYears}
                configuration={editingConfig}
                onSave={handleSaveConfig}
                onCancel={handleCancelEdit}
              />
            </div>
          ) : (
            <AdminPartsLayoutMainContent
              selectedModel={adminData.selectedModel}
              selectedYear={adminData.selectedYear}
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
              selectedConfig={adminData.selectedConfig}
              onConfigSelect={adminData.handleConfigSelect}
              refreshConfigurations={adminData.refreshConfigurations}
              validation={validation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminPartsLayout;
