
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
      if (!hasComponentData) return null;
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
            {selectedConfiguration?.engines && (
              <ComponentDetailCard
                type="engine"
                title="Engine"
                data={selectedConfiguration.engines}
              />
            )}
            {selectedConfiguration?.brake_systems && (
              <ComponentDetailCard
                type="brake"
                title="Brake System"
                data={selectedConfiguration.brake_systems}
              />
            )}
            {selectedConfiguration?.frames && (
              <ComponentDetailCard
                type="frame"
                title="Frame"
                data={selectedConfiguration.frames}
              />
            )}
            {selectedConfiguration?.suspensions && (
              <ComponentDetailCard
                type="suspension"
                title="Suspension"
                data={selectedConfiguration.suspensions}
              />
            )}
            {selectedConfiguration?.wheels && (
              <ComponentDetailCard
                type="wheel"
                title="Wheels"
                data={selectedConfiguration.wheels}
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
