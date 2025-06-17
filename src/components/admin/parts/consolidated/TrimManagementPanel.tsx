
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EnhancedConfigurationForm from "./EnhancedConfigurationForm";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [deletingConfig, setDeletingConfig] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfiguration = async () => {
    if (!deletingConfig) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('model_configurations')
        .delete()
        .eq('id', deletingConfig.id);

      if (error) throw error;

      toast({
        title: "Configuration Deleted",
        description: `${deletingConfig.name} has been deleted successfully.`
      });

      // Clear selection if the deleted config was selected
      if (selectedConfig === deletingConfig.id) {
        onConfigSelect("");
      }

      setDeletingConfig(null);
      // Trigger refresh by calling onConfigSelect with current selection
      onConfigSelect(selectedConfig || "");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message || "Failed to delete configuration."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getCompletionStatus = (config: any) => {
    const requiredComponents = ['engine_id', 'brake_system_id', 'frame_id', 'suspension_id', 'wheel_id'];
    const completed = requiredComponents.filter(comp => config[comp]).length;
    const total = requiredComponents.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };

  const handleFormSuccess = () => {
    // Refresh configurations by triggering a re-fetch
    onConfigSelect(selectedConfig || "");
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
              onClick={() => setShowCreateForm(true)}
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
                  <div
                    key={config.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedConfig === config.id
                        ? "bg-accent-teal/20 border-accent-teal"
                        : "bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => onConfigSelect(config.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-explorer-text">
                            {config.name || "Standard"}
                          </div>
                          <div className="flex items-center gap-2">
                            {config.is_default && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                            <div className="text-xs text-explorer-text">
                              {status.percentage}%
                            </div>
                          </div>
                        </div>
                        
                        {config.trim_level && (
                          <div className="text-sm text-explorer-text-muted mb-1">
                            {config.trim_level}
                          </div>
                        )}
                        
                        <div className="w-full bg-explorer-chrome/30 rounded-full h-1 mb-2">
                          <div
                            className={`h-1 rounded-full transition-all ${
                              status.percentage >= 80 ? 'bg-green-400' :
                              status.percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${status.percentage}%` }}
                          />
                        </div>
                        
                        <div className="text-xs text-explorer-text-muted">
                          {status.completed}/{status.total} components assigned
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingConfig(config);
                          }}
                          className="h-8 w-8 p-0 text-explorer-text hover:bg-explorer-chrome/20"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingConfig(config);
                          }}
                          className="h-8 w-8 p-0 text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-4">No configurations found</p>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Configuration Form */}
      <EnhancedConfigurationForm
        open={showCreateForm || !!editingConfig}
        onClose={() => {
          setShowCreateForm(false);
          setEditingConfig(null);
        }}
        selectedYearData={selectedYearData}
        configurationToEdit={editingConfig}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingConfig} onOpenChange={() => setDeletingConfig(null)}>
        <AlertDialogContent className="bg-explorer-card border-explorer-chrome/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-explorer-text">Delete Configuration</AlertDialogTitle>
            <AlertDialogDescription className="text-explorer-text-muted">
              Are you sure you want to delete the "{deletingConfig?.name}" configuration? 
              This action cannot be undone and will remove all associated component assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfiguration}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Configuration"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TrimManagementPanel;
