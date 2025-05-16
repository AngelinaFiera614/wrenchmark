
import { Motorcycle } from "@/types";
import { MotorcycleHeader } from "./MotorcycleHeader";
import { PerformanceSpecifications } from "./PerformanceSpecifications";
import { PhysicalDimensions } from "./PhysicalDimensions";
import { FeaturesList } from "./FeaturesList";
import { MaintenanceLogs } from "./MaintenanceLogs";
import { SafetyNotesSection } from "./SafetyNotesSection";
import { MotorcycleDetailCTA } from "./MotorcycleDetailCTA";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MotorcycleDetailProps {
  motorcycle: Motorcycle;
}

export default function MotorcycleDetail({ motorcycle }: MotorcycleDetailProps) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    // Debug log to confirm component mounted with motorcycle data
    console.log("MotorcycleDetail component mounted with motorcycle:", motorcycle);
    console.log("Is mobile view:", isMobile);
  }, [motorcycle, isMobile]);
  
  // For mobile view, we'll use accordion for better space utilization
  if (isMobile) {
    return (
      <div className="space-y-5 animate-in fade-in-0 duration-500">
        {/* Header Section with Image and Overview */}
        <MotorcycleHeader motorcycle={motorcycle} />
        
        {/* Sticky CTA Row */}
        <MotorcycleDetailCTA motorcycle={motorcycle} />
        
        {/* Accordion Sections for Mobile */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="performance" className="border-border/30">
            <AccordionTrigger className="text-foreground hover:text-accent-teal">
              Performance Specifications
            </AccordionTrigger>
            <AccordionContent>
              <PerformanceSpecifications motorcycle={motorcycle} />
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
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header Section with Image and Overview */}
      <MotorcycleHeader motorcycle={motorcycle} />
      
      {/* Sticky CTA Row */}
      <MotorcycleDetailCTA motorcycle={motorcycle} />
      
      {/* Specifications Sections */}
      <PerformanceSpecifications motorcycle={motorcycle} />
      
      {/* Physical Dimensions Section */}
      <PhysicalDimensions motorcycle={motorcycle} />
      
      {/* Safety Notes Section */}
      <SafetyNotesSection motorcycle={motorcycle} />
      
      {/* Features and Smart Features Sections */}
      <FeaturesList motorcycle={motorcycle} />
      
      {/* Maintenance Section */}
      <MaintenanceLogs />
    </div>
  );
}
