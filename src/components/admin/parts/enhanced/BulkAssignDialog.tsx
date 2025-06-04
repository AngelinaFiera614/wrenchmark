
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import { linkComponentToConfiguration } from "@/services/componentLinkingService";
import { Configuration } from "@/types/motorcycle";

interface BulkAssignDialogProps {
  open: boolean;
  onClose: () => void;
  configurations: Configuration[];
  onSuccess: () => void;
}

const BulkAssignDialog = ({ open, onClose, configurations, onSuccess }: BulkAssignDialogProps) => {
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);
  const [selectedComponentType, setSelectedComponentType] = useState<string>("");
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const { data: engines } = useQuery({ queryKey: ["engines"], queryFn: fetchEngines });
  const { data: brakes } = useQuery({ queryKey: ["brakes"], queryFn: fetchBrakes });
  const { data: frames } = useQuery({ queryKey: ["frames"], queryFn: fetchFrames });
  const { data: suspensions } = useQuery({ queryKey: ["suspensions"], queryFn: fetchSuspensions });
  const { data: wheels } = useQuery({ queryKey: ["wheels"], queryFn: fetchWheels });

  const componentTypes = [
    { value: 'engine', label: 'Engine', data: engines || [] },
    { value: 'brake_system', label: 'Brake System', data: brakes || [] },
    { value: 'frame', label: 'Frame', data: frames || [] },
    { value: 'suspension', label: 'Suspension', data: suspensions || [] },
    { value: 'wheel', label: 'Wheels', data: wheels || [] }
  ];

  const selectedComponentTypeData = componentTypes.find(ct => ct.value === selectedComponentType);

  const handleConfigToggle = (configId: string) => {
    setSelectedConfigs(prev => 
      prev.includes(configId) 
        ? prev.filter(id => id !== configId)
        : [...prev, configId]
    );
  };

  const handleSelectAll = () => {
    setSelectedConfigs(configurations.map(config => config.id));
  };

  const handleClearAll = () => {
    setSelectedConfigs([]);
  };

  const handleBulkAssign = async () => {
    if (!selectedComponentType || !selectedComponentId || selectedConfigs.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid Selection",
        description: "Please select component type, component, and at least one configuration."
      });
      return;
    }

    setIsAssigning(true);
    let successCount = 0;
    let failureCount = 0;

    for (const configId of selectedConfigs) {
      try {
        const result = await linkComponentToConfiguration(
          configId,
          selectedComponentType as any,
          selectedComponentId
        );
        if (result.success) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        failureCount++;
      }
    }

    setIsAssigning(false);
    
    if (successCount > 0) {
      toast({
        title: "Bulk Assignment Complete",
        description: `Successfully assigned ${successCount} configurations. ${failureCount > 0 ? `${failureCount} failed.` : ''}`
      });
      onSuccess();
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: "Failed to assign components to any configurations."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">Bulk Component Assignment</DialogTitle>
          <DialogDescription className="text-explorer-text-muted">
            Assign a component to multiple configurations at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Component Selection */}
          <Card className="bg-explorer-dark border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Select Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-explorer-text mb-2 block">Component Type</label>
                <Select value={selectedComponentType} onValueChange={setSelectedComponentType}>
                  <SelectTrigger className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                    <SelectValue placeholder="Select component type" />
                  </SelectTrigger>
                  <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                    {componentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-explorer-text">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedComponentTypeData && (
                <div>
                  <label className="text-sm font-medium text-explorer-text mb-2 block">
                    {selectedComponentTypeData.label}
                  </label>
                  <Select value={selectedComponentId} onValueChange={setSelectedComponentId}>
                    <SelectTrigger className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                      <SelectValue placeholder={`Select ${selectedComponentTypeData.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                      {selectedComponentTypeData.data.map(component => (
                        <SelectItem key={component.id} value={component.id} className="text-explorer-text">
                          {component.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Selection */}
          <Card className="bg-explorer-dark border-explorer-chrome/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-explorer-text">Select Configurations</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/20"
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearAll}
                    className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="text-sm text-explorer-text-muted">
                Selected: {selectedConfigs.length} of {configurations.length} configurations
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {configurations.map(config => (
                  <div 
                    key={config.id}
                    className="flex items-center space-x-3 p-3 bg-explorer-card rounded border border-explorer-chrome/30"
                  >
                    <Checkbox
                      checked={selectedConfigs.includes(config.id)}
                      onCheckedChange={() => handleConfigToggle(config.id)}
                      className="border-explorer-chrome/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-explorer-text truncate">
                        {config.name || "Standard"}
                      </div>
                      <div className="text-xs text-explorer-text-muted">
                        {config.model_years?.motorcycle_models?.name} • {config.model_years?.year}
                      </div>
                    </div>
                    {config.is_default && (
                      <Badge variant="outline" className="text-xs">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-explorer-chrome/30">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBulkAssign}
            disabled={!selectedComponentType || !selectedComponentId || selectedConfigs.length === 0 || isAssigning}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            {isAssigning ? "Assigning..." : `Assign to ${selectedConfigs.length} Configurations`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignDialog;
