
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminModelDialog from "@/components/admin/models/AdminModelDialog";
import DeleteConfirmationDialog from "@/components/admin/models/DeleteConfirmationDialog";
import { Link } from "react-router-dom";
import { fetchAllMotorcycleModels, deleteMotorcycleModelCascade } from "@/services/models/modelQueries";

const ModelsTable = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModel, setDeleteModel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch models using the updated query
  const { data: models, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-models"],
    queryFn: fetchAllMotorcycleModels,
  });

  const handleCreateModel = () => {
    setEditModel(null);
    setIsCreateModelOpen(true);
  };

  const handleEditModel = (model) => {
    setEditModel(model);
    setIsCreateModelOpen(true);
  };

  const getBrandName = (model: any) => {
    if (!model.brand) return 'Unknown Brand';
    return model.brand.name || 'Unknown Brand';
  };

  const getProductionStatus = (model: any) => {
    return model.production_status || 'active';
  };

  const handleDeleteClick = (model) => {
    setDeleteModel(model);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModel) return;

    try {
      setIsDeleting(true);
      const success = await deleteMotorcycleModelCascade(deleteModel.id);

      if (success) {
        toast({
          title: "Model deleted",
          description: `${getBrandName(deleteModel)} ${deleteModel.name} and all related data has been removed.`,
        });
        refetch();
        setDeleteModel(null);
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete model. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateModelOpen(false);
    setEditModel(null);
    if (refreshData) {
      refetch();
    }
  };

  // Filter models based on search
  const filteredModels = models?.filter(model => {
    const brandName = getBrandName(model);
    const matchesSearch = !searchTerm || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
            <Input
              placeholder="Search models by name, type or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Models ({filteredModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredModels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Brand</TableHead>
                  <TableHead className="text-explorer-text">Model</TableHead>
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Production</TableHead>
                  <TableHead className="text-explorer-text">Status</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => {
                  const brandName = getBrandName(model);
                  const productionStatus = getProductionStatus(model);
                  return (
                    <TableRow key={model.id} className="border-explorer-chrome/20">
                      <TableCell className="text-explorer-text">
                        {brandName}
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/admin/models/${model.slug}`}
                          className="font-medium text-accent-teal hover:text-accent-teal/80"
                        >
                          {model.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-explorer-text">{model.type}</TableCell>
                      <TableCell className="text-explorer-text">
                        {model.production_start_year}-{model.production_end_year || 'Present'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${
                            productionStatus === 'active' 
                              ? 'bg-green-400/20 text-green-400 border-green-400/30' 
                              : 'bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30'
                          }`}
                        >
                          {productionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link to={`/admin/models/${model.slug}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Manage
                            </Link>
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
                            onClick={() => handleDeleteClick(model)}
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
                {searchTerm 
                  ? "No models match your search." 
                  : "No models found. Start by adding your first model."
                }
              </div>
              {!searchTerm && (
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleteModel}
        onOpenChange={() => setDeleteModel(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Motorcycle Model"
        description={`Are you sure you want to delete ${deleteModel ? `${getBrandName(deleteModel)} ${deleteModel.name}` : 'this model'}? This will permanently remove the model and all associated data including years, configurations, images, and manuals.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ModelsTable;
