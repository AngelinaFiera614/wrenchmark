
import React from "react";
import { Motorcycle } from "@/types";
import { Configuration } from "@/types/motorcycle";
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
  selectedConfiguration: Configuration | null;
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
          <PerformanceSpecifications motorcycle={motorcycle} />
          <PhysicalDimensions motorcycle={motorcycle} />
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
