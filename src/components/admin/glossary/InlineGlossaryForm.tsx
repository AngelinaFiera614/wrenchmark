
import React from "react";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";
import { Button } from "@/components/ui/button";
import { GlossaryForm } from "./GlossaryForm";
import { useSubmissionHandler } from "./dialog/SubmissionHandler";
import { X, ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface InlineGlossaryFormProps {
  term: GlossaryTerm | null;
  onClose: (refresh?: boolean) => void;
  availableTerms: GlossaryTerm[];
}

export function InlineGlossaryForm({
  term,
  onClose,
  availableTerms,
}: InlineGlossaryFormProps) {
  const { user, isAdmin } = useAuth();
  const { loading, handleSubmit } = useSubmissionHandler({
    term,
    onClose,
    user,
    isAdmin,
  });

  const handleFormSubmit = async (values: GlossaryFormValues) => {
    await handleSubmit(values);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClose()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-xl font-semibold">
            {term ? "Edit Glossary Term" : "Add New Glossary Term"}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onClose()}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <GlossaryForm
          term={term}
          isSubmitting={loading}
          onSubmit={handleFormSubmit}
          onCancel={() => onClose()}
          availableTerms={availableTerms}
        />
      </div>
    </div>
  );
}
