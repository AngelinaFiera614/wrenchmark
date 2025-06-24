
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BulkAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  models: any[];
  onSuccess: () => void;
}

const BulkAssignmentDialog: React.FC<BulkAssignmentDialogProps> = ({
  open,
  onClose,
  models,
  onSuccess
}) => {
  const { toast } = useToast();
  const [selectedComponentType, setSelectedComponentType] = useState<string>("");
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available components based on selected type
  const { data: components = [] } = useQuery({
    queryKey: ['bulk-components', selectedComponentType],
    queryFn: async () => {
      if (!selectedComponentType) return [];
      
      const tableMap: Record<string, string> = {
        engine: 'engines',
        brake_system: 'brake_systems',
        frame: 'frames',
        suspension: 'suspensions',
        wheel: 'wheels'
      };
      
      const tableName = tableMap[selectedComponentType];
      if (!tableName) return [];
      
      const { data, error } = await supabase
        .from(tableName)
        .select('id, name, type, displacement_cc, front_type, rear_type')
        .eq('is_draft', false)
        .limit(50);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedComponentType
  });

  const handleBulkAssign = async () => {
    if (!selectedComponentType || !selectedComponentId || selectedModels.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Selection",
        description: "Please select component type, component, and models."
      });
      return;
    }

    setLoading(true);
    try {
      const assignments = selectedModels.map(modelId => ({
        model_id: modelId,
        component_type: selectedComponentType,
        component_id: selectedComponentId,
        assignment_type: 'standard',
        is_default: true
      }));

      const { error } = await supabase
        .from('model_component_assignments')
        .upsert(assignments, {
          onConflict: 'model_id,component_type,component_id'
        });

      if (error) throw error;

      toast({
        title: "Bulk Assignment Complete",
        description: `${selectedComponentType.replace('_', ' ')} assigned to ${selectedModels.length} models.`
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Bulk Assignment Failed",
        description: error.message || "Failed to assign components."
      });
    } finally {
      setLoading(false);
    }
  };

  const componentTypes = [
    { key: 'engine', label: 'Engine' },
    { key: 'brake_system', label: 'Brake System' },
    { key: 'frame', label: 'Frame' },
    { key: 'suspension', label: 'Suspension' },
    { key: 'wheel', label: 'Wheels' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Bulk Component Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Bulk Assignment
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Assign the same component to multiple models at once. This will set the component as the default for all selected models.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle>Component Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Component Type</label>
                  <Select value={selectedComponentType} onValueChange={setSelectedComponentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map(type => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedComponentType && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Specific Component</label>
                    <Select value={selectedComponentId} onValueChange={setSelectedComponentId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        {components.map((component: any) => (
                          <SelectItem key={component.id} value={component.id}>
                            {component.name || component.type || `${component.displacement_cc}cc`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle>Model Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {models.map(model => (
                    <div 
                      key={model.id}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        selectedModels.includes(model.id)
                          ? 'bg-accent-teal/20 border-accent-teal'
                          : 'border-explorer-chrome/30 hover:border-explorer-chrome/50'
                      }`}
                      onClick={() => {
                        setSelectedModels(prev => 
                          prev.includes(model.id)
                            ? prev.filter(id => id !== model.id)
                            : [...prev, model.id]
                        );
                      }}
                    >
                      <div className="font-medium text-sm">
                        {model.brands?.[0]?.name || 'Unknown'} {model.name}
                      </div>
                      <div className="text-xs text-explorer-text-muted">
                        {model.type} • {model.production_start_year}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-explorer-chrome/30">
                  <Badge variant="outline">
                    {selectedModels.length} models selected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t border-explorer-chrome/30">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkAssign} 
            disabled={loading || !selectedComponentType || !selectedComponentId || selectedModels.length === 0}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <Settings className="mr-2 h-4 w-4" />
            Assign to {selectedModels.length} Models
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignmentDialog;
