
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import ModelHierarchyNavigator from "@/components/admin/parts/ModelHierarchyNavigator";
import ConfigurationManager from "@/components/admin/parts/ConfigurationManager";
import ComponentLibrary from "@/components/admin/parts/ComponentLibrary";

interface AdminPartsAssignmentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  models: any[];
  modelYears: any[];
  configurations: any[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  selectedConfigData: any;
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="navigator">Model Navigator</TabsTrigger>
        <TabsTrigger value="configurations" disabled={!selectedYear}>
          Configurations
        </TabsTrigger>
        <TabsTrigger value="components">Component Library</TabsTrigger>
        <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
      </TabsList>

      <TabsContent value="navigator" className="space-y-4">
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

      <TabsContent value="configurations" className="space-y-4">
        {selectedYear && (
          <ConfigurationManager
            modelYearId={selectedYear}
            configurations={configurations}
            selectedConfig={selectedConfig}
            onConfigSelect={onConfigSelect}
            onConfigChange={refreshConfigurations}
          />
        )}
      </TabsContent>

      <TabsContent value="components" className="space-y-4">
        <ComponentLibrary 
          selectedConfiguration={selectedConfigData}
          onComponentLinked={onComponentLinked}
        />
      </TabsContent>

      <TabsContent value="bulk" className="space-y-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Bulk Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Settings className="mx-auto h-12 w-12 text-explorer-text-muted mb-4" />
              <p className="text-explorer-text-muted">
                Bulk operations will be implemented here
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminPartsAssignmentTabs;
