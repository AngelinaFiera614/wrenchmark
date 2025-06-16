
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ComponentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  componentType: string | null;
  configurationId?: string;
  currentComponentId?: string;
  onComponentAssigned: () => void;
}

const ComponentSelectionDialog: React.FC<ComponentSelectionDialogProps> = ({
  open,
  onClose,
  componentType,
  configurationId,
  currentComponentId,
  onComponentAssigned
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch components based on type
  const { data: components = [], isLoading } = useQuery({
    queryKey: [componentType, 'components'],
    queryFn: async () => {
      if (!componentType) return [];
      
      const tableName = componentType === 'brake_system' ? 'brake_systems' : `${componentType}s`;
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!componentType && open
  });

  const filteredComponents = components.filter(component =>
    component.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedComponentId || !configurationId || !componentType) return;

    setIsAssigning(true);
    try {
      const updateField = `${componentType}_id`;
      const { error } = await supabase
        .from('model_configurations')
        .update({ [updateField]: selectedComponentId })
        .eq('id', configurationId);

      if (error) throw error;

      toast({
        title: "Component Assigned",
        description: "Component has been successfully assigned to the configuration."
      });

      onComponentAssigned();
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "Failed to assign component."
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  if (!componentType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Select {componentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {currentComponentId && (
              <Badge variant="outline">Currently Assigned</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
              <Input
                placeholder={`Search ${componentType}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-8">Loading components...</div>
              ) : filteredComponents.length > 0 ? (
                filteredComponents.map((component) => (
                  <div
                    key={component.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedComponentId === component.id
                        ? 'border-accent-teal bg-accent-teal/10'
                        : 'border-explorer-chrome/30 hover:bg-explorer-chrome/10'
                    }`}
                    onClick={() => setSelectedComponentId(component.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{component.name}</div>
                        {component.displacement_cc && (
                          <div className="text-sm text-explorer-text-muted">
                            {component.displacement_cc}cc
                          </div>
                        )}
                        {component.type && (
                          <div className="text-sm text-explorer-text-muted">
                            Type: {component.type}
                          </div>
                        )}
                      </div>
                      {selectedComponentId === component.id && (
                        <Check className="h-5 w-5 text-accent-teal" />
                      )}
                      {currentComponentId === component.id && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-explorer-text-muted mx-auto mb-2" />
                  <p className="text-explorer-text-muted">No components found</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateNew}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create New {componentType.replace('_', ' ')}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="text-center py-8">
              <Plus className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
              <p className="text-explorer-text-muted">
                Component creation interface coming soon
              </p>
              <p className="text-sm text-explorer-text-muted mt-2">
                This will allow you to create new {componentType}s directly from here
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedComponentId || isAssigning}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            {isAssigning ? "Assigning..." : "Assign Component"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentSelectionDialog;
