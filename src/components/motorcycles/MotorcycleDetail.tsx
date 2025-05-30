
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
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    console.log("MotorcycleDetail component mounted with motorcycle:", motorcycle.id, motorcycle.make, motorcycle.model);
    console.log("Is mobile view:", isMobile);
    document.title = `${motorcycle.make} ${motorcycle.model} | Wrenchmark`;
  }, [motorcycle, isMobile]);
  
  // For mobile view, we'll use accordion for better space utilization
  if (isMobile) {
    return (
      <div className="space-y-5 animate-in fade-in-0 duration-500 text-foreground">
        <MotorcycleHeader motorcycle={motorcycle} />
        <MotorcycleDetailCTA motorcycle={motorcycle} />
        
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
            <button 
              onClick={() => handleTabChange("components")}
              className={`mr-4 py-3 border-b-2 ${activeTab === 'components' 
                ? 'border-accent-teal text-accent-teal' 
                : 'border-transparent hover:border-border/70 text-muted-foreground hover:text-foreground'}`}
            >
              Components
            </button>
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

        {activeTab === 'components' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComponentDetailCard
              type="engine"
              title="Engine"
              data={{
                displacement_cc: motorcycle.engine_size,
                power_hp: motorcycle.horsepower,
                torque_nm: motorcycle.torque_nm,
                engine_type: 'Inline-4',
                cylinder_count: 4,
                cooling: motorcycle.cooling_system || 'Liquid',
                fuel_system: 'Fuel Injection',
                compression_ratio: '12.0:1'
              }}
            />
            <ComponentDetailCard
              type="brake"
              title="Brake System"
              data={{
                type: 'Dual Disc',
                brake_type_front: 'Disc',
                brake_type_rear: 'Disc',
                front_disc_size_mm: 320,
                rear_disc_size_mm: 220,
                brake_brand: 'Brembo',
                has_traction_control: motorcycle.abs || false
              }}
            />
            <ComponentDetailCard
              type="frame"
              title="Frame"
              data={{
                type: 'Aluminum Beam',
                material: 'Aluminum',
                construction_method: 'Twin Spar',
                rake_degrees: 24.5,
                trail_mm: 95
              }}
            />
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
