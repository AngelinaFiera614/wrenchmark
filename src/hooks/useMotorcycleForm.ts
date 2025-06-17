
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateMotorcycleAdmin } from "@/services/motorcycles/adminQueries";
import { Motorcycle } from "@/types";

export const useMotorcycleForm = (motorcycle: Motorcycle, onSuccess?: () => void) => {
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<Motorcycle>>(motorcycle);
  const { toast } = useToast();

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const saveChanges = async () => {
    if (!hasUnsavedChanges) return;
    
    setSaving(true);
    try {
      await updateMotorcycleAdmin(motorcycle.id, formData);
      setHasUnsavedChanges(false);
      toast({
        title: "Changes Saved",
        description: "Motorcycle data has been updated successfully."
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save changes"
      });
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setFormData(motorcycle);
    setHasUnsavedChanges(false);
  };

  return {
    formData,
    saving,
    hasUnsavedChanges,
    updateField,
    saveChanges,
    discardChanges
  };
};
