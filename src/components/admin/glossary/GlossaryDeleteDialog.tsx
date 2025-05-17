
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
import { GlossaryTerm } from "@/types/glossary";
import { Loader } from "lucide-react";

interface GlossaryDeleteDialogProps {
  term: GlossaryTerm | null;
  open: boolean;
  loading: boolean;
  onConfirm: (term: GlossaryTerm) => Promise<void>;
  onCancel: () => void;
}

export function GlossaryDeleteDialog({
  term,
  open,
  loading,
  onConfirm,
  onCancel,
}: GlossaryDeleteDialogProps) {
  const handleConfirm = async () => {
    if (term) {
      await onConfirm(term);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the glossary term 
            <strong className="font-semibold"> {term?.term}</strong> and any 
            references to it. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
