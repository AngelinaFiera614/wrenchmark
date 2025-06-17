
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ContentBlock } from '@/types/course';
import { Copy, Trash2, Move, ClipboardCopy, ClipboardPaste } from 'lucide-react';
import { toast } from 'sonner';

interface BulkOperationsToolbarProps {
  selectedBlocks: string[];
  contentBlocks: ContentBlock[];
  onCopyBlocks: (blockIds: string[]) => void;
  onDeleteBlocks: (blockIds: string[]) => void;
  onDuplicateBlocks: (blockIds: string[]) => void;
  onMoveBlocks: (blockIds: string[], direction: 'up' | 'down') => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  hasClipboard: boolean;
  onPasteBlocks: () => void;
}

export default function BulkOperationsToolbar({
  selectedBlocks,
  contentBlocks,
  onCopyBlocks,
  onDeleteBlocks,
  onDuplicateBlocks,
  onMoveBlocks,
  onSelectAll,
  onClearSelection,
  hasClipboard,
  onPasteBlocks
}: BulkOperationsToolbarProps) {
  const hasSelection = selectedBlocks.length > 0;
  const isAllSelected = selectedBlocks.length === contentBlocks.length;

  const handleCopy = () => {
    onCopyBlocks(selectedBlocks);
    toast.success(`Copied ${selectedBlocks.length} block(s) to clipboard`);
  };

  const handleDelete = () => {
    if (confirm(`Delete ${selectedBlocks.length} selected block(s)?`)) {
      onDeleteBlocks(selectedBlocks);
      toast.success(`Deleted ${selectedBlocks.length} block(s)`);
    }
  };

  const handleDuplicate = () => {
    onDuplicateBlocks(selectedBlocks);
    toast.success(`Duplicated ${selectedBlocks.length} block(s)`);
  };

  if (!hasSelection && !hasClipboard) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border mb-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked) => {
            if (checked) {
              onSelectAll();
            } else {
              onClearSelection();
            }
          }}
        />
        <span className="text-sm text-muted-foreground">
          {hasSelection ? (
            <Badge variant="secondary">{selectedBlocks.length} selected</Badge>
          ) : (
            'Select all'
          )}
        </span>
      </div>

      {hasSelection && (
        <>
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="flex items-center gap-2"
          >
            <ClipboardCopy className="h-4 w-4" />
            Duplicate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveBlocks(selectedBlocks, 'up')}
            className="flex items-center gap-2"
          >
            <Move className="h-4 w-4" />
            Move Up
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveBlocks(selectedBlocks, 'down')}
            className="flex items-center gap-2"
          >
            <Move className="h-4 w-4" />
            Move Down
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </>
      )}

      {hasClipboard && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="outline"
            size="sm"
            onClick={onPasteBlocks}
            className="flex items-center gap-2"
          >
            <ClipboardPaste className="h-4 w-4" />
            Paste
          </Button>
        </>
      )}

      {hasSelection && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="ml-auto"
        >
          Clear Selection
        </Button>
      )}
    </div>
  );
}
