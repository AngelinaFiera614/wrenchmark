
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Eye } from 'lucide-react';

export interface ColumnVisibility {
  term: boolean;
  definition: boolean;
  relatedTerms: boolean;
  categories: boolean;
  updated: boolean;
}

interface ColumnVisibilityControlsProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

const DEFAULT_VISIBILITY: ColumnVisibility = {
  term: true,
  definition: true,
  relatedTerms: true,
  categories: true,
  updated: true,
};

export function ColumnVisibilityControls({
  visibility,
  onVisibilityChange,
}: ColumnVisibilityControlsProps) {
  const columns = [
    { key: 'term' as keyof ColumnVisibility, label: 'Term' },
    { key: 'definition' as keyof ColumnVisibility, label: 'Definition' },
    { key: 'relatedTerms' as keyof ColumnVisibility, label: 'Related Terms' },
    { key: 'categories' as keyof ColumnVisibility, label: 'Categories' },
    { key: 'updated' as keyof ColumnVisibility, label: 'Updated' },
  ];

  const handleColumnToggle = (column: keyof ColumnVisibility) => {
    const newVisibility = {
      ...visibility,
      [column]: !visibility[column],
    };
    onVisibilityChange(newVisibility);
    localStorage.setItem('glossary-column-visibility', JSON.stringify(newVisibility));
  };

  const visibleCount = Object.values(visibility).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Columns ({visibleCount})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-3">
          <div className="font-medium text-sm">Show Columns</div>
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={column.key}
                  checked={visibility[column.key]}
                  onCheckedChange={() => handleColumnToggle(column.key)}
                />
                <label
                  htmlFor={column.key}
                  className="text-sm font-normal cursor-pointer"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DEFAULT_VISIBILITY };
