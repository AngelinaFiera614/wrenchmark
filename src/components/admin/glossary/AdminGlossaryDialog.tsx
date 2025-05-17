
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { GlossaryTerm } from "@/types/glossary";
import { GlossaryDialogHeader } from "./dialog/DialogHeader";
import { FormContainer } from "./dialog/FormContainer";
import { useSubmissionHandler } from "./dialog/SubmissionHandler";

interface AdminGlossaryDialogProps {
  open: boolean;
  term: GlossaryTerm | null;
  onClose: (refreshData?: boolean) => void;
  availableTerms?: GlossaryTerm[];
}

const AdminGlossaryDialog: React.FC<AdminGlossaryDialogProps> = ({ 
  open, 
  term, 
  onClose,
  availableTerms = []
}) => {
  const { user, isAdmin } = useAuth();
  const { loading, handleSubmit } = useSubmissionHandler({
    term,
    onClose,
    user,
    isAdmin,
  });

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <GlossaryDialogHeader term={term} />

        <FormContainer 
          term={term} 
          isSubmitting={loading} 
          onSubmit={handleSubmit} 
          onCancel={() => onClose()}
          availableTerms={availableTerms}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminGlossaryDialog;
