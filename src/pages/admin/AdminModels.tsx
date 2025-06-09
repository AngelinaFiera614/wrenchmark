
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, FileText, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminModelDialog from "@/components/admin/models/AdminModelDialog";
import EnhancedModelFilters from "@/components/admin/models/EnhancedModelFilters";
import EnhancedModelStats from "@/components/admin/models/EnhancedModelStats";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { useModelFilters } from "@/hooks/useModelFilters";

const AdminModels = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Fetch motorcycle models
  const { data: models = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-motorcycle-models"],
    queryFn: fetchAllMotorcycleModels,
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch brands for filter dropdown
  const { data: brands = [] } = useQuery({
    queryKey: ["brands-for-filter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Use the enhanced filtering hook
  const {
    filters,
    sort,
    filteredAndSortedModels,
    updateFilter,
    setSort,
    clearFilters,
    getActiveFiltersCount,
    getUniqueCategories
  } = useModelFilters(models);

  const getBrandName = (model: any) => {
    return model.brand?.name || 'Unknown Brand';
  };

  const handleCreateModel = () => {
    setEditModel(null);
    setIsCreateModelOpen(true);
  };

  const handleEditModel = (model) => {
    setEditModel(model);
    setIsCreateModelOpen(true);
  };

  const handleDeleteModel = async (model) => {
    const brandName = getBrandName(model);
    if (!confirm(`Are you sure you want to delete ${brandName} ${model.name}? This action cannot be undone.`)) {
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
        description: `${brandName} ${model.name} has been removed.`,
      });

      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete model. Please try again.",
      });
    }
  };

  const handleTogglePublishStatus = async (model) => {
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: !model.is_draft })
        .eq('id', model.id);

      if (error) throw error;

      const brandName = getBrandName(model);
      toast({
        title: model.is_draft ? "Model Published" : "Model Unpublished",
        description: `${brandName} ${model.name} has been ${model.is_draft ? 'published' : 'moved to drafts'}.`,
      });
      refetch();
    } catch (error) {
      console.error("Toggle publish error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model status. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateModelOpen(false);
    setEditModel(null);
    if (refreshData) {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  if (error) {
    console.error("Admin models error:", error);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Models</h1>
            <p className="text-explorer-text-muted mt-1">
              Manage motorcycle models with detailed specifications.
            </p>
          </div>
          <Button 
            onClick={handleCreateModel}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Model
          </Button>
        </div>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-red-400 font-medium">
                Failed to load motorcycle models
              </div>
              <div className="text-explorer-text-muted">
                Error: {error.message || 'Unknown error occurred'}
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Models</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage motorcycle models with detailed specifications and configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateModel}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      {/* Enhanced Stats */}
      <EnhancedModelStats 
        models={models} 
        filteredModels={filteredAndSortedModels} 
      />

      {/* Enhanced Filters */}
      <EnhancedModelFilters
        filters={filters}
        sort={sort}
        onFilterChange={updateFilter}
        onSortChange={setSort}
        onClearFilters={clearFilters}
        activeFiltersCount={getActiveFiltersCount()}
        categories={getUniqueCategories()}
        brands={brands}
        isAdvancedOpen={isAdvancedFiltersOpen}
        onAdvancedToggle={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
      />

      {/* Models Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Models ({filteredAndSortedModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedModels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Model</TableHead>
                  <TableHead className="text-explorer-text">Brand</TableHead>
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Years</TableHead>
                  <TableHead className="text-explorer-text">Status</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedModels.map((model) => {
                  const brandName = getBrandName(model);
                  return (
                    <TableRow key={model.id} className="border-explorer-chrome/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {model.default_image_url && (
                            <img 
                              src={model.default_image_url} 
                              alt={model.name}
                              className="w-12 h-8 object-cover rounded border border-explorer-chrome/30"
                            />
                          )}
                          <div>
                            <div className="font-medium text-explorer-text">{model.name}</div>
                            <div className="text-sm text-explorer-text-muted">{model.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-explorer-text">{brandName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30">
                          {model.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-explorer-text">
                        {model.production_start_year}
                        {model.production_end_year && ` - ${model.production_end_year}`}
                      </TableCell>
                      <TableCell>
                        {model.is_draft ? (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            <FileText className="mr-1 h-3 w-3" />
                            Draft
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                            <Eye className="mr-1 h-3 w-3" />
                            Published
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublishStatus(model)}
                            className="h-8 px-2 text-xs"
                          >
                            {model.is_draft ? (
                              <>
                                <Eye className="mr-1 h-3 w-3" />
                                Publish
                              </>
                            ) : (
                              <>
                                <FileText className="mr-1 h-3 w-3" />
                                Unpublish
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditModel(model)}
                            className="h-8 px-2 text-xs"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteModel(model)}
                            className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-explorer-text-muted">
                {getActiveFiltersCount() > 0
                  ? "No models match your filters." 
                  : "No models found. Start by adding your first model."
                }
              </div>
              {getActiveFiltersCount() === 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateModel}
                  className="mt-4"
                >
                  Add Model
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdminModelDialog 
        open={isCreateModelOpen}
        model={editModel}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminModels;
