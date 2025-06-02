
import React from "react";
import { Motorcycle } from "@/types";
import { Configuration } from "@/types/motorcycle";
import { PerformanceSpecifications } from "../PerformanceSpecifications";
import { PhysicalDimensions } from "../PhysicalDimensions";
import { FeaturesList } from "../FeaturesList";
import { SafetyNotesSection } from "../SafetyNotesSection";
import { MaintenanceLogs } from "../MaintenanceLogs";
import { InteractiveSpecificationDisplay } from "../content";
import { RelatedModelsSystem } from "../related";
import { ComponentDetailCard } from "../components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MotorcycleDetailMobileProps {
  motorcycle: Motorcycle;
  hasComponentData: boolean;
  componentData: any;
  selectedConfiguration: Configuration | null;
}

export function MotorcycleDetailMobile({
  motorcycle,
  hasComponentData,
  componentData,
  selectedConfiguration
}: MotorcycleDetailMobileProps) {
  return (
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
  );
}
