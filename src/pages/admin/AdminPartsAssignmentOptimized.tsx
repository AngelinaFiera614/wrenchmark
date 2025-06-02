
import React from "react";
import AdminPartsAssignmentHeader from "@/components/admin/parts/AdminPartsAssignmentHeader";
import ConfigurationPreview from "@/components/admin/parts/ConfigurationPreview";
import OptimizedNavigationColumn from "@/components/admin/parts/enhanced/OptimizedNavigationColumn";
import DataGenerationPanel from "@/components/admin/parts/enhanced/DataGenerationPanel";
import TrimLevelManagerEnhanced from "@/components/admin/parts/TrimLevelManagerEnhanced";
import DataHealthDashboard from "@/components/admin/parts/DataHealthDashboard";
import { useAdminPartsAssignmentOptimized } from "@/hooks/useAdminPartsAssignmentOptimized";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPartsAssignmentOptimized = () => {
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
    isLoading,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    handlePreviewConfig,
    handleComponentLinked,
    refreshConfigurations,
  } = useAdminPartsAssignmentOptimized();

  return (
    <div className="space-y-6">
      <AdminPartsAssignmentHeader 
        selectedConfig={selectedConfig}
        onPreviewConfig={handlePreviewConfig}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health-check">Data Health</TabsTrigger>
          <TabsTrigger value="navigator">Navigator</TabsTrigger>
          <TabsTrigger value="data-generation">Data Generation</TabsTrigger>
          <TabsTrigger value="trim-manager">Trim Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="health-check" className="space-y-6">
          <DataHealthDashboard />
        </TabsContent>

        <TabsContent value="navigator" className="space-y-6">
          <OptimizedNavigationColumn
            models={models || []}
            modelYears={modelYears || []}
            configurations={configurations || []}
            selectedModel={selectedModel}
            selectedYear={selectedYear}
            selectedConfig={selectedConfig}
            onModelSelect={handleModelSelect}
            onYearSelect={handleYearSelect}
            onConfigSelect={handleConfigSelect}
            isLoading={isLoading}
            onRefresh={refreshConfigurations}
          />
        </TabsContent>

        <TabsContent value="data-generation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimizedNavigationColumn
              models={models || []}
              modelYears={modelYears || []}
              configurations={configurations || []}
              selectedModel={selectedModel}
              selectedYear={selectedYear}
              selectedConfig={selectedConfig}
              onModelSelect={handleModelSelect}
              onYearSelect={handleYearSelect}
              onConfigSelect={handleConfigSelect}
              isLoading={isLoading}
              onRefresh={refreshConfigurations}
            />
            
            <DataGenerationPanel
              selectedModel={selectedModelData}
              modelYears={modelYears || []}
              onDataGenerated={refreshConfigurations}
            />
          </div>
        </TabsContent>

        <TabsContent value="trim-manager" className="space-y-6">
          {selectedYear ? (
            <TrimLevelManagerEnhanced
              modelYearId={selectedYear}
              configurations={configurations || []}
              selectedConfig={selectedConfig}
              onConfigSelect={handleConfigSelect}
              onConfigChange={refreshConfigurations}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-explorer-text-muted">
                Select a model year to manage trim levels
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
