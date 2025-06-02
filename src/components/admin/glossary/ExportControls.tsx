
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Code } from 'lucide-react';
import { GlossaryTerm } from '@/types/glossary';
import { exportGlossaryTerms } from '@/utils/glossaryExport';
import { ColumnVisibility } from './ColumnVisibilityControls';

interface ExportControlsProps {
  terms: GlossaryTerm[];
  columnVisibility: ColumnVisibility;
}

export function ExportControls({ terms, columnVisibility }: ExportControlsProps) {
  const handleExport = (format: 'csv' | 'json') => {
    exportGlossaryTerms(terms, {
      format,
      columnVisibility,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export ({terms.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <Code className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
