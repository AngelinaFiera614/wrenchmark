
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, Grid3X3 } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex rounded-md border border-input bg-background">
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="rounded-r-none border-r"
      >
        <Table className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        variant={viewMode === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("card")}
        className="rounded-l-none"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="sr-only">Card view</span>
      </Button>
    </div>
  );
}
