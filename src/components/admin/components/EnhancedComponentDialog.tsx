
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Edit, Trash2, Info, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { canDeleteComponent, ComponentUsageStats } from "@/services/modelComponentService";

interface EnhancedComponentDialogProps {
  open: boolean;
  onClose: () => void;
  componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels";
  mode: "view" | "create" | "edit";
  component?: any;
  onSave: (componentData: any) => Promise<void>;
  onDelete?: (componentId: string) => Promise<void>;
}

const EnhancedComponentDialog = ({
  open,
  onClose,
  componentType,
  mode,
  component,
  onSave,
  onDelete
}: EnhancedComponentDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    usageCount: number;
    models: string[];
    trims: string[];
  }>({ usageCount: 0, models: [], trims: [] });
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (open && component && (mode === "edit" || mode === "view")) {
      checkDeletability();
    }
  }, [open, component, mode]);

  const checkDeletability = async () => {
    if (!component) return;
    
    try {
      const componentTypeMap = {
        brakes: "brake_system",
        wheels: "wheel"
      };
      
      const dbComponentType = componentTypeMap[componentType as keyof typeof componentTypeMap] || componentType;
      const result = await canDeleteComponent(dbComponentType, component.id);
      
      setCanDelete(result.canDelete);
      setUsageInfo({
        usageCount: result.usageCount,
        models: result.models,
        trims: result.trims
      });
    } catch (error) {
      console.error("Error checking component deletability:", error);
    }
  };

  const handleDelete = async () => {
    if (!component || !onDelete) return;
    
    setDeleteLoading(true);
    try {
      await onDelete(component.id);
      toast({
        title: "Component Deleted",
        description: `${getComponentDisplayName()} has been deleted successfully.`
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message || "Failed to delete component."
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getComponentDisplayName = () => {
    const displayNames = {
      engine: "Engine",
      brakes: "Brake System",
      frame: "Frame",
      suspension: "Suspension",
      wheels: "Wheels"
    };
    return displayNames[componentType];
  };

  const renderComponentForm = () => {
    // This would render the specific component form based on type
    // For now, returning a placeholder
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-explorer-text-muted">
          Component form for {getComponentDisplayName()} would go here
        </div>
      </div>
    );
  };

  const renderUsageInfo = () => {
    if (mode === "create") return null;
    
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Info className="h-5 w-5" />
            Usage Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-explorer-text">Total Usage</div>
              <div className="text-2xl font-bold text-accent-teal">{usageInfo.usageCount}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-explorer-text">Status</div>
              <Badge variant={canDelete ? "secondary" : "destructive"}>
                {canDelete ? "Can Delete" : "In Use"}
              </Badge>
            </div>
          </div>
          
          {usageInfo.models.length > 0 && (
            <div>
              <div className="text-sm font-medium text-explorer-text mb-2">Used by Models:</div>
              <div className="flex flex-wrap gap-1">
                {usageInfo.models.map((model, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {usageInfo.trims.length > 0 && (
            <div>
              <div className="text-sm font-medium text-explorer-text mb-2">Used by Trim Levels:</div>
              <div className="flex flex-wrap gap-1">
                {usageInfo.trims.map((trim, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {trim}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getDialogTitle = () => {
    const actionMap = {
      create: "Create",
      edit: "Edit",
      view: "View"
    };
    return `${actionMap[mode]} ${getComponentDisplayName()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {getDialogTitle()}
            {component && (
              <Badge variant="outline" className="ml-2">
                {component.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="usage" disabled={mode === "create"}>Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            {renderComponentForm()}
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-6">
            {renderUsageInfo()}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t border-explorer-chrome/30">
          <div>
            {mode === "edit" && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!canDelete || deleteLoading}
                className="flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Component
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {mode !== "view" && (
              <Button
                onClick={() => {/* Handle save */}}
                disabled={loading}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedComponentDialog;
