
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen } from "lucide-react";

interface AdminGlossaryEmptyStateProps {
  onAddTerm: () => void;
}

export function AdminGlossaryEmptyState({ onAddTerm }: AdminGlossaryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
      <BookOpen className="h-12 w-12 text-accent-teal mb-4 opacity-60" />
      <h3 className="text-lg font-semibold mb-1">No glossary terms yet</h3>
      <p className="text-muted-foreground mb-6 max-w-lg">
        Create your first motorcycle glossary term to help riders learn important terminology.
        Terms will appear in a searchable, filterable glossary.
      </p>
      <Button onClick={onAddTerm}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add First Term
      </Button>
    </div>
  );
}
