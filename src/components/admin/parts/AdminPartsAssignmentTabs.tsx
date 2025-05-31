
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import ModelHierarchyNavigator from "./ModelHierarchyNavigator";
import TrimLevelManager from "./TrimLevelManager";
import ComponentLibrary from "./ComponentLibrary";

interface AdminPartsAssignmentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  models: MotorcycleModel[];
  modelYears: ModelYear[];
  configurations: Configuration[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  selectedConfigData?: Configuration;
  onModelSelect: (modelId: string) => void;
  onYearSelect: (yearId: string) => void;
  onConfigSelect: (configId: string) => void;
  onComponentLinked: () => void;
  refreshConfigurations: () => void;
  isLoading: boolean;
}

const AdminPartsAssignmentTabs = ({
  activeTab,
  setActiveTab,
  models,
  modelYears,
  configurations,
  selectedModel,
  selectedYear,
  selectedConfig,
  selectedConfigData,
  onModelSelect,
  onYearSelect,
  onConfigSelect,
  onComponentLinked,
  refreshConfigurations,
  isLoading
}: AdminPartsAssignmentTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="navigator">Model Navigator</TabsTrigger>
        <TabsTrigger value="trim-manager" disabled={!selectedYear}>
          Trim Level Manager
        </TabsTrigger>
        <TabsTrigger value="component-library">Component Library</TabsTrigger>
      </TabsList>

      <TabsContent value="navigator" className="space-y-6">
        <ModelHierarchyNavigator
          models={models}
          modelYears={modelYears}
          configurations={configurations}
          selectedModel={selectedModel}
          selectedYear={selectedYear}
          selectedConfig={selectedConfig}
          onModelSelect={onModelSelect}
          onYearSelect={onYearSelect}
          onConfigSelect={onConfigSelect}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="trim-manager" className="space-y-6">
        {selectedYear ? (
          <TrimLevelManager
            modelYearId={selectedYear}
            configurations={configurations}
            selectedConfig={selectedConfig}
            onConfigSelect={onConfigSelect}
            onConfigChange={refreshConfigurations}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-explorer-text-muted">
              Please select a model year to manage trim levels
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="component-library" className="space-y-6">
        <ComponentLibrary onComponentLinked={onComponentLinked} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminPartsAssignmentTabs;
