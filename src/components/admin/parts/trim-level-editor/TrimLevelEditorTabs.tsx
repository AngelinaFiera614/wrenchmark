
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoTab from "./BasicInfoTab";
import ComponentsTab from "./ComponentsTab";
import DimensionsTab from "./DimensionsTab";
import MetricsTab from "./MetricsTab";
import NotesTab from "./NotesTab";
import CollapsibleSection from "./CollapsibleSection";
import { ValidationResult } from "./validationEnhanced";

interface TrimLevelEditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onComponentSelect: (componentType: string, componentId: string, component: any) => void;
  metrics: any;
  validation?: ValidationResult;
  existingDefault?: any;
}

const TrimLevelEditorTabs = ({
  activeTab,
  onTabChange,
  formData,
  onInputChange,
  onComponentSelect,
  metrics,
  validation,
  existingDefault
}: TrimLevelEditorTabsProps) => {
  
  const getSectionSummary = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        const basicItems = [];
        if (formData.name) basicItems.push(`Name: ${formData.name}`);
        if (formData.msrp_usd) basicItems.push(`MSRP: $${formData.msrp_usd}`);
        if (formData.market_region) basicItems.push(`Region: ${formData.market_region}`);
        return basicItems.length > 0 ? basicItems.join(', ') : 'No basic information provided';
        
      case 'components':
        const components = [];
        if (formData.engine_id) components.push('Engine');
        if (formData.brake_system_id) components.push('Brakes');
        if (formData.frame_id) components.push('Frame');
        if (formData.suspension_id) components.push('Suspension');
        if (formData.wheel_id) components.push('Wheels');
        return components.length > 0 ? `${components.join(', ')} assigned` : 'No components assigned';
        
      case 'dimensions':
        const dimensions = [];
        if (formData.seat_height_mm) dimensions.push(`Seat: ${formData.seat_height_mm}mm`);
        if (formData.weight_kg) dimensions.push(`Weight: ${formData.weight_kg}kg`);
        if (formData.wheelbase_mm) dimensions.push(`Wheelbase: ${formData.wheelbase_mm}mm`);
        return dimensions.length > 0 ? dimensions.join(', ') : 'No dimensions provided';
        
      case 'metrics':
        return 'Performance calculations and ratios';
        
      case 'notes':
        return 'Additional notes and comments';
        
      default:
        return 'Section content';
    }
  };

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

      <div className="mt-6 space-y-4">
        <TabsContent value="basic" className="m-0">
          <CollapsibleSection
            title="Basic Information"
            status={validation?.sectionStatus?.basic || 'missing'}
            summary={getSectionSummary('basic')}
            defaultOpen={true}
          >
            <BasicInfoTab 
              formData={formData} 
              onInputChange={onInputChange}
              existingDefault={existingDefault}
            />
          </CollapsibleSection>
        </TabsContent>
        
        <TabsContent value="components" className="m-0">
          <CollapsibleSection
            title="Component Assignment"
            status={validation?.sectionStatus?.components || 'missing'}
            summary={getSectionSummary('components')}
            defaultOpen={true}
          >
            <ComponentsTab 
              formData={formData} 
              onComponentSelect={onComponentSelect}
            />
          </CollapsibleSection>
        </TabsContent>
        
        <TabsContent value="dimensions" className="m-0">
          <CollapsibleSection
            title="Physical Dimensions"
            status={validation?.sectionStatus?.dimensions || 'missing'}
            summary={getSectionSummary('dimensions')}
            defaultOpen={true}
          >
            <DimensionsTab 
              formData={formData} 
              onInputChange={onInputChange}
            />
          </CollapsibleSection>
        </TabsContent>
        
        <TabsContent value="metrics" className="m-0">
          <CollapsibleSection
            title="Performance Metrics"
            status={validation?.sectionStatus?.metrics || 'complete'}
            summary={getSectionSummary('metrics')}
            defaultOpen={true}
          >
            <MetricsTab metrics={metrics} />
          </CollapsibleSection>
        </TabsContent>
        
        <TabsContent value="notes" className="m-0">
          <CollapsibleSection
            title="Notes & Comments"
            status={validation?.sectionStatus?.notes || 'complete'}
            summary={getSectionSummary('notes')}
            defaultOpen={true}
          >
            <NotesTab 
              formData={formData} 
              onInputChange={onInputChange}
            />
          </CollapsibleSection>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default TrimLevelEditorTabs;
