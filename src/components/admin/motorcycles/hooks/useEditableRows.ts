
import { useState } from "react";
import { MotorcycleGridItem } from "../types";

export const useEditableRows = () => {
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  // Start editing a row
  const handleEditRow = (id: string) => {
    setEditingRows(prev => ({ ...prev, [id]: true }));
  };

  // Cancel editing a row
  const handleCancelEdit = (
    id: string,
    motorcycles: MotorcycleGridItem[],
    setMotorcycles: React.Dispatch<React.SetStateAction<MotorcycleGridItem[]>>,
    originalData: Record<string, MotorcycleGridItem>
  ) => {
    if (motorcycles.find(m => m.id === id)?.is_new) {
      // Remove new unsaved row
      setMotorcycles(prev => prev.filter(m => m.id !== id));
    } else {
      // Restore original data
      setMotorcycles(prev => 
        prev.map(m => (m.id === id ? { ...originalData[id], isDirty: false } : m))
      );
      setErrors(prev => ({ ...prev, [id]: {} }));
    }
    setEditingRows(prev => ({ ...prev, [id]: false }));
  };

  // Handle cell value changes
  const handleCellChange = (
    id: string,
    field: string,
    value: any,
    setMotorcycles: React.Dispatch<React.SetStateAction<MotorcycleGridItem[]>>
  ) => {
    setMotorcycles(prev => 
      prev.map(m => m.id === id ? { ...m, [field]: value, isDirty: true } : m)
    );
    
    // Clear field error when user fixes it
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined
        }
      }));
    }
  };

  return {
    editingRows,
    setEditingRows,
    errors,
    setErrors,
    handleEditRow,
    handleCancelEdit,
    handleCellChange
  };
};
