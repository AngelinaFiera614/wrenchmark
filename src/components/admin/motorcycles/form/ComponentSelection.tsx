
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Control } from "react-hook-form";
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
  // Fetch all component options
  const { data: engines, isLoading: enginesLoading } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakeSystems, isLoading: brakesLoading } = useQuery({
    queryKey: ["brake-systems"],
    queryFn: fetchBrakeSystems
  });

  const { data: frames, isLoading: framesLoading } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { data: suspensions, isLoading: suspensionsLoading } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { data: wheels, isLoading: wheelsLoading } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Component Selection</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Select components for this motorcycle configuration. Components are shared across different
        motorcycle models to maintain consistency and enable better comparison.
      </p>

      {/* Engine Selection */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FormField
            control={control}
            name="engine_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engine</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      {enginesLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select an engine" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {engines?.map((engine) => (
                      <SelectItem key={engine.id} value={engine.id}>
                        {engine.name} - {engine.displacement_cc}cc
                        {engine.power_hp ? ` (${engine.power_hp}hp)` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a pre-defined engine or create a new one
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={() => onAddNew("engine")}
          className="mb-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Brake System Selection */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FormField
            control={control}
            name="brake_system_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brake System</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      {brakesLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select a brake system" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brakeSystems?.map((brake) => (
                      <SelectItem key={brake.id} value={brake.id}>
                        {brake.type} {brake.has_traction_control ? "(with TC)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a brake system configuration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={() => onAddNew("brakes")}
          className="mb-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Frame Selection */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FormField
            control={control}
            name="frame_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frame</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      {framesLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select a frame" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {frames?.map((frame) => (
                      <SelectItem key={frame.id} value={frame.id}>
                        {frame.type} {frame.material ? `(${frame.material})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the frame type for this configuration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={() => onAddNew("frame")}
          className="mb-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Suspension Selection */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FormField
            control={control}
            name="suspension_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspension</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      {suspensionsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select suspension" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suspensions?.map((suspension) => (
                      <SelectItem key={suspension.id} value={suspension.id}>
                        {suspension.front_type} / {suspension.rear_type}
                        {suspension.brand ? ` (${suspension.brand})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select front and rear suspension setup
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={() => onAddNew("suspension")}
          className="mb-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Wheels Selection */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FormField
            control={control}
            name="wheel_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wheels</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      {wheelsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select wheel setup" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wheels?.map((wheel) => (
                      <SelectItem key={wheel.id} value={wheel.id}>
                        {wheel.type || `${wheel.front_size}/${wheel.rear_size}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select wheel configuration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={() => onAddNew("wheels")}
          className="mb-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
