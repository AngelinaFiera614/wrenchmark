
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AdminGlossaryHeaderProps {
  onAddTerm: () => void;
  termCount: number;
}

export function AdminGlossaryHeader({
  onAddTerm,
  termCount
}: AdminGlossaryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Glossary Terms</h1>
        <p className="text-sm text-muted-foreground">
          {termCount} {termCount === 1 ? 'term' : 'terms'} in the motorcycle glossary
        </p>
      </div>
      <Button onClick={onAddTerm} className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Term
      </Button>
    </div>
  );
}
