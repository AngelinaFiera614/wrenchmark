
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { publishMotorcycle, unpublishMotorcycle, fetchAllMotorcyclesForAdmin } from "@/services/motorcycles/adminQueries";
import AdminMotorcycleDialog from "@/components/admin/motorcycles/AdminMotorcycleDialog";
import DeleteConfirmationDialog from "@/components/admin/models/DeleteConfirmationDialog";
import EnhancedMotorcycleManagement from "@/components/admin/motorcycles/EnhancedMotorcycleManagement";
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
          description: `${motorcycle.brand?.name} ${motorcycle.name} has been ${motorcycle.is_draft ? 'published' : 'moved to drafts'}.`,
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
          oldValues: { name: deleteModel.name, brand: deleteModel.brand?.name },
        });

        toast({
          title: "Motorcycle Deleted",
          description: `${deleteModel.brand?.name} ${deleteModel.name} has been permanently deleted.`,
        });
        refetch();
        setDeleteModel(null);
      } else {
        throw new Error("Failed to delete motorcycle");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete motorcycle. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        <span className="ml-2 text-explorer-text">Loading motorcycles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-400 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Error Loading Motorcycles</span>
          </div>
          <p className="text-explorer-text-muted mb-4">
            Failed to load motorcycle data. Please check your connection and try again.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <EnhancedMotorcycleManagement
        motorcycles={models || []}
        onCreateNew={handleCreateModel}
        onEditMotorcycle={handleEditModel}
        onDeleteMotorcycle={handleDeleteClick}
        onToggleStatus={handleTogglePublishStatus}
      />

      {/* Dialogs */}
      <AdminMotorcycleDialog
        motorcycle={editModel}
        open={isCreateModelOpen}
        onOpenChange={setIsCreateModelOpen}
        onSuccess={() => {
          refetch();
          setIsCreateModelOpen(false);
          setEditModel(null);
        }}
      />

      <DeleteConfirmationDialog
        open={!!deleteModel}
        onOpenChange={(open) => !open && setDeleteModel(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Motorcycle Model"
        description={`Are you sure you want to delete "${deleteModel?.brand?.name} ${deleteModel?.name}"? This action cannot be undone and will remove all associated data.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminMotorcycleModels;
