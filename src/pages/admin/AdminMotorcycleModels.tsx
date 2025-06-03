import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, FileText, Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { publishMotorcycle, unpublishMotorcycle, fetchAllMotorcyclesForAdmin } from "@/services/motorcycles/adminQueries";
import AdminMotorcycleDialog from "@/components/admin/motorcycles/AdminMotorcycleDialog";
import DeleteConfirmationDialog from "@/components/admin/models/DeleteConfirmationDialog";
import BulkPublishingControls from "@/components/admin/models/BulkPublishingControls";
import { DataCompletenessIndicator } from "@/components/motorcycles/DataCompletenessIndicator";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";
import { Motorcycle } from "@/types";
import { deleteMotorcycleModelCascade } from "@/services/models/modelQueries";
import { logAdminAction, auditActions } from "@/services/security/adminAuditLogger";

const AdminMotorcycleModels = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState<Motorcycle | null>(null);
  const [deleteModel, setDeleteModel] = useState<Motorcycle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch motorcycle models with admin permissions and enhanced error handling
  const { data: models, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-motorcycle-models"],
    queryFn: fetchAllMotorcyclesForAdmin
  });

  const handleCreateModel = () => {
    setEditModel(null);
    setIsCreateModelOpen(true);
  };

  const handleEditModel = (model: Motorcycle) => {
    setEditModel(model);
    setIsCreateModelOpen(true);
  };

  const handleTogglePublishStatus = async (motorcycle: Motorcycle) => {
    try {
      const success = motorcycle.is_draft 
        ? await publishMotorcycle(motorcycle.id)
        : await unpublishMotorcycle(motorcycle.id);

      if (success) {
        await logAdminAction({
          action: motorcycle.is_draft ? auditActions.MOTORCYCLE_PUBLISH : auditActions.MOTORCYCLE_UNPUBLISH,
          tableName: 'motorcycle_models',
          recordId: motorcycle.id,
          newValues: { is_draft: !motorcycle.is_draft },
        });

        toast({
          title: motorcycle.is_draft ? "Motorcycle Published" : "Motorcycle Unpublished",
          description: `${motorcycle.make} ${motorcycle.model} has been ${motorcycle.is_draft ? 'published' : 'moved to drafts'}.`,
        });
        refetch();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update motorcycle status. Please try again.",
      });
    }
  };

  const handleDeleteClick = (model: Motorcycle) => {
    setDeleteModel(model);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModel) return;

    try {
      setIsDeleting(true);
      const success = await deleteMotorcycleModelCascade(deleteModel.id);

      if (success) {
        await logAdminAction({
          action: auditActions.MOTORCYCLE_DELETE,
          tableName: 'motorcycle_models',
          recordId: deleteModel.id,
          oldValues: deleteModel,
        });

        toast({
          title: "Model deleted",
          description: `${deleteModel.make} ${deleteModel.model} and all related data has been removed.`,
        });

        refetch();
        setDeleteModel(null);
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Motorcycles</h1>
            <p className="text-muted-foreground mt-1">
              Manage motorcycle models with detailed specifications.
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <div className="text-destructive font-medium">
                Failed to load motorcycle models
              </div>
              <div className="text-muted-foreground">
                There was an error loading the motorcycle data. This could be due to:
              </div>
              <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-1">
                <li>• Database connection issues</li>
                <li>• Missing admin permissions</li>
                <li>• Corrupted motorcycle data</li>
                <li>• Invalid component relationships</li>
              </ul>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publishedModels = models?.filter(m => !m.is_draft) || [];
  const draftModels = models?.filter(m => m.is_draft) || [];
  const incompleteModels = models?.filter(m => {
    const completeness = calculateDataCompleteness(m);
    return completeness.completionPercentage < 100;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Motorcycles</h1>
          <p className="text-muted-foreground mt-1">
            Manage motorcycle models with detailed specifications.
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

      {/* Enhanced Summary Stats */}
      {models && models.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{publishedModels.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{draftModels.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Incomplete Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{incompleteModels.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {models.filter(m => m.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Completeness Warning */}
      {incompleteModels.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                {incompleteModels.length} motorcycles have incomplete component data
              </span>
            </div>
            <p className="text-orange-700 text-sm mt-2">
              These motorcycles are missing some component assignments. They will still appear to users but with "data not available" indicators.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Models List */}
      {models && models.length > 0 ? (
        <div className="space-y-6">
          {/* Draft Models Section */}
          {draftModels.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-orange-600" />
                Draft Models ({draftModels.length})
              </h2>
              <div className="grid gap-4">
                {draftModels.map((motorcycle) => {
                  const dataCompleteness = calculateDataCompleteness(motorcycle);
                  return (
                    <Card key={motorcycle.id} className="border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <FileText className="mr-1 h-3 w-3" />
                              Draft
                            </Badge>
                            <DataCompletenessIndicator 
                              status={dataCompleteness} 
                              variant="admin" 
                            />
                            <div>
                              <h3 className="font-medium">{motorcycle.make} {motorcycle.model}</h3>
                              <p className="text-sm text-muted-foreground">
                                {motorcycle.year} • {motorcycle.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublishStatus(motorcycle)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Publish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditModel(motorcycle)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(motorcycle)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Published Models Section */}
          {publishedModels.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="mr-2 h-5 w-5 text-green-600" />
                Published Models ({publishedModels.length})
              </h2>
              <div className="grid gap-4">
                {publishedModels.map((motorcycle) => {
                  const dataCompleteness = calculateDataCompleteness(motorcycle);
                  return (
                    <Card key={motorcycle.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Eye className="mr-1 h-3 w-3" />
                              Published
                            </Badge>
                            <DataCompletenessIndicator 
                              status={dataCompleteness} 
                              variant="admin" 
                            />
                            <div>
                              <h3 className="font-medium">{motorcycle.make} {motorcycle.model}</h3>
                              <p className="text-sm text-muted-foreground">
                                {motorcycle.year} • {motorcycle.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublishStatus(motorcycle)}
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              Unpublish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditModel(motorcycle)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(motorcycle)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
      <AdminMotorcycleDialog 
        open={isCreateModelOpen}
        motorcycle={editModel}
        onClose={handleDialogClose}
      />

      <DeleteConfirmationDialog
        open={!!deleteModel}
        onClose={() => setDeleteModel(null)}
        onConfirm={handleDeleteConfirm}
        motorcycle={deleteModel}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminMotorcycleModels;
