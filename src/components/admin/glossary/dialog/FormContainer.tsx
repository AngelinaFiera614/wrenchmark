
import React from "react";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";
import { GlossaryForm } from "../GlossaryForm";

interface FormContainerProps {
  term: GlossaryTerm | null;
  isSubmitting: boolean;
  onSubmit: (values: GlossaryFormValues) => Promise<void>;
  onCancel: () => void;
  availableTerms: GlossaryTerm[];
}

export const FormContainer: React.FC<FormContainerProps> = ({
  term,
  isSubmitting,
  onSubmit,
  onCancel,
  availableTerms,
}) => {
  return (
    <GlossaryForm
      term={term}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onCancel={onCancel}
      availableTerms={availableTerms}
    />
  );
};
