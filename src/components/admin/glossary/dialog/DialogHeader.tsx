
import React from "react";
import {
  DialogHeader as UIDialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GlossaryTerm } from "@/types/glossary";

interface DialogHeaderProps {
  term: GlossaryTerm | null;
}

export const GlossaryDialogHeader: React.FC<DialogHeaderProps> = ({ term }) => {
  return (
    <UIDialogHeader>
      <DialogTitle>
        {term ? "Edit Term" : "Add New Term"}
      </DialogTitle>
      <DialogDescription>
        {term 
          ? "Update the details for this glossary term."
          : "Fill in the details to add a new term to the motorcycle glossary."}
      </DialogDescription>
    </UIDialogHeader>
  );
};
