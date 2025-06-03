
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy, Palette, Wrench, Ruler, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { updateConfiguration } from "@/services/models/configurationService";

interface QuickCopyDialogProps {
  open: boolean;
  onClose: () => void;
  targetConfiguration: Configuration;
  availableConfigurations: Configuration[];
  onSuccess: () => void;
  defaultCopyType?: 'components' | 'dimensions' | 'colors' | 'all';
}

interface CopySelection {
  basicInfo: boolean;
  components: boolean;
  dimensions: boolean;
  colors: boolean;
}

const QuickCopyDialog = ({
  open,
  onClose,
  targetConfiguration,
  availableConfigurations,
  onSuccess,
  defaultCopyType = 'all'
}: QuickCopyDialogProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);
  const [sourceConfigId, setSourceConfigId] = useState<string>("");
  const [copySelection, setCopySelection] = useState<CopySelection>({
    basicInfo: defaultCopyType === 'all',
    components: defaultCopyType === 'components' || defaultCopyType === 'all',
    dimensions: defaultCopyType === 'dimensions' || defaultCopyType === 'all',
    colors: defaultCopyType === 'colors' || defaultCopyType === 'all'
  });

  const sourceConfiguration = availableConfigurations.find(c => c.id === sourceConfigId);
  const filteredConfigurations = availableConfigurations.filter(c => c.id !== targetConfiguration.id);

  useEffect(() => {
    // Reset selection when dialog opens
    if (open) {
      setSourceConfigId("");
      setCopySelection({
        basicInfo: defaultCopyType === 'all',
        components: defaultCopyType === 'components' || defaultCopyType === 'all',
        dimensions: defaultCopyType === 'dimensions' || defaultCopyType === 'all',
        colors: defaultCopyType === 'colors' || defaultCopyType === 'all'
      });
    }
  }, [open, defaultCopyType]);

  const handleCopy = async () => {
    if (!sourceConfiguration) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a source configuration to copy from."
      });
      return;
    }

    setCopying(true);
    try {
      const updateData: Partial<Configuration> = {};

      // Copy basic info
      if (copySelection.basicInfo) {
        if (sourceConfiguration.description) updateData.description = sourceConfiguration.description;
        if (sourceConfiguration.market_region) updateData.market_region = sourceConfiguration.market_region;
        if (sourceConfiguration.trim_level) updateData.trim_level = sourceConfiguration.trim_level;
        if (sourceConfiguration.price_premium_usd) updateData.price_premium_usd = sourceConfiguration.price_premium_usd;
        if (sourceConfiguration.special_features) updateData.special_features = sourceConfiguration.special_features;
        if (sourceConfiguration.optional_equipment) updateData.optional_equipment = sourceConfiguration.optional_equipment;
      }

      // Copy components
      if (copySelection.components) {
        if (sourceConfiguration.engine_id) updateData.engine_id = sourceConfiguration.engine_id;
        if (sourceConfiguration.brake_system_id) updateData.brake_system_id = sourceConfiguration.brake_system_id;
        if (sourceConfiguration.frame_id) updateData.frame_id = sourceConfiguration.frame_id;
        if (sourceConfiguration.suspension_id) updateData.suspension_id = sourceConfiguration.suspension_id;
        if (sourceConfiguration.wheel_id) updateData.wheel_id = sourceConfiguration.wheel_id;
      }

      // Copy dimensions
      if (copySelection.dimensions) {
        if (sourceConfiguration.seat_height_mm) updateData.seat_height_mm = sourceConfiguration.seat_height_mm;
        if (sourceConfiguration.weight_kg) updateData.weight_kg = sourceConfiguration.weight_kg;
        if (sourceConfiguration.wheelbase_mm) updateData.wheelbase_mm = sourceConfiguration.wheelbase_mm;
        if (sourceConfiguration.fuel_capacity_l) updateData.fuel_capacity_l = sourceConfiguration.fuel_capacity_l;
        if (sourceConfiguration.ground_clearance_mm) updateData.ground_clearance_mm = sourceConfiguration.ground_clearance_mm;
      }

      // Copy colors (would need additional implementation for color assignments)
      if (copySelection.colors && sourceConfiguration.color_id) {
        updateData.color_id = sourceConfiguration.color_id;
      }

      const result = await updateConfiguration(targetConfiguration.id, updateData);
      
      if (result) {
        const copiedItems = [];
        if (copySelection.basicInfo) copiedItems.push("basic info");
        if (copySelection.components) copiedItems.push("components");
        if (copySelection.dimensions) copiedItems.push("dimensions");
        if (copySelection.colors) copiedItems.push("colors");

        toast({
          title: "Success!",
          description: `Successfully copied ${copiedItems.join(", ")} from "${sourceConfiguration.name}" to "${targetConfiguration.name}".`
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Error copying configuration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to copy configuration: ${error.message}`
      });
    } finally {
      setCopying(false);
    }
  };

  const getCopyTypeTitle = () => {
    switch (defaultCopyType) {
      case 'components': return 'Copy Components';
      case 'dimensions': return 'Copy Dimensions';
      case 'colors': return 'Copy Colors';
      default: return 'Quick Copy';
    }
  };

  const getSelectedCount = () => {
    return Object.values(copySelection).filter(Boolean).length;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            {getCopyTypeTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Configuration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Copy To: {targetConfiguration.name}</CardTitle>
              <CardDescription>
                {targetConfiguration.description || "No description"}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Source Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Copy from configuration:</Label>
            <Select value={sourceConfigId} onValueChange={setSourceConfigId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a configuration to copy from" />
              </SelectTrigger>
              <SelectContent>
                {filteredConfigurations.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    <div className="flex items-center gap-2">
                      <span>{config.name}</span>
                      {config.is_default && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source Configuration Preview */}
          {sourceConfiguration && (
            <Card className="border-accent-teal/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Source: {sourceConfiguration.name}</CardTitle>
                <CardDescription>
                  {sourceConfiguration.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Components Available:</div>
                    <div className="text-muted-foreground">
                      {[
                        sourceConfiguration.engine && "Engine",
                        sourceConfiguration.brakes && "Brakes",
                        sourceConfiguration.frame && "Frame",
                        sourceConfiguration.suspension && "Suspension", 
                        sourceConfiguration.wheels && "Wheels"
                      ].filter(Boolean).join(", ") || "None"}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Dimensions Available:</div>
                    <div className="text-muted-foreground">
                      {[
                        sourceConfiguration.seat_height_mm && "Seat Height",
                        sourceConfiguration.weight_kg && "Weight",
                        sourceConfiguration.wheelbase_mm && "Wheelbase",
                        sourceConfiguration.fuel_capacity_l && "Fuel Capacity",
                        sourceConfiguration.ground_clearance_mm && "Ground Clearance"
                      ].filter(Boolean).join(", ") || "None"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Copy Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">What to copy ({getSelectedCount()} selected):</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyBasicInfo"
                  checked={copySelection.basicInfo}
                  onCheckedChange={(checked) => 
                    setCopySelection(prev => ({ ...prev, basicInfo: !!checked }))
                  }
                />
                <Label htmlFor="copyBasicInfo" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Basic Information
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyComponents"
                  checked={copySelection.components}
                  onCheckedChange={(checked) => 
                    setCopySelection(prev => ({ ...prev, components: !!checked }))
                  }
                />
                <Label htmlFor="copyComponents" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Components
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyDimensions"
                  checked={copySelection.dimensions}
                  onCheckedChange={(checked) => 
                    setCopySelection(prev => ({ ...prev, dimensions: !!checked }))
                  }
                />
                <Label htmlFor="copyDimensions" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Dimensions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyColors"
                  checked={copySelection.colors}
                  onCheckedChange={(checked) => 
                    setCopySelection(prev => ({ ...prev, colors: !!checked }))
                  }
                />
                <Label htmlFor="copyColors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={copying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCopy}
              disabled={copying || !sourceConfigId || getSelectedCount() === 0}
              className="flex-1 bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {copying ? (
                <>Copying...</>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Selected Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCopyDialog;
