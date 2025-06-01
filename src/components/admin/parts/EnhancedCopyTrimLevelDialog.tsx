
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, X, Eye, AlertTriangle, RefreshCw, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { copyConfigurationToMultipleYears, getYearsWithExistingConfigs } from "@/services/models/configurationService";
import { calculateFormCompleteness } from "./trim-level-editor/validationEnhanced";

interface EnhancedCopyTrimLevelDialogProps {
  open: boolean;
  onClose: () => void;
  sourceConfiguration: Configuration;
  availableYears: any[];
  onSuccess: () => void;
}

interface CopyOptions {
  basicInfo: boolean;
  components: boolean;
  dimensions: boolean;
  allowOverwrite: boolean;
  granularOptions: {
    name: boolean;
    marketRegion: boolean;
    pricePremium: boolean;
    engine: boolean;
    brakes: boolean;
    frame: boolean;
    suspension: boolean;
    wheels: boolean;
    seatHeight: boolean;
    weight: boolean;
    wheelbase: boolean;
    fuelCapacity: boolean;
    groundClearance: boolean;
  };
}

const EnhancedCopyTrimLevelDialog = ({
  open,
  onClose,
  sourceConfiguration,
  availableYears,
  onSuccess
}: EnhancedCopyTrimLevelDialogProps) => {
  const { toast } = useToast();
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [copying, setCopying] = useState(false);
  const [activeTab, setActiveTab] = useState("quick");
  const [showPreview, setShowPreview] = useState(false);
  const [yearsWithExisting, setYearsWithExisting] = useState<Set<string>>(new Set());

  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
    basicInfo: true,
    components: true,
    dimensions: true,
    allowOverwrite: false,
    granularOptions: {
      name: true,
      marketRegion: true,
      pricePremium: true,
      engine: true,
      brakes: true,
      frame: true,
      suspension: true,
      wheels: true,
      seatHeight: true,
      weight: true,
      wheelbase: true,
      fuelCapacity: true,
      groundClearance: true,
    }
  });

  const completeness = calculateFormCompleteness(sourceConfiguration);

  // Load existing configurations when dialog opens
  useEffect(() => {
    if (open && sourceConfiguration.name) {
      loadExistingConfigs();
    }
  }, [open, sourceConfiguration.name, availableYears]);

  const loadExistingConfigs = async () => {
    if (!sourceConfiguration.name || availableYears.length === 0) return;
    
    try {
      // Get the motorcycle ID from the first available year
      const firstYear = availableYears[0];
      if (firstYear?.motorcycle_id) {
        const existing = await getYearsWithExistingConfigs(firstYear.motorcycle_id, sourceConfiguration.name);
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

  const handleQuickOptionChange = (option: keyof Pick<CopyOptions, 'basicInfo' | 'components' | 'dimensions' | 'allowOverwrite'>, checked: boolean) => {
    setCopyOptions(prev => ({ ...prev, [option]: checked }));
  };

  const handleGranularOptionChange = (option: keyof CopyOptions['granularOptions'], checked: boolean) => {
    setCopyOptions(prev => ({
      ...prev,
      granularOptions: { ...prev.granularOptions, [option]: checked }
    }));
  };

  const getSelectedFieldsCount = () => {
    if (activeTab === "quick") {
      let count = 0;
      if (copyOptions.basicInfo) count += 3; // name, market region, price
      if (copyOptions.components) count += 5; // engine, brakes, frame, suspension, wheels
      if (copyOptions.dimensions) count += 5; // seat height, weight, wheelbase, fuel, ground clearance
      return count;
    } else {
      return Object.values(copyOptions.granularOptions).filter(Boolean).length;
    }
  };

  const getYearActions = () => {
    const actions = {
      create: selectedYears.filter(yearId => !yearsWithExisting.has(yearId)),
      update: selectedYears.filter(yearId => yearsWithExisting.has(yearId))
    };
    return actions;
  };

  const handleCopy = async () => {
    if (selectedYears.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one year to copy to."
      });
      return;
    }

    const actions = getYearActions();
    if (actions.update.length > 0 && !copyOptions.allowOverwrite) {
      toast({
        variant: "destructive",
        title: "Overwrite Required",
        description: `${actions.update.length} year(s) have existing configurations. Enable "Allow Overwrite" to update them.`
      });
      return;
    }

    setCopying(true);
    try {
      const options = activeTab === "quick" 
        ? {
            copyBasicInfo: copyOptions.basicInfo,
            copyComponents: copyOptions.components,
            copyDimensions: copyOptions.dimensions,
            allowOverwrite: copyOptions.allowOverwrite
          }
        : {
            copyBasicInfo: copyOptions.granularOptions.name || copyOptions.granularOptions.marketRegion || copyOptions.granularOptions.pricePremium,
            copyComponents: copyOptions.granularOptions.engine || copyOptions.granularOptions.brakes || copyOptions.granularOptions.frame || copyOptions.granularOptions.suspension || copyOptions.granularOptions.wheels,
            copyDimensions: copyOptions.granularOptions.seatHeight || copyOptions.granularOptions.weight || copyOptions.granularOptions.wheelbase || copyOptions.granularOptions.fuelCapacity || copyOptions.granularOptions.groundClearance,
            allowOverwrite: copyOptions.allowOverwrite
          };

      const results = await copyConfigurationToMultipleYears(
        sourceConfiguration.id,
        selectedYears,
        options
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      const created = results.filter(r => r.success && r.action === 'created').length;
      const updated = results.filter(r => r.success && r.action === 'updated').length;

      if (successful > 0) {
        let message = `Successfully processed ${successful} year${successful > 1 ? 's' : ''}`;
        if (created > 0 && updated > 0) {
          message += ` (${created} created, ${updated} updated)`;
        } else if (created > 0) {
          message += ` (${created} created)`;
        } else if (updated > 0) {
          message += ` (${updated} updated)`;
        }
        if (failed > 0) {
          message += `, ${failed} failed`;
        }

        toast({
          title: "Success!",
          description: message
        });
        onSuccess();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy trim level to any years."
        });
      }
    } catch (error: any) {
      console.error("Error copying trim level:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to copy trim level: ${error.message}`
      });
    } finally {
      setCopying(false);
    }
  };

  const actions = getYearActions();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copy "{sourceConfiguration.name}" to Other Years
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Configuration Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Source Configuration</CardTitle>
              <CardDescription>
                Completeness: {completeness.overall}% • {getSelectedFieldsCount()} fields selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Basic Info: {completeness.basicInfo}%</div>
                  <div className="text-muted-foreground">Name, market region, pricing</div>
                </div>
                <div>
                  <div className="font-medium">Components: {completeness.components}%</div>
                  <div className="text-muted-foreground">Engine, brakes, frame, etc.</div>
                </div>
                <div>
                  <div className="font-medium">Dimensions: {completeness.dimensions}%</div>
                  <div className="text-muted-foreground">Physical measurements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Copy Options */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Copy</TabsTrigger>
              <TabsTrigger value="granular">Field Selection</TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">What to copy:</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyBasicInfo"
                      checked={copyOptions.basicInfo}
                      onCheckedChange={(checked) => handleQuickOptionChange('basicInfo', !!checked)}
                    />
                    <Label htmlFor="copyBasicInfo" className="flex-1">
                      Basic Information
                      <span className="text-sm text-muted-foreground block">Name, market region, price premium</span>
                    </Label>
                    <Badge variant="secondary">{completeness.basicInfo}%</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyComponents"
                      checked={copyOptions.components}
                      onCheckedChange={(checked) => handleQuickOptionChange('components', !!checked)}
                    />
                    <Label htmlFor="copyComponents" className="flex-1">
                      Components
                      <span className="text-sm text-muted-foreground block">Engine, brakes, frame, suspension, wheels</span>
                    </Label>
                    <Badge variant="secondary">{completeness.components}%</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyDimensions"
                      checked={copyOptions.dimensions}
                      onCheckedChange={(checked) => handleQuickOptionChange('dimensions', !!checked)}
                    />
                    <Label htmlFor="copyDimensions" className="flex-1">
                      Dimensions
                      <span className="text-sm text-muted-foreground block">Weight, height, wheelbase, fuel capacity</span>
                    </Label>
                    <Badge variant="secondary">{completeness.dimensions}%</Badge>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/30">
                    <Checkbox
                      id="allowOverwrite"
                      checked={copyOptions.allowOverwrite}
                      onCheckedChange={(checked) => handleQuickOptionChange('allowOverwrite', !!checked)}
                    />
                    <Label htmlFor="allowOverwrite" className="flex-1">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Allow Overwrite
                      </div>
                      <span className="text-sm text-muted-foreground block">Update existing configurations with the same name</span>
                    </Label>
                    {yearsWithExisting.size > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {yearsWithExisting.size} existing
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="granular" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Basic Information</Label>
                    {[
                      { key: 'name', label: 'Name', value: sourceConfiguration.name },
                      { key: 'marketRegion', label: 'Market Region', value: sourceConfiguration.market_region },
                      { key: 'pricePremium', label: 'Price Premium', value: sourceConfiguration.price_premium_usd }
                    ].map(({ key, label, value }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={copyOptions.granularOptions[key as keyof CopyOptions['granularOptions']]}
                          onCheckedChange={(checked) => handleGranularOptionChange(key as keyof CopyOptions['granularOptions'], !!checked)}
                        />
                        <Label htmlFor={key} className="flex-1">
                          {label}
                          {value && <span className="text-xs text-muted-foreground block">{value}</span>}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Components & Dimensions</Label>
                    {[
                      { key: 'engine', label: 'Engine' },
                      { key: 'brakes', label: 'Brake System' },
                      { key: 'frame', label: 'Frame' },
                      { key: 'suspension', label: 'Suspension' },
                      { key: 'wheels', label: 'Wheels' },
                      { key: 'seatHeight', label: 'Seat Height' },
                      { key: 'weight', label: 'Weight' },
                      { key: 'wheelbase', label: 'Wheelbase' },
                      { key: 'fuelCapacity', label: 'Fuel Capacity' },
                      { key: 'groundClearance', label: 'Ground Clearance' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={copyOptions.granularOptions[key as keyof CopyOptions['granularOptions']]}
                          onCheckedChange={(checked) => handleGranularOptionChange(key as keyof CopyOptions['granularOptions'], !!checked)}
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/30">
                  <Checkbox
                    id="allowOverwriteGranular"
                    checked={copyOptions.allowOverwrite}
                    onCheckedChange={(checked) => handleQuickOptionChange('allowOverwrite', !!checked)}
                  />
                  <Label htmlFor="allowOverwriteGranular" className="flex-1">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Allow Overwrite
                    </div>
                    <span className="text-sm text-muted-foreground block">Update existing configurations with the same name</span>
                  </Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Target Years Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Copy to years:</Label>
            {availableYears.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No other years available for this motorcycle.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                {availableYears.map((year) => {
                  const hasExisting = yearsWithExisting.has(year.id);
                  const isSelected = selectedYears.includes(year.id);
                  
                  return (
                    <div
                      key={year.id}
                      className={`flex items-center space-x-2 p-2 border rounded hover:bg-muted cursor-pointer ${
                        hasExisting ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'
                      } ${isSelected ? 'ring-2 ring-accent-teal' : ''}`}
                      onClick={() => handleYearToggle(year.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleYearToggle(year.id)}
                      />
                      <Label className="cursor-pointer flex-1">
                        {year.year}
                        {year.marketing_tagline && (
                          <span className="text-xs text-muted-foreground block">
                            {year.marketing_tagline}
                          </span>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {hasExisting ? (
                            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Will Update
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                              <Plus className="h-3 w-3 mr-1" />
                              Will Create
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions Summary */}
          {selectedYears.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Action Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 font-medium text-green-600">
                      <Plus className="h-4 w-4" />
                      Create New ({actions.create.length})
                    </div>
                    {actions.create.length > 0 && (
                      <div className="text-muted-foreground mt-1">
                        {actions.create.map(yearId => {
                          const year = availableYears.find(y => y.id === yearId);
                          return year?.year;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium text-orange-600">
                      <RefreshCw className="h-4 w-4" />
                      Update Existing ({actions.update.length})
                    </div>
                    {actions.update.length > 0 && (
                      <div className="text-muted-foreground mt-1">
                        {actions.update.map(yearId => {
                          const year = availableYears.find(y => y.id === yearId);
                          return year?.year;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                {actions.update.length > 0 && !copyOptions.allowOverwrite && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Enable "Allow Overwrite" to update existing configurations
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={copying}>
                Cancel
              </Button>
              <Button
                onClick={handleCopy}
                disabled={copying || selectedYears.length === 0 || getSelectedFieldsCount() === 0}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {copying ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Process {selectedYears.length} Year{selectedYears.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operation Preview</CardTitle>
                <CardDescription>
                  Fields to copy: {getSelectedFieldsCount()} • Years selected: {selectedYears.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div><strong>Source:</strong> {sourceConfiguration.name}</div>
                  <div><strong>Actions:</strong> {actions.create.length} create, {actions.update.length} update</div>
                  <div><strong>Copy Mode:</strong> {activeTab === 'quick' ? 'Quick Copy' : 'Field Selection'}</div>
                  <div><strong>Overwrite Enabled:</strong> {copyOptions.allowOverwrite ? 'Yes' : 'No'}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCopyTrimLevelDialog;
