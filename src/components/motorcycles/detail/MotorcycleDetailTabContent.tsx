
import React from "react";
import { Motorcycle } from "@/types";
import { PerformanceSpecifications } from "../PerformanceSpecifications";
import { PhysicalDimensions } from "../PhysicalDimensions";
import { FeaturesList } from "../FeaturesList";
import { SafetyNotesSection } from "../SafetyNotesSection";
import { InteractiveSpecificationDisplay } from "../content";
import { RelatedModelsSystem } from "../related";
import { ComponentDetailCard } from "../components";
import ManualsList from "../ManualsList";

interface MotorcycleDetailTabContentProps {
  activeTab: string;
  motorcycle: Motorcycle;
  hasComponentData: boolean;
  componentData: any;
  selectedConfiguration: any;
}

export function MotorcycleDetailTabContent({
  activeTab,
  motorcycle,
  hasComponentData,
  componentData,
  selectedConfiguration
}: MotorcycleDetailTabContentProps) {
  console.log("MotorcycleDetailTabContent render:", {
    activeTab,
    hasComponentData,
    selectedConfiguration: selectedConfiguration?.id,
    componentKeys: selectedConfiguration ? Object.keys(selectedConfiguration) : []
  });

  switch (activeTab) {
    case 'specifications':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceSpecifications 
            motorcycle={motorcycle} 
            selectedConfiguration={selectedConfiguration}
          />
          <PhysicalDimensions 
            motorcycle={motorcycle} 
            selectedConfiguration={selectedConfiguration}
          />
        </div>
      );

    case 'interactive':
      return <InteractiveSpecificationDisplay motorcycle={motorcycle} />;

    case 'components':
      if (!hasComponentData) {
        console.log("No component data available for components tab");
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Component data is not available for this motorcycle configuration.</p>
            <p className="text-sm mt-2">This could mean the components haven't been assigned to this model yet.</p>
          </div>
        );
      }
      
      console.log("Rendering components tab with data:", {
        engines: selectedConfiguration?.engines || selectedConfiguration?.engine,
        brake_systems: selectedConfiguration?.brake_systems || selectedConfiguration?.brakes,
        frames: selectedConfiguration?.frames || selectedConfiguration?.frame,
        suspensions: selectedConfiguration?.suspensions || selectedConfiguration?.suspension,
        wheels: selectedConfiguration?.wheels || selectedConfiguration?.wheel
      });

      return (
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
            {(selectedConfiguration?.engines || selectedConfiguration?.engine) && (
              <ComponentDetailCard
                type="engine"
                title="Engine"
                data={selectedConfiguration.engines || selectedConfiguration.engine}
              />
            )}
            {(selectedConfiguration?.brake_systems || selectedConfiguration?.brakes) && (
              <ComponentDetailCard
                type="brake"
                title="Brake System"
                data={selectedConfiguration.brake_systems || selectedConfiguration.brakes}
              />
            )}
            {(selectedConfiguration?.frames || selectedConfiguration?.frame) && (
              <ComponentDetailCard
                type="frame"
                title="Frame"
                data={selectedConfiguration.frames || selectedConfiguration.frame}
              />
            )}
            {(selectedConfiguration?.suspensions || selectedConfiguration?.suspension) && (
              <ComponentDetailCard
                type="suspension"
                title="Suspension"
                data={selectedConfiguration.suspensions || selectedConfiguration.suspension}
              />
            )}
            {(selectedConfiguration?.wheels || selectedConfiguration?.wheel) && (
              <ComponentDetailCard
                type="wheel"
                title="Wheels"
                data={selectedConfiguration.wheels || selectedConfiguration.wheel}
              />
            )}
          </div>
        </div>
      );

    case 'features':
      return <FeaturesList motorcycle={motorcycle} />;

    case 'related':
      return <RelatedModelsSystem currentMotorcycle={motorcycle} />;

    case 'safety':
      return <SafetyNotesSection motorcycle={motorcycle} />;

    case 'manuals':
      return (
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">Manuals & Documentation</h2>
          <ManualsList motorcycleId={motorcycle.id} />
        </div>
      );

    default:
      return null;
  }
}
