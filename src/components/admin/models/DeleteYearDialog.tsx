
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
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteYearDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  yearData: {
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
          <AlertDialogTitle className="text-explorer-text flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Delete Model Year
          </AlertDialogTitle>
          <AlertDialogDescription className="text-explorer-text-muted">
            Are you sure you want to delete the <strong>{yearData.year}</strong> model year
            {yearData.brandName && yearData.modelName && (
              <> for <strong>{yearData.brandName} {yearData.modelName}</strong></>
            )}?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-red-400/10 border border-red-400/30 rounded-md p-3 my-4">
          <p className="text-red-400 text-sm font-medium mb-2">
            This action will permanently delete:
          </p>
          <ul className="text-red-300 text-sm space-y-1">
            <li>• All configurations for this model year</li>
            <li>• All color options</li>
            <li>• Any associated media or documents</li>
          </ul>
          <p className="text-red-400 text-sm font-medium mt-2">
            This action cannot be undone.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-explorer-chrome/30"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
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
