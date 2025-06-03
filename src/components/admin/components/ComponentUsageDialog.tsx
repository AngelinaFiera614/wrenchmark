
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ComponentUsageDialogProps {
  open: boolean;
  onClose: () => void;
  componentName: string;
  componentType: string;
  usageInfo: {
    canDelete: boolean;
    usageCount: number;
    models: string[];
    trims: string[];
  };
  onConfirmDelete?: () => void;
  isDeleting?: boolean;
}

const ComponentUsageDialog = ({
  open,
  onClose,
  componentName,
  componentType,
  usageInfo,
  onConfirmDelete,
  isDeleting = false
}: ComponentUsageDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            {usageInfo.canDelete ? "Confirm Deletion" : "Cannot Delete Component"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-explorer-text mb-2">
              {usageInfo.canDelete 
                ? `Are you sure you want to delete the ${componentType} "${componentName}"?`
                : `The ${componentType} "${componentName}" cannot be deleted because it is currently in use.`
              }
            </p>

            {!usageInfo.canDelete && (
              <div className="bg-orange-950/50 border border-orange-400/30 rounded-lg p-4">
                <p className="text-orange-200 font-medium mb-2">
                  Currently used by {usageInfo.usageCount} configuration(s):
                </p>
                
                {usageInfo.models.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-orange-300 mb-1">Models:</p>
                    <div className="flex flex-wrap gap-1">
                      {usageInfo.models.map((model, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {usageInfo.trims.length > 0 && (
                  <div>
                    <p className="text-sm text-orange-300 mb-1">Trim Levels:</p>
                    <div className="flex flex-wrap gap-1">
                      {usageInfo.trims.map((trim, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {trim}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-orange-300 mt-3">
                  Remove these assignments first before deleting this component.
                </p>
              </div>
            )}

            {usageInfo.canDelete && (
              <p className="text-sm text-explorer-text-muted">
                This action cannot be undone.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {usageInfo.canDelete ? "Cancel" : "Close"}
          </Button>
          {usageInfo.canDelete && onConfirmDelete && (
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentUsageDialog;
