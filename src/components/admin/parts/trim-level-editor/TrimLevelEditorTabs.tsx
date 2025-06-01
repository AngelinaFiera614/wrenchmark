
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoTab from "./BasicInfoTab";
import ComponentsTab from "./ComponentsTab";
import DimensionsTab from "./DimensionsTab";
import NotesTab from "./NotesTab";
import MetricsTab from "./MetricsTab";
import ColorManagementTab from "../colors/ColorManagementTab";

interface TrimLevelEditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onComponentSelect: (componentType: string, componentId: string, component: any) => void;
  metrics: any;
}

const TrimLevelEditorTabs = ({
  activeTab,
  onTabChange,
  formData,
  onInputChange,
  onComponentSelect,
  metrics
}: TrimLevelEditorTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <BasicInfoTab 
          formData={formData}
          onInputChange={onInputChange}
        />
      </TabsContent>

      <TabsContent value="components" className="space-y-4">
        <ComponentsTab
          formData={formData}
          onComponentSelect={onComponentSelect}
        />
      </TabsContent>

      <TabsContent value="dimensions" className="space-y-4">
        <DimensionsTab
          formData={formData}
          onInputChange={onInputChange}
        />
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        <NotesTab
          formData={formData}
          onInputChange={onInputChange}
        />
      </TabsContent>

      <TabsContent value="colors" className="space-y-4">
        <ColorManagementTab
          modelYearId={formData.model_year_id}
        />
      </TabsContent>

      <TabsContent value="metrics">
        <MetricsTab metrics={metrics} />
      </TabsContent>
    </Tabs>
  );
};

export default TrimLevelEditorTabs;
