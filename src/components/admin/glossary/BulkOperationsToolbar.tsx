
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, Edit, FolderPlus, Download, X } from 'lucide-react';
import { GlossaryTerm } from '@/types/glossary';

interface BulkOperationsToolbarProps {
  selectedTerms: string[];
  terms: GlossaryTerm[];
  onClearSelection: () => void;
  onBulkDelete: (termIds: string[]) => void;
  onBulkExport: (terms: GlossaryTerm[]) => void;
  onBulkCategoryAssign: (termIds: string[]) => void;
}

export function BulkOperationsToolbar({
  selectedTerms,
  terms,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  onBulkCategoryAssign,
}: BulkOperationsToolbarProps) {
  if (selectedTerms.length === 0) return null;

  const selectedTermsData = terms.filter(term => selectedTerms.includes(term.id));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border rounded-lg shadow-lg p-4 min-w-96">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
            {selectedTerms.length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkExport(selectedTermsData)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkCategoryAssign(selectedTerms)}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            Add Category
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(selectedTerms)}
            className="gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
