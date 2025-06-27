
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  componentName: string;
  componentType: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  componentName,
  componentType
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-explorer-card border-explorer-chrome/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-explorer-text">
            Delete {componentType}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-explorer-text-muted">
            Are you sure you want to delete "{componentName}"? This action cannot be undone.
            {componentType !== 'component' && (
              <div className="mt-2 text-orange-400 text-sm">
                Warning: This {componentType} may be used by existing motorcycle configurations.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
