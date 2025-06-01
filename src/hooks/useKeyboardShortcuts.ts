
import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onSave?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onNew?: () => void;
  onDelete?: () => void;
  onSearch?: () => void;
  onSelectAll?: () => void;
  onCancel?: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable;

      // Don't trigger shortcuts when typing in input fields
      // except for Escape key
      if (isInputField && event.key !== 'Escape') return;

      const { ctrlKey, metaKey, shiftKey, key } = event;
      const cmdOrCtrl = ctrlKey || metaKey;

      // Ctrl/Cmd + S: Save
      if (cmdOrCtrl && key === 's' && handlers.onSave) {
        event.preventDefault();
        handlers.onSave();
        return;
      }

      // Ctrl/Cmd + C: Copy (when not in input)
      if (cmdOrCtrl && key === 'c' && handlers.onCopy && !isInputField) {
        event.preventDefault();
        handlers.onCopy();
        return;
      }

      // Ctrl/Cmd + E: Edit
      if (cmdOrCtrl && key === 'e' && handlers.onEdit) {
        event.preventDefault();
        handlers.onEdit();
        return;
      }

      // Ctrl/Cmd + N: New
      if (cmdOrCtrl && key === 'n' && handlers.onNew) {
        event.preventDefault();
        handlers.onNew();
        return;
      }

      // Delete key: Delete (when not in input)
      if (key === 'Delete' && handlers.onDelete && !isInputField) {
        event.preventDefault();
        handlers.onDelete();
        return;
      }

      // Ctrl/Cmd + F: Search
      if (cmdOrCtrl && key === 'f' && handlers.onSearch) {
        event.preventDefault();
        handlers.onSearch();
        return;
      }

      // Ctrl/Cmd + A: Select All (when not in input)
      if (cmdOrCtrl && key === 'a' && handlers.onSelectAll && !isInputField) {
        event.preventDefault();
        handlers.onSelectAll();
        return;
      }

      // Escape: Cancel/Close
      if (key === 'Escape' && handlers.onCancel) {
        event.preventDefault();
        handlers.onCancel();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);

  // Return helpful tooltip text for UI
  return {
    saveShortcut: 'Ctrl+S',
    copyShortcut: 'Ctrl+C', 
    editShortcut: 'Ctrl+E',
    newShortcut: 'Ctrl+N',
    deleteShortcut: 'Delete',
    searchShortcut: 'Ctrl+F',
    selectAllShortcut: 'Ctrl+A',
    cancelShortcut: 'Esc'
  };
};
