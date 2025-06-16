
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Copy, Download, Upload, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BulkOperationsPanelProps {
  configurations: any[];
  selectedConfigs: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onBulkOperation: (operation: string, configs: any[]) => void;
  isVisible: boolean;
  onClose: () => void;
}

const BulkOperationsPanel: React.FC<BulkOperationsPanelProps> = ({
  configurations,
  selectedConfigs,
  onSelectionChange,
  onBulkOperation,
  isVisible,
  onClose
}) => {
  const { toast } = useToast();
  const [operation, setOperation] = useState("");
  const [targetComponent, setTargetComponent] = useState("");
  const [targetComponentId, setTargetComponentId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = () => {
    if (selectedConfigs.size === configurations.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(configurations.map(c => c.id)));
    }
  };

  const handleConfigSelect = (configId: string, checked: boolean) => {
    const newSelection = new Set(selectedConfigs);
    if (checked) {
      newSelection.add(configId);
    } else {
      newSelection.delete(configId);
    }
    onSelectionChange(newSelection);
  };

  const handleBulkAssignComponent = async () => {
    if (!targetComponent || !targetComponentId || selectedConfigs.size === 0) return;

    setIsProcessing(true);
    try {
      const updateField = `${targetComponent}_id`;
      const configIds = Array.from(selectedConfigs);

      const { error } = await supabase
        .from('model_configurations')
        .update({ [updateField]: targetComponentId })
        .in('id', configIds);

      if (error) throw error;

      toast({
        title: "Bulk Assignment Complete",
        description: `${targetComponent} assigned to ${configIds.length} configurations.`
      });

      onBulkOperation('assign_component', configurations.filter(c => selectedConfigs.has(c.id)));
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Bulk Assignment Failed",
        description: error.message || "Failed to assign components."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyConfigurations = async () => {
    if (selectedConfigs.size === 0) return;

    setIsProcessing(true);
    try {
      const configIds = Array.from(selectedConfigs);
      const selectedConfigData = configurations.filter(c => selectedConfigs.has(c.id));

      // This would typically open a dialog to select target year/model
      toast({
        title: "Copy Configuration",
        description: "Copy functionality will be implemented in the next phase."
      });

      onBulkOperation('copy_configurations', selectedConfigData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: error.message || "Failed to copy configurations."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportData = () => {
    const selectedConfigData = configurations.filter(c => selectedConfigs.has(c.id));
    const dataStr = JSON.stringify(selectedConfigData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `configurations_export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${selectedConfigs.size} configurations.`
    });
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Bulk Operations
            <Badge variant="secondary">{selectedConfigs.size} selected</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">Select Items</TabsTrigger>
            <TabsTrigger value="assign">Assign Components</TabsTrigger>
            <TabsTrigger value="copy">Copy & Export</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedConfigs.size === configurations.length && configurations.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label className="text-sm font-medium">Select All</label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectionChange(new Set())}
              >
                Clear Selection
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {configurations.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center gap-3 p-3 border border-explorer-chrome/30 rounded-lg"
                >
                  <Checkbox
                    checked={selectedConfigs.has(config.id)}
                    onCheckedChange={(checked) => handleConfigSelect(config.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{config.name || "Standard"}</div>
                    <div className="text-sm text-explorer-text-muted">
                      {config.trim_level && `${config.trim_level} • `}
                      Components: {[
                        config.engine_id && 'Engine',
                        config.brake_system_id && 'Brakes',
                        config.frame_id && 'Frame',
                        config.suspension_id && 'Suspension',
                        config.wheel_id && 'Wheels'
                      ].filter(Boolean).length}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assign" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Component Type</label>
                <Select value={targetComponent} onValueChange={setTargetComponent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engine">Engine</SelectItem>
                    <SelectItem value="brake_system">Brake System</SelectItem>
                    <SelectItem value="frame">Frame</SelectItem>
                    <SelectItem value="suspension">Suspension</SelectItem>
                    <SelectItem value="wheel">Wheels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Component</label>
                <Select value={targetComponentId} onValueChange={setTargetComponentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specific component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">Component selection coming soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleBulkAssignComponent}
                disabled={!targetComponent || !targetComponentId || selectedConfigs.size === 0 || isProcessing}
                className="w-full bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {isProcessing ? "Assigning..." : `Assign to ${selectedConfigs.size} Configurations`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="copy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleCopyConfigurations}
                disabled={selectedConfigs.size === 0 || isProcessing}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Copy className="h-4 w-4" />
                Copy Configurations
              </Button>

              <Button
                onClick={handleExportData}
                disabled={selectedConfigs.size === 0}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>

              <Button
                disabled
                className="flex items-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                Import Data (Coming Soon)
              </Button>

              <Button
                disabled
                className="flex items-center gap-2"
                variant="outline"
              >
                <CheckSquare className="h-4 w-4" />
                Validate Data (Coming Soon)
              </Button>
            </div>

            <div className="text-sm text-explorer-text-muted">
              <p><strong>Copy:</strong> Duplicate selected configurations to other model years</p>
              <p><strong>Export:</strong> Download configuration data as JSON</p>
              <p><strong>Import:</strong> Upload configuration data from file</p>
              <p><strong>Validate:</strong> Check data integrity and completeness</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOperationsPanel;
