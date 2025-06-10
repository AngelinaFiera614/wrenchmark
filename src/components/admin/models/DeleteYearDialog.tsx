
import React from 'react';
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
import { Loader2 } from "lucide-react";

interface DeleteYearDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  yearData: {
    id: string;
    year: number;
    brandName?: string;
    modelName?: string;
  } | null;
  isDeleting: boolean;
}

const DeleteYearDialog: React.FC<DeleteYearDialogProps> = ({
  open,
  onClose,
  onConfirm,
  yearData,
  isDeleting
}) => {
  if (!yearData) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-explorer-card border-explorer-chrome/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-explorer-text">
            Delete Model Year
          </AlertDialogTitle>
          <AlertDialogDescription className="text-explorer-text-muted">
            Are you sure you want to delete the {yearData.year} model year
            {yearData.brandName && yearData.modelName && 
              ` for ${yearData.brandName} ${yearData.modelName}`
            }?
            <br /><br />
            <strong>This will also delete:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All trim configurations for this year</li>
              <li>Associated color options</li>
              <li>Related component assignments</li>
            </ul>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isDeleting}
            className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Year'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteYearDialog;
