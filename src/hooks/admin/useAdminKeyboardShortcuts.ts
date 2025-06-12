
import { useEffect, useCallback } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface AdminKeyboardShortcutsProps {
  // Navigation actions
  onNavigateToModels?: () => void;
  onNavigateToYears?: () => void;
  onNavigateToTrims?: () => void;
  onNavigateToComponents?: () => void;
  
  // CRUD actions
  onCreateNew?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  
  // Selection actions
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  
  // View actions
  onTogglePreview?: () => void;
  onToggleFilters?: () => void;
  onRefresh?: () => void;
  onSearch?: () => void;
  
  // Bulk operations
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
  onBulkExport?: () => void;
  
  // Quick actions
  onQuickCopy?: () => void;
  onQuickEdit?: () => void;
  onQuickSave?: () => void;
}

export const useAdminKeyboardShortcuts = (handlers: AdminKeyboardShortcutsProps) => {
  // Use the base keyboard shortcuts hook
  const shortcuts = useKeyboardShortcuts({
    onSave: handlers.onSave,
    onCopy: handlers.onCopy,
    onEdit: handlers.onEdit,
    onNew: handlers.onCreateNew,
    onDelete: handlers.onDelete,
    onSearch: handlers.onSearch,
    onSelectAll: handlers.onSelectAll,
    onCancel: handlers.onCancel
  });

  // Additional admin-specific shortcuts
  useEffect(() => {
    const handleAdminKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, altKey, key } = event;
      const cmdOrCtrl = ctrlKey || metaKey;

      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable;

      // Don't trigger shortcuts when typing in input fields (except some global ones)
      const globalShortcuts = ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5'];
      if (isInputField && !globalShortcuts.includes(key)) return;

      // Navigation shortcuts (Alt + Number)
      if (altKey && !cmdOrCtrl && !shiftKey) {
        switch (key) {
          case '1':
            event.preventDefault();
            handlers.onNavigateToModels?.();
            break;
          case '2':
            event.preventDefault();
            handlers.onNavigateToYears?.();
            break;
          case '3':
            event.preventDefault();
            handlers.onNavigateToTrims?.();
            break;
          case '4':
            event.preventDefault();
            handlers.onNavigateToComponents?.();
            break;
        }
        return;
      }

      // Quick actions (Ctrl/Cmd + Shift + Key)
      if (cmdOrCtrl && shiftKey && !altKey) {
        switch (key) {
          case 'C':
            event.preventDefault();
            handlers.onQuickCopy?.();
            break;
          case 'E':
            event.preventDefault();
            handlers.onQuickEdit?.();
            break;
          case 'S':
            event.preventDefault();
            handlers.onQuickSave?.();
            break;
          case 'A':
            event.preventDefault();
            handlers.onSelectAll?.();
            break;
          case 'D':
            event.preventDefault();
            handlers.onDeselectAll?.();
            break;
        }
        return;
      }

      // Bulk operations (Ctrl/Cmd + Alt + Key)
      if (cmdOrCtrl && altKey && !shiftKey) {
        switch (key) {
          case 'e':
            event.preventDefault();
            handlers.onBulkEdit?.();
            break;
          case 'd':
            event.preventDefault();
            handlers.onBulkDelete?.();
            break;
          case 'x':
            event.preventDefault();
            handlers.onBulkExport?.();
            break;
        }
        return;
      }

      // Function keys
      switch (key) {
        case 'F1':
          event.preventDefault();
          // Show help/shortcuts dialog
          console.log('Keyboard shortcuts help would open here');
          break;
        case 'F2':
          event.preventDefault();
          handlers.onEdit?.();
          break;
        case 'F3':
          event.preventDefault();
          handlers.onSearch?.();
          break;
        case 'F4':
          event.preventDefault();
          handlers.onToggleFilters?.();
          break;
        case 'F5':
          event.preventDefault();
          handlers.onRefresh?.();
          break;
      }

      // Single key shortcuts (when not in input)
      if (!isInputField) {
        switch (key) {
          case 'p':
            if (!cmdOrCtrl && !altKey && !shiftKey) {
              event.preventDefault();
              handlers.onTogglePreview?.();
            }
            break;
          case 'r':
            if (!cmdOrCtrl && !altKey && !shiftKey) {
              event.preventDefault();
              handlers.onRefresh?.();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleAdminKeyDown);

    return () => {
      document.removeEventListener('keydown', handleAdminKeyDown);
    };
  }, [handlers]);

  // Return helpful information for UI tooltips
  return {
    ...shortcuts,
    // Navigation shortcuts
    navigateToModelsShortcut: 'Alt+1',
    navigateToYearsShortcut: 'Alt+2',
    navigateToTrimsShortcut: 'Alt+3',
    navigateToComponentsShortcut: 'Alt+4',
    
    // Quick actions
    quickCopyShortcut: 'Ctrl+Shift+C',
    quickEditShortcut: 'Ctrl+Shift+E',
    quickSaveShortcut: 'Ctrl+Shift+S',
    
    // Bulk operations
    bulkEditShortcut: 'Ctrl+Alt+E',
    bulkDeleteShortcut: 'Ctrl+Alt+D',
    bulkExportShortcut: 'Ctrl+Alt+X',
    
    // View actions
    togglePreviewShortcut: 'P',
    toggleFiltersShortcut: 'F4',
    refreshShortcut: 'R or F5',
    
    // Function keys
    helpShortcut: 'F1',
    editShortcut: 'F2',
    searchShortcut: 'F3'
  };
};
