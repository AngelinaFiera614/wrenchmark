
import { Motorcycle } from "@/types";
import { MotorcycleHeader } from "./MotorcycleHeader";
import { MotorcycleDetailCTA } from "./MotorcycleDetailCTA";
import ConfigurationSelector from "./ConfigurationSelector";
import { MotorcycleDetailTabs } from "./detail/MotorcycleDetailTabs";
import { MotorcycleDetailTabContent } from "./detail/MotorcycleDetailTabContent";
import { MotorcycleDetailMobile } from "./detail/MotorcycleDetailMobile";
import { useMotorcycleDetailData } from "./detail/useMotorcycleDetailData";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MotorcycleDetailProps {
  motorcycle: Motorcycle;
}

const MotorcycleDetail = ({ motorcycle }: MotorcycleDetailProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("specifications");
  
  const {
    selectedConfiguration,
    handleConfigurationSelect,
    componentData,
    hasComponentData,
    configurations
  } = useMotorcycleDetailData(motorcycle);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // For mobile view, we'll use accordion for better space utilization
  if (isMobile) {
    return (
      <div className="space-y-5 animate-in fade-in-0 duration-500 text-foreground">
        <MotorcycleHeader motorcycle={motorcycle} />
        <MotorcycleDetailCTA motorcycle={motorcycle} />
        
        {configurations.length > 0 && (
          <ConfigurationSelector
            configurations={configurations}
            selectedConfigId={selectedConfiguration?.id}
            onConfigurationSelect={handleConfigurationSelect}
          />
        )}
        
        <MotorcycleDetailMobile
          motorcycle={motorcycle}
          hasComponentData={hasComponentData}
          componentData={componentData}
          selectedConfiguration={selectedConfiguration}
        />
      </div>
    );
  }
  
  // Desktop view with regular cards
  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 text-foreground">
      <MotorcycleHeader motorcycle={motorcycle} />
      <MotorcycleDetailCTA motorcycle={motorcycle} />
      
      {configurations.length > 0 && (
        <ConfigurationSelector
          configurations={configurations}
          selectedConfigId={selectedConfiguration?.id}
          onConfigurationSelect={handleConfigurationSelect}
        />
      )}
      
      <div>
        <MotorcycleDetailTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasComponentData={hasComponentData}
          selectedConfigurationName={selectedConfiguration?.name}
        />

        <MotorcycleDetailTabContent
          activeTab={activeTab}
          motorcycle={motorcycle}
          hasComponentData={hasComponentData}
          componentData={componentData}
          selectedConfiguration={selectedConfiguration}
        />
      </div>
    </div>
  );
};

export default MotorcycleDetail;
