
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration, ModelYear } from "@/types/motorcycle";
import { copyConfigurationToMultipleYears } from "@/services/models/configurationCopy";

interface MultiYearCopyDialogProps {
  open: boolean;
  onClose: () => void;
  sourceConfiguration: Configuration;
  availableModelYears: ModelYear[];
  onSuccess: () => void;
}

const MultiYearCopyDialog = ({
  open,
  onClose,
  sourceConfiguration,
  availableModelYears,
  onSuccess
}: MultiYearCopyDialogProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [copyOptions, setCopyOptions] = useState({
    copyComponents: true,
    copyDimensions: true,
    copyBasicInfo: true,
    allowOverwrite: false
  });

  // Filter out the source year and sort by year
  const targetYears = availableModelYears
    .filter(year => year.id !== sourceConfiguration.model_year_id)
    .sort((a, b) => b.year - a.year);

  useEffect(() => {
    if (open) {
      setSelectedYears([]);
      setCopyOptions({
        copyComponents: true,
        copyDimensions: true,
        copyBasicInfo: true,
        allowOverwrite: false
      });
    }
  }, [open]);

  const handleYearToggle = (yearId: string) => {
    setSelectedYears(prev => 
      prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  const handleSelectAll = () => {
    setSelectedYears(targetYears.map(year => year.id));
  };

  const handleClearAll = () => {
    setSelectedYears([]);
  };

  const handleCopy = async () => {
    if (selectedYears.length === 0) {
      toast({
        variant: "destructive",
        title: "No Years Selected",
        description: "Please select at least one model year to copy to."
      });
      return;
    }

    setCopying(true);
    try {
      const results = await copyConfigurationToMultipleYears(
        sourceConfiguration.id,
        selectedYears,
        {
          newName: sourceConfiguration.name,
          copyComponents: copyOptions.copyComponents,
          copyDimensions: copyOptions.copyDimensions,
          copyBasicInfo: copyOptions.copyBasicInfo,
          allowOverwrite: copyOptions.allowOverwrite
        }
      );

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast({
          title: "Copy Successful",
          description: `Successfully copied "${sourceConfiguration.name}" to ${successCount} model year${successCount > 1 ? 's' : ''}.${failureCount > 0 ? ` ${failureCount} failed.` : ''}`
        });
      }

      if (failureCount > 0 && successCount === 0) {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: `Failed to copy to any of the selected years. Check for existing configurations with the same name.`
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error copying configuration:", error);
      toast({
        variant: "destructive",
        title: "Copy Error",
        description: `Failed to copy configuration: ${error.message}`
      });
    } finally {
      setCopying(false);
    }
  };

  const getSelectedYearNames = () => {
    return selectedYears
      .map(id => targetYears.find(year => year.id === id)?.year)
      .filter(Boolean)
      .sort((a, b) => b - a)
      .join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copy Trim Level to Multiple Years
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Configuration */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-explorer-text">
                Source: {sourceConfiguration.name || "Standard"}
              </CardTitle>
              <CardDescription>
                From {targetYears.find(y => y.id === sourceConfiguration.model_year_id)?.year || "Unknown Year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-explorer-text">Components:</div>
                  <div className="text-explorer-text-muted">
                    {[
                      sourceConfiguration.engine_id && "Engine",
                      sourceConfiguration.brake_system_id && "Brakes",
                      sourceConfiguration.frame_id && "Frame",
                      sourceConfiguration.suspension_id && "Suspension",
                      sourceConfiguration.wheel_id && "Wheels"
                    ].filter(Boolean).join(", ") || "None"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-explorer-text">Dimensions:</div>
                  <div className="text-explorer-text-muted">
                    {[
                      sourceConfiguration.seat_height_mm && "Seat Height",
                      sourceConfiguration.weight_kg && "Weight",
                      sourceConfiguration.wheelbase_mm && "Wheelbase"
                    ].filter(Boolean).join(", ") || "None"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-explorer-text">Price:</div>
                  <div className="text-explorer-text-muted">
                    {sourceConfiguration.msrp_usd 
                      ? `$${sourceConfiguration.msrp_usd.toLocaleString()}`
                      : "Not set"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-explorer-text">
                Select Target Years ({selectedYears.length} selected)
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 max-h-40 overflow-y-auto">
              {targetYears.map((year) => (
                <div key={year.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year.id}`}
                    checked={selectedYears.includes(year.id)}
                    onCheckedChange={() => handleYearToggle(year.id)}
                  />
                  <Label
                    htmlFor={`year-${year.id}`}
                    className="text-sm text-explorer-text cursor-pointer"
                  >
                    {year.year}
                  </Label>
                </div>
              ))}
            </div>

            {selectedYears.length > 0 && (
              <div className="p-3 bg-accent-teal/10 rounded border border-accent-teal/30">
                <div className="text-sm text-explorer-text">
                  <strong>Selected years:</strong> {getSelectedYearNames()}
                </div>
              </div>
            )}
          </div>

          {/* Copy Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-explorer-text">Copy Options</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyBasicInfo"
                  checked={copyOptions.copyBasicInfo}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyBasicInfo: !!checked }))
                  }
                />
                <Label htmlFor="copyBasicInfo" className="text-sm text-explorer-text">
                  Basic Information
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyComponents"
                  checked={copyOptions.copyComponents}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyComponents: !!checked }))
                  }
                />
                <Label htmlFor="copyComponents" className="text-sm text-explorer-text">
                  Components
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyDimensions"
                  checked={copyOptions.copyDimensions}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyDimensions: !!checked }))
                  }
                />
                <Label htmlFor="copyDimensions" className="text-sm text-explorer-text">
                  Dimensions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowOverwrite"
                  checked={copyOptions.allowOverwrite}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, allowOverwrite: !!checked }))
                  }
                />
                <Label htmlFor="allowOverwrite" className="text-sm text-explorer-text">
                  Allow Overwrite
                </Label>
              </div>
            </div>

            {!copyOptions.allowOverwrite && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  Configurations with the same name will be skipped. Enable "Allow Overwrite" to update existing configurations.
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-explorer-chrome/30">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={copying}
              className="flex-1 border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCopy}
              disabled={copying || selectedYears.length === 0}
              className="flex-1 bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {copying ? (
                <>Copying...</>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to {selectedYears.length} Year{selectedYears.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiYearCopyDialog;
