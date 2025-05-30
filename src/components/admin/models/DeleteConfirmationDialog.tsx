
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { getMotorcycleModelRelations } from "@/services/models/modelQueries";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  motorcycle: any;
  isDeleting: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  motorcycle,
  isDeleting
}) => {
  const [relations, setRelations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && motorcycle?.id) {
      fetchRelations();
    }
  }, [open, motorcycle?.id]);

  const fetchRelations = async () => {
    try {
      setLoading(true);
      const data = await getMotorcycleModelRelations(motorcycle.id);
      setRelations(data);
    } catch (error) {
      console.error("Error fetching relations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBrandName = (brands: any) => {
    if (!brands) return 'Unknown Brand';
    if (Array.isArray(brands) && brands.length > 0) {
      return brands[0]?.name || 'Unknown Brand';
    }
    if (typeof brands === 'object' && brands.name) {
      return brands.name;
    }
    return 'Unknown Brand';
  };

  const hasRelatedData = relations && Object.values(relations).some((count: any) => count > 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Delete Motorcycle Model
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-explorer-text">
            Are you sure you want to delete <strong>{getBrandName(motorcycle?.brands)} {motorcycle?.name}</strong>?
          </p>

          {loading ? (
            <div className="flex items-center gap-2 text-explorer-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking related data...
            </div>
          ) : relations && hasRelatedData ? (
            <Alert className="bg-red-400/10 border-red-400/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-explorer-text">
                <strong>This action will permanently delete:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  {relations.model_years > 0 && (
                    <li>• {relations.model_years} model year{relations.model_years !== 1 ? 's' : ''}</li>
                  )}
                  {relations.configurations > 0 && (
                    <li>• {relations.configurations} configuration{relations.configurations !== 1 ? 's' : ''}</li>
                  )}
                  {relations.images > 0 && (
                    <li>• {relations.images} image{relations.images !== 1 ? 's' : ''}</li>
                  )}
                  {relations.videos > 0 && (
                    <li>• {relations.videos} video{relations.videos !== 1 ? 's' : ''}</li>
                  )}
                  {relations.documents > 0 && (
                    <li>• {relations.documents} document{relations.documents !== 1 ? 's' : ''}</li>
                  )}
                  {relations.manuals > 0 && (
                    <li>• {relations.manuals} manual{relations.manuals !== 1 ? 's' : ''}</li>
                  )}
                  {relations.repair_skills > 0 && (
                    <li>• {relations.repair_skills} repair skill{relations.repair_skills !== 1 ? 's' : ''}</li>
                  )}
                </ul>
                <p className="mt-2 font-medium">This action cannot be undone.</p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-explorer-chrome/10 border-explorer-chrome/30">
              <AlertDescription className="text-explorer-text">
                This motorcycle model has no related data and can be safely deleted.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-explorer-chrome/30"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Permanently'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
