import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelYear } from "@/types/motorcycle";
import { ComponentType } from "@/services/modelComponent/types";
import { Settings, Layers, ArrowDown, Zap, Wrench, Square, Gauge, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ComponentOverridesSectionProps {
  formData: any;
  modelYears: ModelYear[];
  componentOverrides: any[];
  validation: any;
  onComponentOverride: (yearId: string, componentType: ComponentType, componentId: string | null, isOverride: boolean) => void;
}

const ComponentOverridesSection = ({
  formData,
  modelYears,
  componentOverrides,
  validation,
  onComponentOverride
}: ComponentOverridesSectionProps) => {
  const [selectedYear, setSelectedYear] = useState<string>(
    formData.target_years?.[0] || ""
  );

  const componentTypeConfig = {
    engine: { label: "Engine", icon: Zap, table: "engines" },
    brake_system: { label: "Brake System", icon: Gauge, table: "brake_systems" },
    frame: { label: "Frame", icon: Square, table: "frames" },
    suspension: { label: "Suspension", icon: Wrench, table: "suspensions" },
    wheel: { label: "Wheels", icon: Circle, table: "wheels" },
  };

  // Fetch available components for each type
  const fetchComponents = async (componentType: ComponentType) => {
    const config = componentTypeConfig[componentType];
    if (!config) return [];

    const { data, error } = await supabase
      .from(config.table)
      .select('id, name, type')
      .eq('is_draft', false)
      .order('name');

    if (error) {
      console.error(`Error fetching ${componentType}:`, error);
      return [];
    }

    return data || [];
  };

  const { data: engines = [] } = useQuery({
    queryKey: ['components', 'engine'],
    queryFn: () => fetchComponents('engine')
  });

  const { data: brakeSystems = [] } = useQuery({
    queryKey: ['components', 'brake_system'],
    queryFn: () => fetchComponents('brake_system')
  });

  const { data: frames = [] } = useQuery({
    queryKey: ['components', 'frame'],
    queryFn: () => fetchComponents('frame')
  });

  const { data: suspensions = [] } = useQuery({
    queryKey: ['components', 'suspension'],
    queryFn: () => fetchComponents('suspension')
  });

  const { data: wheels = [] } = useQuery({
    queryKey: ['components', 'wheel'],
    queryFn: () => fetchComponents('wheel')
  });

  const componentData = {
    engine: engines,
    brake_system: brakeSystems,
    frame: frames,
    suspension: suspensions,
    wheel: wheels,
  };

  const getOverrideForYearAndType = (yearId: string, componentType: ComponentType) => {
    return componentOverrides.find(
      o => o.yearId === yearId && o.componentType === componentType
    );
  };

  const handleOverrideToggle = (componentType: ComponentType, isOverride: boolean) => {
    if (!selectedYear) return;
    
    const current = getOverrideForYearAndType(selectedYear, componentType);
    onComponentOverride(
      selectedYear,
      componentType,
      current?.componentId || null,
      isOverride
    );
  };

  const handleComponentSelect = (componentType: ComponentType, componentId: string) => {
    if (!selectedYear) return;
    
    const current = getOverrideForYearAndType(selectedYear, componentType);
    onComponentOverride(
      selectedYear,
      componentType,
      componentId,
      current?.isOverride || true
    );
  };

  const selectedYearData = modelYears.find(y => y.id === selectedYear);
  const targetYears = formData.target_years || [];

  return (
    <div className="space-y-6">
      {/* Year Selection */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Settings className="h-5 w-5 text-accent-teal" />
            Component Override Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="text-explorer-text">Configure overrides for year:</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-48 bg-explorer-card border-explorer-chrome/30">
                  <SelectValue placeholder="Select model year" />
                </SelectTrigger>
                <SelectContent>
                  {targetYears.map((yearId: string) => {
                    const year = modelYears.find(y => y.id === yearId);
                    return year ? (
                      <SelectItem key={yearId} value={yearId}>
                        {year.year}
                      </SelectItem>
                    ) : null;
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedYearData && (
              <div className="p-4 bg-explorer-card rounded-lg border border-explorer-chrome/30">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-4 w-4 text-accent-teal" />
                  <span className="text-explorer-text font-medium">Inheritance Model</span>
                </div>
                <p className="text-explorer-text/70 text-sm">
                  Components inherit from the base motorcycle model by default. 
                  Enable overrides to specify trim-specific components for <strong>{selectedYearData.year}</strong>.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Component Override Controls */}
      {selectedYear && (
        <Card className="bg-explorer-dark border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">
              Component Overrides - {selectedYearData?.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(componentTypeConfig).map(([type, config]) => {
                const componentType = type as ComponentType;
                const override = getOverrideForYearAndType(selectedYear, componentType);
                const isOverrideEnabled = override?.isOverride || false;
                const selectedComponentId = override?.componentId;
                const availableComponents = componentData[componentType] || [];
                const IconComponent = config.icon;

                return (
                  <div
                    key={componentType}
                    className="p-4 rounded-lg border border-explorer-chrome/30 bg-explorer-card"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-accent-teal" />
                        <div>
                          <h4 className="text-explorer-text font-medium">{config.label}</h4>
                          <p className="text-explorer-text/60 text-sm">
                            {isOverrideEnabled ? "Trim-specific override" : "Inherited from model"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {isOverrideEnabled && selectedComponentId && (
                          <Badge className="bg-accent-teal text-black">
                            Override Active
                          </Badge>
                        )}
                        {!isOverrideEnabled && (
                          <Badge variant="outline" className="border-explorer-chrome/30">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            Inherited
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`override-${componentType}`} className="text-explorer-text text-sm">
                            Override
                          </Label>
                          <Switch
                            id={`override-${componentType}`}
                            checked={isOverrideEnabled}
                            onCheckedChange={(checked) => handleOverrideToggle(componentType, checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {isOverrideEnabled && (
                      <div className="space-y-2">
                        <Label className="text-explorer-text">
                          Select {config.label} Component
                        </Label>
                        <Select
                          value={selectedComponentId || ""}
                          onValueChange={(value) => handleComponentSelect(componentType, value)}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue placeholder={`Choose ${config.label.toLowerCase()}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableComponents.map((component: any) => (
                              <SelectItem key={component.id} value={component.id}>
                                {component.name} {component.type && `(${component.type})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-explorer-card rounded-lg border border-explorer-chrome/30">
              <h4 className="text-explorer-text font-medium mb-2">Override Summary</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(componentTypeConfig).map(([type, config]) => {
                  const componentType = type as ComponentType;
                  const override = getOverrideForYearAndType(selectedYear, componentType);
                  const isActive = override?.isOverride && override?.componentId;
                  
                  return (
                    <Badge
                      key={componentType}
                      variant={isActive ? "default" : "outline"}
                      className={isActive ? "bg-accent-teal text-black" : "border-explorer-chrome/30"}
                    >
                      {config.label}: {isActive ? "Override" : "Inherited"}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validation.errors.some((error: any) => error.section === "components") && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="pt-6">
            <div className="space-y-2">
              {validation.errors
                .filter((error: any) => error.section === "components")
                .map((error: any, index: number) => (
                  <p key={index} className="text-destructive text-sm">
                    {error.message}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComponentOverridesSection;