
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy, AlertTriangle, CheckCircle, RefreshCw, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration, ModelYear } from "@/types/motorcycle";
import { copyConfigurationToMultipleYears, getYearsWithExistingConfigs } from "@/services/models/configurationCopy";

interface MultiYearCopyDialogProps {
  open: boolean;
  onClose: () => void;
  sourceConfiguration: Configuration;
  availableModelYears: ModelYear[];
  onSuccess: () => void;
}

interface CopyOptions {
  copyComponents: boolean;
  copyDimensions: boolean;
  copyBasicInfo: boolean;
  allowOverwrite: boolean;
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
  const [yearsWithExisting, setYearsWithExisting] = useState<Set<string>>(new Set());
  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
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
      loadExistingConfigurations();
    }
  }, [open, sourceConfiguration.name]);

  const loadExistingConfigurations = async () => {
    if (!sourceConfiguration.name || targetYears.length === 0) return;
    
    try {
      // Get the motorcycle ID from the source configuration
      const sourceYear = availableModelYears.find(y => y.id === sourceConfiguration.model_year_id);
      if (sourceYear?.motorcycle_id) {
        const existing = await getYearsWithExistingConfigs(sourceYear.motorcycle_id, sourceConfiguration.name);
        setYearsWithExisting(existing);
      }
    } catch (error) {
      console.error("Error loading existing configurations:", error);
    }
  };

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

  const getActionSummary = () => {
    const createYears = selectedYears.filter(yearId => !yearsWithExisting.has(yearId));
    const updateYears = selectedYears.filter(yearId => yearsWithExisting.has(yearId));
    
    return { createYears, updateYears };
  };

  const validateCopyOptions = () => {
    if (selectedYears.length === 0) {
      toast({
        variant: "destructive",
        title: "No Years Selected",
        description: "Please select at least one model year to copy to."
      });
      return false;
    }

    const { updateYears } = getActionSummary();
    if (updateYears.length > 0 && !copyOptions.allowOverwrite) {
      toast({
        variant: "destructive",
        title: "Overwrite Required",
        description: `${updateYears.length} year(s) have existing configurations. Enable "Allow Overwrite" to update them.`
      });
      return false;
    }

    if (!copyOptions.copyBasicInfo && !copyOptions.copyComponents && !copyOptions.copyDimensions) {
      toast({
        variant: "destructive",
        title: "Nothing to Copy",
        description: "Please select at least one category of data to copy."
      });
      return false;
    }

    return true;
  };

  const handleCopy = async () => {
    if (!validateCopyOptions()) return;

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

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      const created = successful.filter(r => r.action === 'created');
      const updated = successful.filter(r => r.action === 'updated');

      if (successful.length > 0) {
        let message = `Successfully processed ${successful.length} year${successful.length > 1 ? 's' : ''}`;
        if (created.length > 0 && updated.length > 0) {
          message += ` (${created.length} created, ${updated.length} updated)`;
        } else if (created.length > 0) {
          message += ` (${created.length} created)`;
        } else if (updated.length > 0) {
          message += ` (${updated.length} updated)`;
        }

        toast({
          title: "Copy Successful",
          description: message
        });

        onSuccess();
        onClose();
      }

      if (failed.length > 0) {
        console.error("Copy failures:", failed);
        toast({
          variant: "destructive",
          title: "Partial Failure",
          description: `${failed.length} year(s) failed to copy. Check console for details.`
        });
      }
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

  const { createYears, updateYears } = getActionSummary();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copy "{sourceConfiguration.name}" to Multiple Years
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Configuration Info */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-explorer-text">
                Source Configuration
              </CardTitle>
              <CardDescription>
                {availableModelYears.find(y => y.id === sourceConfiguration.model_year_id)?.year || "Unknown Year"}
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
                  <div className="font-medium text-explorer-text">Pricing:</div>
                  <div className="text-explorer-text-muted">
                    {sourceConfiguration.price_premium_usd 
                      ? `$${sourceConfiguration.price_premium_usd.toLocaleString()} premium`
                      : "No premium"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Copy Options */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">What to Copy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyBasicInfo"
                      checked={copyOptions.copyBasicInfo}
                      onCheckedChange={(checked) => 
                        setCopyOptions(prev => ({ ...prev, copyBasicInfo: !!checked }))
                      }
                    />
                    <Label htmlFor="copyBasicInfo" className="text-explorer-text">
                      Basic Information
                      <div className="text-xs text-explorer-text-muted">Name, region, pricing</div>
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
                    <Label htmlFor="copyComponents" className="text-explorer-text">
                      Components
                      <div className="text-xs text-explorer-text-muted">Engine, brakes, frame, etc.</div>
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyDimensions"
                      checked={copyOptions.copyDimensions}
                      onCheckedChange={(checked) => 
                        setCopyOptions(prev => ({ ...prev, copyDimensions: !!checked }))
                      }
                    />
                    <Label htmlFor="copyDimensions" className="text-explorer-text">
                      Dimensions
                      <div className="text-xs text-explorer-text-muted">Weight, height, wheelbase</div>
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
                    <Label htmlFor="allowOverwrite" className="text-explorer-text">
                      Allow Overwrite
                      <div className="text-xs text-explorer-text-muted">Update existing configurations</div>
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Years Selection */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-explorer-text">
                  Select Target Years ({selectedYears.length} selected)
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                {targetYears.map((year) => {
                  const hasExisting = yearsWithExisting.has(year.id);
                  const isSelected = selectedYears.includes(year.id);
                  
                  return (
                    <div
                      key={year.id}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-accent-teal bg-accent-teal/10' 
                          : 'border-explorer-chrome/30 bg-explorer-dark hover:bg-explorer-chrome/10'
                      }`}
                      onClick={() => handleYearToggle(year.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        readOnly
                      />
                      <div className="flex-1">
                        <Label className="cursor-pointer text-explorer-text font-medium">
                          {year.year}
                        </Label>
                        <div className="flex items-center gap-1 mt-1">
                          {hasExisting ? (
                            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Will Update
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                              <Plus className="h-3 w-3 mr-1" />
                              Will Create
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Summary */}
          {selectedYears.length > 0 && (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Action Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 font-medium text-green-600">
                      <Plus className="h-4 w-4" />
                      Create New ({createYears.length})
                    </div>
                    {createYears.length > 0 && (
                      <div className="text-explorer-text-muted mt-1">
                        {createYears.map(yearId => {
                          const year = targetYears.find(y => y.id === yearId);
                          return year?.year;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium text-orange-600">
                      <RefreshCw className="h-4 w-4" />
                      Update Existing ({updateYears.length})
                    </div>
                    {updateYears.length > 0 && (
                      <div className="text-explorer-text-muted mt-1">
                        {updateYears.map(yearId => {
                          const year = targetYears.find(y => y.id === yearId);
                          return year?.year;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                {updateYears.length > 0 && !copyOptions.allowOverwrite && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Enable "Allow Overwrite" to update existing configurations
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Copying...
                </>
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
