
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAllMotorcycleModels } from "@/services/modelService";
import { supabase } from "@/integrations/supabase/client";
import AdminModelDialog from "@/components/admin/models/AdminModelDialog";
import AdminModelYearDialog from "@/components/admin/models/AdminModelYearDialog";
import AdminConfigurationDialog from "@/components/admin/models/AdminConfigurationDialog";

const AdminMotorcycleModels = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [selectedModelForYear, setSelectedModelForYear] = useState(null);
  const [selectedYearForConfig, setSelectedYearForConfig] = useState(null);
  const [expandedModels, setExpandedModels] = useState(new Set());

  // Fetch motorcycle models with their years and configurations
  const { data: models, isLoading, refetch } = useQuery({
    queryKey: ["admin-motorcycle-models"],
    queryFn: getAllMotorcycleModels
  });

  const toggleModelExpansion = (modelId) => {
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
    if (!confirm(`Are you sure you want to delete ${model.name}? This will remove all associated years and configurations.`)) {
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
        description: `${model.name} has been removed.`,
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Motorcycle Models</h1>
          <p className="text-muted-foreground">
            Manage motorcycle models, years, and configurations in the normalized schema.
          </p>
        </div>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={handleCreateModel}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      {models && models.length > 0 ? (
        <div className="space-y-4">
          {models.map((model) => (
            <Card key={model.id} className="border border-border/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle 
                        className="cursor-pointer hover:text-accent-teal"
                        onClick={() => toggleModelExpansion(model.id)}
                      >
                        {model.brand?.name} {model.name}
                      </CardTitle>
                      <Badge variant="outline">{model.type}</Badge>
                      <Badge variant={model.production_status === 'active' ? 'default' : 'secondary'}>
                        {model.production_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {model.production_start_year}
                      {model.production_end_year && ` - ${model.production_end_year}`}
                    </p>
                    {model.base_description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {model.base_description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAddYear(model)}
                    >
                      Add Year
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditModel(model)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteModel(model)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedModels.has(model.id) && model.years && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Model Years & Configurations</h4>
                    {model.years.map((year) => (
                      <div key={year.id} className="border rounded-lg p-3 bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{year.year}</span>
                              {year.msrp_usd && (
                                <Badge variant="outline">${year.msrp_usd.toLocaleString()}</Badge>
                              )}
                            </div>
                            {year.changes && (
                              <p className="text-xs text-muted-foreground mt-1">{year.changes}</p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddConfiguration(year)}
                          >
                            Add Config
                          </Button>
                        </div>

                        {year.configurations && year.configurations.length > 0 && (
                          <div className="space-y-2">
                            {year.configurations.map((config) => (
                              <div key={config.id} className="flex justify-between items-center p-2 bg-background rounded border">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{config.name}</span>
                                  {config.is_default && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                  {config.trim_level && (
                                    <Badge variant="outline" className="text-xs">{config.trim_level}</Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {config.engine?.displacement_cc}cc | {config.weight_kg}kg
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No motorcycle models found. Add your first model to get started.</p>
        </div>
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
