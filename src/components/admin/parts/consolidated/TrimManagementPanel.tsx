
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Plus, Copy, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrimManagementPanelProps {
  configurations: any[];
  selectedConfig: string | null;
  selectedYearData?: any;
  onConfigSelect: (configId: string) => void;
  loading: boolean;
}

const TrimManagementPanel: React.FC<TrimManagementPanelProps> = ({
  configurations,
  selectedConfig,
  selectedYearData,
  onConfigSelect,
  loading
}) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");
  const [newTrimLevel, setNewTrimLevel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateConfiguration = async () => {
    if (!newConfigName || !selectedYearData) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('model_configurations')
        .insert({
          model_year_id: selectedYearData.id,
          name: newConfigName,
          trim_level: newTrimLevel || null,
          is_default: configurations.length === 0 // First config becomes default
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Configuration Created",
        description: `${newConfigName} configuration has been created successfully.`
      });

      setShowCreateDialog(false);
      setNewConfigName("");
      setNewTrimLevel("");
      
      // Auto-select the new configuration
      onConfigSelect(data.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.message || "Failed to create configuration."
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getCompletionStatus = (config: any) => {
    const requiredComponents = ['engine_id', 'brake_system_id', 'frame_id', 'suspension_id', 'wheel_id'];
    const completed = requiredComponents.filter(comp => config[comp]).length;
    const total = requiredComponents.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };

  if (!selectedYearData) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">Select a model year to manage configurations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurations
              <Badge variant="secondary">{configurations.length}</Badge>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Config
            </Button>
          </div>
          <p className="text-sm text-explorer-text-muted">
            {selectedYearData.year} Model Year
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-explorer-chrome/20 rounded animate-pulse" />
              ))}
            </div>
          ) : configurations.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {configurations.map((config) => {
                const status = getCompletionStatus(config);
                return (
                  <Button
                    key={config.id}
                    variant={selectedConfig === config.id ? "default" : "ghost"}
                    onClick={() => onConfigSelect(config.id)}
                    className={`w-full justify-start text-left h-auto p-3 ${
                      selectedConfig === config.id
                        ? "bg-accent-teal text-black hover:bg-accent-teal/80"
                        : "text-explorer-text hover:bg-explorer-chrome/20"
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">
                          {config.name || "Standard"}
                        </div>
                        <div className="flex items-center gap-2">
                          {config.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                          <div className="text-xs">
                            {status.percentage}%
                          </div>
                        </div>
                      </div>
                      
                      {config.trim_level && (
                        <div className="text-sm opacity-70 mb-1">
                          {config.trim_level}
                        </div>
                      )}
                      
                      <div className="w-full bg-explorer-chrome/30 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all ${
                            status.percentage >= 80 ? 'bg-green-400' :
                            status.percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${status.percentage}%` }}
                        />
                      </div>
                      
                      <div className="text-xs opacity-60 mt-1">
                        {status.completed}/{status.total} components assigned
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-4">No configurations found</p>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Configuration Name</label>
              <Input
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
                placeholder="Standard, Sport, Touring, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trim Level (Optional)</label>
              <Input
                value={newTrimLevel}
                onChange={(e) => setNewTrimLevel(e.target.value)}
                placeholder="Base, Premium, Limited, etc."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateConfiguration}
                disabled={!newConfigName || isCreating}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {isCreating ? "Creating..." : "Create Configuration"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrimManagementPanel;
