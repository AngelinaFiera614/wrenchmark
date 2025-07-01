
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateMotorcycleAdmin } from "@/services/motorcycles/adminQueries";
import { filterMotorcycleUpdateData, validateUpdateData } from "@/services/motorcycles/fieldFilter";
import { Motorcycle } from "@/types";

export const useMotorcycleForm = (motorcycle: Motorcycle, onSuccess?: () => void) => {
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<Motorcycle>>(motorcycle);
  const { toast } = useToast();

  const updateField = (field: string, value: any) => {
    console.log('Updating field:', field, 'with value:', value);
    
    // Only mark as changed if it's a database field that can actually be saved
    const testUpdate = { [field]: value };
    const validation = validateUpdateData(testUpdate);
    
    if (validation.valid) {
      setFormData(prev => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
    } else {
      console.warn('Field update ignored for computed field:', field);
      // Still update form data for display purposes, but don't mark as "unsaved changes"
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateData = (data: Partial<Motorcycle>) => {
    console.log('Updating multiple fields:', Object.keys(data));
    
    // Separate saveable fields from display-only fields
    const filteredData = filterMotorcycleUpdateData(data);
    const hasSaveableChanges = Object.keys(filteredData).length > 0;
    
    setFormData(prev => ({ ...prev, ...data }));
    
    if (hasSaveableChanges) {
      setHasUnsavedChanges(true);
    }
  };

  const saveChanges = async () => {
    if (!hasUnsavedChanges) {
      console.log('No unsaved changes to save');
      return;
    }
    
    setSaving(true);
    try {
      console.log('Saving changes for motorcycle:', motorcycle.id);
      
      // Filter the form data before sending to API
      const updatesForDb = filterMotorcycleUpdateData(formData);
      
      if (Object.keys(updatesForDb).length === 0) {
        console.warn('No database fields to save');
        toast({
          variant: "destructive",
          title: "Nothing to Save",
          description: "No valid database fields have been changed."
        });
        return;
      }
      
      const updatedData = await updateMotorcycleAdmin(motorcycle.id, updatesForDb);
      
      // Update form data with the response (including any computed fields)
      setFormData(updatedData);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Changes Saved",
        description: "Motorcycle data has been updated successfully."
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Save failed:', error);
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
    console.log('Discarding changes, reverting to original data');
    setFormData(motorcycle);
    setHasUnsavedChanges(false);
  };

  return {
    formData,
    saving,
    hasUnsavedChanges,
    updateField,
    updateData,
    saveChanges,
    discardChanges
  };
};
