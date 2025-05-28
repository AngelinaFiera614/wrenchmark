
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAllMotorcycleModels } from "@/services/modelService";
import { supabase } from "@/integrations/supabase/client";
import AdminModelDialog from "@/components/admin/models/AdminModelDialog";
import AdminModelYearDialog from "@/components/admin/models/AdminModelYearDialog";
import AdminConfigurationDialog from "@/components/admin/models/AdminConfigurationDialog";
import ModelsTable from "@/components/admin/models/ModelsTable";

const AdminMotorcycleModels = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [selectedModelForYear, setSelectedModelForYear] = useState(null);
  const [selectedYearForConfig, setSelectedYearForConfig] = useState(null);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set<string>());

  // Fetch motorcycle models with their years and configurations
  const { data: models, isLoading, refetch } = useQuery({
    queryKey: ["admin-motorcycle-models"],
    queryFn: getAllMotorcycleModels
  });

  const toggleModelExpansion = (modelId: string) => {
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(modelId)) {
      newExpanded.delete(modelId);
    } else {
      newExpanded.add(modelId);
    }
    setExpandedModels(newExpanded);
  };

  const handleCreateModel = () => {
    setIsCreateModelOpen(true);
  };

  const handleEditModel = (model) => {
    setEditModel(model);
  };

  const handleAddYear = (model) => {
    setSelectedModelForYear(model);
  };

  const handleAddConfiguration = (year) => {
    setSelectedYearForConfig(year);
  };

  const handleDeleteModel = async (model) => {
    if (!confirm(`Are you sure you want to delete ${model.brand?.name} ${model.name}? This will remove all associated years and configurations.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .delete()
        .eq('id', model.id);

      if (error) throw error;

      toast({
        title: "Model deleted",
        description: `${model.brand?.name} ${model.name} has been removed.`,
      });

      refetch();
    } catch (error) {
      console.error("Error deleting model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete model. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateModelOpen(false);
    setEditModel(null);
    setSelectedModelForYear(null);
    setSelectedYearForConfig(null);
    if (refreshData) {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Motorcycle Models</h1>
          <p className="text-muted-foreground mt-1">
            Manage motorcycle models with years, configurations, and detailed specifications.
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={handleCreateModel}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      {/* Summary Stats */}
      {models && models.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{models.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {models.filter(m => m.production_status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Years</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {models.reduce((total, model) => total + (model.years?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Models Table */}
      {models && models.length > 0 ? (
        <ModelsTable
          models={models}
          onEditModel={handleEditModel}
          onDeleteModel={handleDeleteModel}
          onAddYear={handleAddYear}
          onAddConfiguration={handleAddConfiguration}
          expandedModels={expandedModels}
          onToggleExpanded={toggleModelExpansion}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                No motorcycle models found. Start by adding your first model.
              </div>
              <Button variant="outline" onClick={handleCreateModel}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AdminModelDialog 
        open={isCreateModelOpen || editModel !== null}
        model={editModel}
        onClose={handleDialogClose}
      />

      <AdminModelYearDialog 
        open={selectedModelForYear !== null}
        model={selectedModelForYear}
        onClose={handleDialogClose}
      />

      <AdminConfigurationDialog 
        open={selectedYearForConfig !== null}
        modelYear={selectedYearForConfig}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminMotorcycleModels;
