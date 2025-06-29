
import React from "react";
import { Motorcycle } from "@/types";
import { PerformanceSpecifications } from "../PerformanceSpecifications";
import { PhysicalDimensions } from "../PhysicalDimensions";
import { FeaturesList } from "../FeaturesList";
import { SafetyNotesSection } from "../SafetyNotesSection";
import { InteractiveSpecificationDisplay } from "../content";
import { RelatedModelsSystem } from "../related";
import { ComponentDetailCard } from "../components";
import { ComponentStatusCard } from "../components/ComponentStatusCard";
import { DataCompletenessIndicator } from "../DataCompletenessIndicator";
import { calculateDataCompletenessSync } from "@/utils/dataCompleteness";
import ManualsList from "../ManualsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const dataCompleteness = calculateDataCompletenessSync(motorcycle, selectedConfiguration);

  switch (activeTab) {
    case 'specifications':
      return (
        <div className="space-y-6">
          {dataCompleteness.completionPercentage < 100 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <DataCompletenessIndicator 
                      status={dataCompleteness} 
                      variant="detail" 
                      showDetails 
                    />
                    <p className="text-sm text-orange-700 mt-2">
                      Some specifications may be incomplete. Missing: {dataCompleteness.missingCriticalFields.join(', ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
        </div>
      );

    case 'interactive':
      return <InteractiveSpecificationDisplay motorcycle={motorcycle} />;

    case 'components':
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
              {dataCompleteness.completionPercentage < 100 && (
                <div className="mt-3">
                  <DataCompletenessIndicator 
                    status={dataCompleteness} 
                    variant="detail" 
                    showDetails 
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComponentStatusCard
              title="Engine"
              data={selectedConfiguration?.engines || selectedConfiguration?.engine}
              isAvailable={dataCompleteness.hasEngine}
            >
              {(selectedConfiguration?.engines || selectedConfiguration?.engine) && (
                <ComponentDetailCard
                  type="engine"
                  title="Engine"
                  data={selectedConfiguration.engines || selectedConfiguration.engine}
                />
              )}
            </ComponentStatusCard>

            <ComponentStatusCard
              title="Brake System"
              data={selectedConfiguration?.brake_systems || selectedConfiguration?.brakes}
              isAvailable={dataCompleteness.hasBrakes}
            >
              {(selectedConfiguration?.brake_systems || selectedConfiguration?.brakes) && (
                <ComponentDetailCard
                  type="brake"
                  title="Brake System"
                  data={selectedConfiguration.brake_systems || selectedConfiguration.brakes}
                />
              )}
            </ComponentStatusCard>

            <ComponentStatusCard
              title="Frame"
              data={selectedConfiguration?.frames || selectedConfiguration?.frame}
              isAvailable={dataCompleteness.hasFrame}
            >
              {(selectedConfiguration?.frames || selectedConfiguration?.frame) && (
                <ComponentDetailCard
                  type="frame"
                  title="Frame"
                  data={selectedConfiguration.frames || selectedConfiguration.frame}
                />
              )}
            </ComponentStatusCard>

            <ComponentStatusCard
              title="Suspension"
              data={selectedConfiguration?.suspensions || selectedConfiguration?.suspension}
              isAvailable={dataCompleteness.hasSuspension}
            >
              {(selectedConfiguration?.suspensions || selectedConfiguration?.suspension) && (
                <ComponentDetailCard
                  type="suspension"
                  title="Suspension"
                  data={selectedConfiguration.suspensions || selectedConfiguration.suspension}
                />
              )}
            </ComponentStatusCard>

            <ComponentStatusCard
              title="Wheels"
              data={selectedConfiguration?.wheels || selectedConfiguration?.wheel}
              isAvailable={dataCompleteness.hasWheels}
            >
              {(selectedConfiguration?.wheels || selectedConfiguration?.wheel) && (
                <ComponentDetailCard
                  type="wheel"
                  title="Wheels"
                  data={selectedConfiguration.wheels || selectedConfiguration.wheel}
                />
              )}
            </ComponentStatusCard>
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
