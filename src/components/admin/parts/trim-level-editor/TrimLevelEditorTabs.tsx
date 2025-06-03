
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoTab from "./BasicInfoTab";
import ComponentsTab from "./ComponentsTab";
import DimensionsTab from "./DimensionsTab";
import MetricsTab from "./MetricsTab";
import NotesTab from "./NotesTab";

interface TrimLevelEditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onComponentSelect: (componentType: string, componentId: string, component: any) => void;
  metrics: any;
  existingDefault?: any;
}

const TrimLevelEditorTabs = ({
  activeTab,
  onTabChange,
  formData,
  onInputChange,
  onComponentSelect,
  metrics,
  existingDefault
}: TrimLevelEditorTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-explorer-dark border-explorer-chrome/30">
        <TabsTrigger 
          value="basic" 
          className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
        >
          Basic Info
        </TabsTrigger>
        <TabsTrigger 
          value="components" 
          className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
        >
          Components
        </TabsTrigger>
        <TabsTrigger 
          value="dimensions" 
          className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
        >
          Dimensions
        </TabsTrigger>
        <TabsTrigger 
          value="metrics" 
          className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
        >
          Metrics
        </TabsTrigger>
        <TabsTrigger 
          value="notes" 
          className="data-[state=active]:bg-accent-teal data-[state=active]:text-black"
        >
          Notes
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="basic" className="space-y-4">
          <BasicInfoTab 
            formData={formData} 
            onInputChange={onInputChange}
            existingDefault={existingDefault}
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
        
        <TabsContent value="metrics" className="space-y-4">
          <MetricsTab metrics={metrics} />
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <NotesTab 
            formData={formData} 
            onInputChange={onInputChange}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default TrimLevelEditorTabs;
