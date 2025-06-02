
import { Motorcycle } from "@/types";
import { MotorcycleHeader } from "./MotorcycleHeader";
import { PerformanceSpecifications } from "./PerformanceSpecifications";
import { PhysicalDimensions } from "./PhysicalDimensions";
import { FeaturesList } from "./FeaturesList";
import { MaintenanceLogs } from "./MaintenanceLogs";
import { SafetyNotesSection } from "./SafetyNotesSection";
import { MotorcycleDetailCTA } from "./MotorcycleDetailCTA";
import { InteractiveSpecificationDisplay } from "./content";
import { RelatedModelsSystem } from "./related";
import { ComponentDetailCard } from "./components";
import ConfigurationSelector from "./ConfigurationSelector";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Configuration } from "@/types/motorcycle";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ManualsList from "./ManualsList";

interface MotorcycleDetailProps {
  motorcycle: Motorcycle;
}

const MotorcycleDetail = ({ motorcycle }: { motorcycle: Motorcycle }) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedConfiguration, setSelectedConfiguration] = useState<Configuration | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleConfigurationSelect = (config: Configuration) => {
    console.log("Selected configuration:", config);
    setSelectedConfiguration(config);
  };

  useEffect(() => {
    console.log("MotorcycleDetail component mounted with motorcycle:", motorcycle.id, motorcycle.make, motorcycle.model);
    console.log("Component data available:", motorcycle._componentData);
    console.log("Is mobile view:", isMobile);
    
    // Auto-select default configuration or first available
    const configurations = motorcycle._componentData?.configurations || [];
    if (configurations.length > 0 && !selectedConfiguration) {
      const defaultConfig = configurations.find(c => c.is_default) || configurations[0];
      setSelectedConfiguration(defaultConfig);
      console.log("Auto-selected configuration:", defaultConfig);
    }
    
    document.title = `${motorcycle.make} ${motorcycle.model} | Wrenchmark`;
  }, [motorcycle, isMobile]);

  // Get component data from the selected configuration or fallback to motorcycle data
  const componentData = selectedConfiguration ? {
    engine: selectedConfiguration.engines || selectedConfiguration.engine,
    brakes: selectedConfiguration.brake_systems || selectedConfiguration.brakes,
    frame: selectedConfiguration.frames || selectedConfiguration.frame,
    suspension: selectedConfiguration.suspensions || selectedConfiguration.suspension,
    wheels: selectedConfiguration.wheels,
    configurations: motorcycle._componentData?.configurations || []
  } : motorcycle._componentData;

  const hasComponentData = componentData && (
    componentData.engine || 
    componentData.brakes || 
    componentData.frame || 
    componentData.suspension || 
    componentData.wheels
  );

  // Get configurations for the selector
  const configurations = motorcycle._componentData?.configurations || [];
  
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
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="performance" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Performance Specifications
            </AccordionTrigger>
            <AccordionContent>
              <PerformanceSpecifications motorcycle={motorcycle} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="interactive-specs" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Interactive Specifications
            </AccordionTrigger>
            <AccordionContent>
              <InteractiveSpecificationDisplay motorcycle={motorcycle} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="dimensions" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Physical Dimensions
            </AccordionTrigger>
            <AccordionContent>
              <PhysicalDimensions motorcycle={motorcycle} />
            </AccordionContent>
          </AccordionItem>
          
          {hasComponentData && (
            <AccordionItem value="components" className="border-border/30">
              <AccordionTrigger className="text-foreground hover:text-accent-teal">
                Components & Systems
                {selectedConfiguration && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({selectedConfiguration.name || 'Configuration'})
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {componentData?.engine && (
                    <ComponentDetailCard
                      type="engine"
                      title="Engine"
                      data={componentData.engine}
                    />
                  )}
                  {componentData?.brakes && (
                    <ComponentDetailCard
                      type="brake"
                      title="Brake System"
                      data={componentData.brakes}
                    />
                  )}
                  {componentData?.frame && (
                    <ComponentDetailCard
                      type="frame"
                      title="Frame"
                      data={componentData.frame}
                    />
                  )}
                  {componentData?.suspension && (
                    <ComponentDetailCard
                      type="suspension"
                      title="Suspension"
                      data={componentData.suspension}
                    />
                  )}
                  {componentData?.wheels && (
                    <ComponentDetailCard
                      type="wheel"
                      title="Wheels"
                      data={componentData.wheels}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          <AccordionItem value="safety" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Safety Features
            </AccordionTrigger>
            <AccordionContent>
              <SafetyNotesSection motorcycle={motorcycle} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="features" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Features & Smart Features
            </AccordionTrigger>
            <AccordionContent>
              <FeaturesList motorcycle={motorcycle} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="related" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Related Models
            </AccordionTrigger>
            <AccordionContent>
              <RelatedModelsSystem currentMotorcycle={motorcycle} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="maintenance" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Maintenance Logs
            </AccordionTrigger>
            <AccordionContent>
              <MaintenanceLogs />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
        <div className="border-b border-border/40 mb-6">
          <div className="flex flex-wrap -mb-px text-sm font-medium">
            <button 
              onClick={() => handleTabChange("specifications")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'specifications' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Specifications
            </button>
            <button 
              onClick={() => handleTabChange("interactive")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'interactive' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Interactive Specs
            </button>
            {hasComponentData && (
              <button 
                onClick={() => handleTabChange("components")}
                className={`mr-4 py-3 border-b-2 ${activeTab === 'components' 
                  ? 'border-accent-teal text-accent-teal' 
                  : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
              >
                Components
                {selectedConfiguration && (
                  <span className="ml-1 text-xs opacity-75">
                    ({selectedConfiguration.name || 'Config'})
                  </span>
                )}
              </button>
            )}
            <button 
              onClick={() => handleTabChange("features")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'features' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Features
            </button>
            <button 
              onClick={() => handleTabChange("related")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'related' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Related Models
            </button>
            <button 
              onClick={() => handleTabChange("safety")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'safety' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Safety
            </button>
            <button 
              onClick={() => handleTabChange("manuals")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'manuals' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Manuals
            </button>
          </div>
        </div>

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceSpecifications motorcycle={motorcycle} />
            <PhysicalDimensions motorcycle={motorcycle} />
          </div>
        )}

        {activeTab === 'interactive' && (
          <InteractiveSpecificationDisplay motorcycle={motorcycle} />
        )}

        {activeTab === 'components' && hasComponentData && (
          <div className="space-y-4">
            {selectedConfiguration && (
              <div className="mb-4 p-4 bg-card border border-border rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedConfiguration.name || `Configuration ${selectedConfiguration.id.slice(0, 8)}`}
                </h3>
                {selectedConfiguration.description && (
                  <p className="text-muted-foreground">{selectedConfiguration.description}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {componentData?.engine && (
                <ComponentDetailCard
                  type="engine"
                  title="Engine"
                  data={componentData.engine}
                />
              )}
              {componentData?.brakes && (
                <ComponentDetailCard
                  type="brake"
                  title="Brake System"
                  data={componentData.brakes}
                />
              )}
              {componentData?.frame && (
                <ComponentDetailCard
                  type="frame"
                  title="Frame"
                  data={componentData.frame}
                />
              )}
              {componentData?.suspension && (
                <ComponentDetailCard
                  type="suspension"
                  title="Suspension"
                  data={componentData.suspension}
                />
              )}
              {componentData?.wheels && (
                <ComponentDetailCard
                  type="wheel"
                  title="Wheels"
                  data={componentData.wheels}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <FeaturesList motorcycle={motorcycle} />
        )}

        {activeTab === 'related' && (
          <RelatedModelsSystem currentMotorcycle={motorcycle} />
        )}

        {activeTab === 'safety' && (
          <SafetyNotesSection motorcycle={motorcycle} />
        )}

        {activeTab === 'manuals' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">Manuals & Documentation</h2>
            <ManualsList motorcycleId={motorcycle.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MotorcycleDetail;
