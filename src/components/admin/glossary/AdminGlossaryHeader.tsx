
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { GlossaryTerm } from "@/types/glossary";
import { ColumnVisibilityControls, ColumnVisibility } from "./ColumnVisibilityControls";
import { ExportControls } from "./ExportControls";
import { ViewModeToggle } from "./ViewModeToggle";

interface AdminGlossaryHeaderProps {
  onAddTerm: () => void;
  termCount: number;
  terms: GlossaryTerm[];
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
}

export function AdminGlossaryHeader({
  onAddTerm,
  termCount,
  terms,
  columnVisibility,
  onColumnVisibilityChange,
  viewMode,
  setViewMode,
}: AdminGlossaryHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
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
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          {viewMode === "table" && (
            <ColumnVisibilityControls
              visibility={columnVisibility}
              onVisibilityChange={onColumnVisibilityChange}
            />
          )}
        </div>
        <ExportControls terms={terms} columnVisibility={columnVisibility} />
      </div>
    </div>
  );
}
