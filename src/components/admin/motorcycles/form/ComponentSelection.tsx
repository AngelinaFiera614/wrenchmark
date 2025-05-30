
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Technical Components</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Engine Selection */}
        <FormField
          control={control}
          name="engine_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engine</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select engine" />
                    </SelectTrigger>
                    <SelectContent>
                      {enginesLoading ? (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      ) : (
                        engines?.map((engine) => (
                          <SelectItem key={engine.id} value={engine.id}>
                            {engine.name} - {engine.displacement_cc}cc
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("engine")}
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
              <FormLabel>Brake System</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brake system" />
                    </SelectTrigger>
                    <SelectContent>
                      {brakesLoading ? (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      ) : (
                        brakes?.map((brake) => (
                          <SelectItem key={brake.id} value={brake.id}>
                            {brake.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("brake")}
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
              <FormLabel>Frame</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frame" />
                    </SelectTrigger>
                    <SelectContent>
                      {framesLoading ? (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      ) : (
                        frames?.map((frame) => (
                          <SelectItem key={frame.id} value={frame.id}>
                            {frame.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("frame")}
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
              <FormLabel>Suspension</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select suspension" />
                    </SelectTrigger>
                    <SelectContent>
                      {suspensionsLoading ? (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      ) : (
                        suspensions?.map((suspension) => (
                          <SelectItem key={suspension.id} value={suspension.id}>
                            {suspension.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("suspension")}
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
              <FormLabel>Wheels</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wheels" />
                    </SelectTrigger>
                    <SelectContent>
                      {wheelsLoading ? (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      ) : (
                        wheels?.map((wheel) => (
                          <SelectItem key={wheel.id} value={wheel.id}>
                            {wheel.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddNew("wheels")}
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
