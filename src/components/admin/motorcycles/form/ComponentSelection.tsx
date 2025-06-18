
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Control } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchEngines, 
  fetchBrakeSystems, 
  fetchFrames,
  fetchSuspensions,
  fetchWheels
} from "@/services/componentService";

interface ComponentSelectionProps {
  control: Control<any>;
  onAddNew: (componentType: string) => void;
}

export function ComponentSelection({ control, onAddNew }: ComponentSelectionProps) {
  const { data: engines, isLoading: enginesLoading } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines,
  });

  const { data: brakes, isLoading: brakesLoading } = useQuery({
    queryKey: ["brake-systems"],
    queryFn: fetchBrakeSystems,
  });

  const { data: frames, isLoading: framesLoading } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames,
  });

  const { data: suspensions, isLoading: suspensionsLoading } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions,
  });

  const { data: wheels, isLoading: wheelsLoading } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels,
  });

  // Enhanced validator for component IDs
  const hasValidId = (item: any): item is { id: string; name: string } => {
    return item && 
           typeof item === 'object' && 
           typeof item.id === 'string' && 
           item.id.trim().length > 0 &&
           item.id !== 'undefined' && 
           item.id !== 'null' &&
           typeof item.name === 'string' &&
           item.name.trim().length > 0;
  };

  // Helper to clean defaultValue for Selects
  const cleanSelectValue = (val: any): string | undefined => {
    if (typeof val === 'string' && val.trim() && val !== 'undefined' && val !== 'null') {
      return val;
    }
    return undefined;
  };

  // Filter and validate components with enhanced safety
  const validEngines = Array.isArray(engines) ? engines.filter(hasValidId) : [];
  const validBrakes = Array.isArray(brakes) ? brakes.filter(hasValidId) : [];
  const validFrames = Array.isArray(frames) ? frames.filter(hasValidId) : [];
  const validSuspensions = Array.isArray(suspensions) ? suspensions.filter(hasValidId) : [];
  const validWheels = Array.isArray(wheels) ? wheels.filter(hasValidId) : [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-explorer-text">Technical Components</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Engine Selection */}
        <FormField
          control={control}
          name="engine_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-explorer-text">Engine</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={cleanSelectValue(field.value) || ""}
                  >
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue placeholder="Select engine" />
                    </SelectTrigger>
                    <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                      <SelectItem value="">No engine selected</SelectItem>
                      {enginesLoading ? (
                        <div className="px-4 py-2 text-explorer-text-muted">Loading engines...</div>
                      ) : validEngines.length > 0 ? (
                        validEngines.map((engine) => (
                          <SelectItem key={engine.id} value={engine.id}>
                            {engine.name}
                            {engine.displacement_cc && ` - ${engine.displacement_cc}cc`}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-explorer-text-muted">No engines available</div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("engine")}
                  className="bg-explorer-dark border-explorer-chrome/30"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brake System Selection */}
        <FormField
          control={control}
          name="brake_system_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-explorer-text">Brake System</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={cleanSelectValue(field.value) || ""}
                  >
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue placeholder="Select brake system" />
                    </SelectTrigger>
                    <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                      <SelectItem value="">No brake system selected</SelectItem>
                      {brakesLoading ? (
                        <div className="px-4 py-2 text-explorer-text-muted">Loading brake systems...</div>
                      ) : validBrakes.length > 0 ? (
                        validBrakes.map((brake) => (
                          <SelectItem key={brake.id} value={brake.id}>
                            {brake.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-explorer-text-muted">No brake systems available</div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("brake")}
                  className="bg-explorer-dark border-explorer-chrome/30"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frame Selection */}
        <FormField
          control={control}
          name="frame_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-explorer-text">Frame</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={cleanSelectValue(field.value) || ""}
                  >
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue placeholder="Select frame" />
                    </SelectTrigger>
                    <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                      <SelectItem value="">No frame selected</SelectItem>
                      {framesLoading ? (
                        <div className="px-4 py-2 text-explorer-text-muted">Loading frames...</div>
                      ) : validFrames.length > 0 ? (
                        validFrames.map((frame) => (
                          <SelectItem key={frame.id} value={frame.id}>
                            {frame.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-explorer-text-muted">No frames available</div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("frame")}
                  className="bg-explorer-dark border-explorer-chrome/30"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Suspension Selection */}
        <FormField
          control={control}
          name="suspension_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-explorer-text">Suspension</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={cleanSelectValue(field.value) || ""}
                  >
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue placeholder="Select suspension" />
                    </SelectTrigger>
                    <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                      <SelectItem value="">No suspension selected</SelectItem>
                      {suspensionsLoading ? (
                        <div className="px-4 py-2 text-explorer-text-muted">Loading suspensions...</div>
                      ) : validSuspensions.length > 0 ? (
                        validSuspensions.map((suspension) => (
                          <SelectItem key={suspension.id} value={suspension.id}>
                            {suspension.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-explorer-text-muted">No suspensions available</div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("suspension")}
                  className="bg-explorer-dark border-explorer-chrome/30"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Wheels Selection */}
        <FormField
          control={control}
          name="wheel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-explorer-text">Wheels</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={cleanSelectValue(field.value) || ""}
                  >
                    <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                      <SelectValue placeholder="Select wheels" />
                    </SelectTrigger>
                    <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                      <SelectItem value="">No wheels selected</SelectItem>
                      {wheelsLoading ? (
                        <div className="px-4 py-2 text-explorer-text-muted">Loading wheels...</div>
                      ) : validWheels.length > 0 ? (
                        validWheels.map((wheel) => (
                          <SelectItem key={wheel.id} value={wheel.id}>
                            {wheel.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-explorer-text-muted">No wheels available</div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("wheels")}
                  className="bg-explorer-dark border-explorer-chrome/30"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
