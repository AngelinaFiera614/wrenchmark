
import { useState, useCallback } from 'react';
import { ContentBlock } from '@/types/course';

interface BulkOperationsState {
  selectedBlocks: string[];
  clipboard: ContentBlock[];
}

export function useBulkOperations(
  contentBlocks: ContentBlock[],
  setContentBlocks: (blocks: ContentBlock[]) => void
) {
  const [state, setState] = useState<BulkOperationsState>({
    selectedBlocks: [],
    clipboard: []
  });

  const selectBlock = useCallback((blockId: string) => {
    setState(prev => ({
      ...prev,
      selectedBlocks: prev.selectedBlocks.includes(blockId)
        ? prev.selectedBlocks.filter(id => id !== blockId)
        : [...prev.selectedBlocks, blockId]
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedBlocks: contentBlocks.map(block => block.id)
    }));
  }, [contentBlocks]);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedBlocks: []
    }));
  }, []);

  const copyBlocks = useCallback((blockIds: string[]) => {
    const blocksToCopy = contentBlocks.filter(block => blockIds.includes(block.id));
    setState(prev => ({
      ...prev,
      clipboard: blocksToCopy
    }));
  }, [contentBlocks]);

  const pasteBlocks = useCallback(() => {
    if (state.clipboard.length === 0) return;

    const newBlocks = state.clipboard.map(block => ({
      ...block,
      id: crypto.randomUUID(),
      order: contentBlocks.length + state.clipboard.indexOf(block)
    }));

    setContentBlocks([...contentBlocks, ...newBlocks]);
    clearSelection();
  }, [state.clipboard, contentBlocks, setContentBlocks, clearSelection]);

  const deleteBlocks = useCallback((blockIds: string[]) => {
    const remainingBlocks = contentBlocks
      .filter(block => !blockIds.includes(block.id))
      .map((block, index) => ({ ...block, order: index }));
    
    setContentBlocks(remainingBlocks);
    clearSelection();
  }, [contentBlocks, setContentBlocks, clearSelection]);

  const duplicateBlocks = useCallback((blockIds: string[]) => {
    const blocksToDuplicate = contentBlocks.filter(block => blockIds.includes(block.id));
    const duplicatedBlocks = blocksToDuplicate.map(block => ({
      ...block,
      id: crypto.randomUUID(),
      title: `${block.title} (Copy)`,
      order: contentBlocks.length + blocksToDuplicate.indexOf(block)
    }));

    setContentBlocks([...contentBlocks, ...duplicatedBlocks]);
    clearSelection();
  }, [contentBlocks, setContentBlocks, clearSelection]);

  const moveBlocks = useCallback((blockIds: string[], direction: 'up' | 'down') => {
    const sortedBlocks = [...contentBlocks].sort((a, b) => a.order - b.order);
    const selectedIndices = blockIds.map(id => 
      sortedBlocks.findIndex(block => block.id === id)
    ).sort((a, b) => a - b);

    if (direction === 'up') {
      // Can't move if first selected block is already at the top
      if (selectedIndices[0] === 0) return;
      
      selectedIndices.forEach((index, i) => {
        const adjustedIndex = index - i;
        const temp = sortedBlocks[adjustedIndex - 1];
        sortedBlocks[adjustedIndex - 1] = sortedBlocks[adjustedIndex];
        sortedBlocks[adjustedIndex] = temp;
      });
    } else {
      // Can't move if last selected block is already at the bottom
      if (selectedIndices[selectedIndices.length - 1] === sortedBlocks.length - 1) return;
      
      selectedIndices.reverse().forEach((index, i) => {
        const adjustedIndex = index + i;
        const temp = sortedBlocks[adjustedIndex + 1];
        sortedBlocks[adjustedIndex + 1] = sortedBlocks[adjustedIndex];
        sortedBlocks[adjustedIndex] = temp;
      });
    }

    const reorderedBlocks = sortedBlocks.map((block, index) => ({
      ...block,
      order: index
    }));

    setContentBlocks(reorderedBlocks);
  }, [contentBlocks, setContentBlocks]);

  return {
    selectedBlocks: state.selectedBlocks,
    hasClipboard: state.clipboard.length > 0,
    selectBlock,
    selectAll,
    clearSelection,
    copyBlocks,
    pasteBlocks,
    deleteBlocks,
    duplicateBlocks,
    moveBlocks
  };
}
