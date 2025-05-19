
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MotorcycleGridItem } from "../types";

export const useRowOperations = (
  motorcycles: MotorcycleGridItem[],
  setMotorcycles: React.Dispatch<React.SetStateAction<MotorcycleGridItem[]>>,
  originalData: Record<string, MotorcycleGridItem>,
  setOriginalData: React.Dispatch<React.SetStateAction<Record<string, MotorcycleGridItem>>>,
  editingRows: Record<string, boolean>,
  setEditingRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>
) => {
  const { toast } = useToast();

  // Add a new row
  const handleAddRow = () => {
    const newId = `new-${Date.now()}`;
    const newMotorcycle: MotorcycleGridItem = {
      id: newId,
      model_name: "",
      brand_id: "",
      year_start: new Date().getFullYear(),
      year_end: null,
      description: "",
      status: "draft",
      is_new: true,
      isDirty: true,
    };

    setMotorcycles(prev => [...prev, newMotorcycle]);
    setOriginalData(prev => ({ ...prev, [newId]: { ...newMotorcycle } }));
    setEditingRows(prev => ({ ...prev, [newId]: true }));
  };

  // Delete a motorcycle
  const handleDeleteRow = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this motorcycle?")) {
      const motorcycle = motorcycles.find(m => m.id === id);
      
      // If it's a new unsaved row, just remove from state
      if (motorcycle?.is_new) {
        setMotorcycles(prev => prev.filter(m => m.id !== id));
        return;
      }

      try {
        const { error } = await supabase
          .from("motorcycles")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Motorcycle Deleted",
          description: `${motorcycle?.model_name || "Motorcycle"} has been removed.`,
        });

        setMotorcycles(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting motorcycle:", error);
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: "There was an error deleting the motorcycle.",
        });
      }
    }
  };

  // Save row changes
  const handleSaveRow = async (id: string) => {
    const motorcycle = motorcycles.find(m => m.id === id);
    if (!motorcycle) return;

    // Validate required fields
    const rowErrors: Record<string, string> = {};
    if (!motorcycle.model_name) rowErrors.model_name = "Model name is required";
    if (!motorcycle.brand_id) rowErrors.brand_id = "Brand is required";
    if (!motorcycle.year_start) rowErrors.year_start = "Start year is required";

    if (Object.keys(rowErrors).length > 0) {
      setErrors(prev => ({ ...prev, [id]: rowErrors }));
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before saving.",
      });
      return;
    }

    try {
      const slugText = `${motorcycle.model_name}-${motorcycle.year_start}`.toLowerCase().replace(/\s+/g, '-');
      
      // Prepare data for saving
      const saveData = {
        model_name: motorcycle.model_name,
        brand_id: motorcycle.brand_id,
        year: motorcycle.year_start,
        summary: motorcycle.description,
        status: motorcycle.status,
        year_end: motorcycle.year_end,
        slug: slugText,
      };
      
      // Update existing or insert new
      let result;
      if (motorcycle.is_new) {
        // Insert new motorcycle
        result = await supabase
          .from("motorcycles")
          .insert(saveData)
          .select();
      } else {
        // Update existing motorcycle
        result = await supabase
          .from("motorcycles")
          .update(saveData)
          .eq("id", id)
          .select();
      }

      if (result.error) throw result.error;

      toast({
        title: motorcycle.is_new ? "Motorcycle Created" : "Changes Saved",
        description: `${motorcycle.model_name} has been ${motorcycle.is_new ? "added" : "updated"}.`,
      });

      // Update local state
      if (motorcycle.is_new && result.data && result.data[0]) {
        // Replace temporary ID with real one from database
        setMotorcycles(prev => 
          prev.map(m => m.id === id ? { 
            ...m, 
            id: result.data![0].id,
            is_new: false,
            isDirty: false 
          } : m)
        );
        
        // Update original data
        setOriginalData(prev => ({
          ...prev,
          [result.data![0].id]: { 
            ...motorcycle, 
            id: result.data![0].id,
            is_new: false,
            isDirty: false 
          }
        }));
      } else {
        // Update original data for existing row
        setOriginalData(prev => ({
          ...prev,
          [id]: { ...motorcycle, isDirty: false }
        }));
        
        // Mark row as no longer dirty
        setMotorcycles(prev => 
          prev.map(m => m.id === id ? { ...m, isDirty: false } : m)
        );
      }

      // Exit edit mode
      setEditingRows(prev => ({ ...prev, [id]: false }));
      setErrors(prev => ({ ...prev, [id]: {} }));
    } catch (error) {
      console.error("Error saving motorcycle:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving the motorcycle data.",
      });
    }
  };

  // Open the detailed editor
  const handleOpenDetailedEditor = (motorcycle: MotorcycleGridItem) => {
    // This will be implemented to open the existing detail editor
    console.log("Open detailed editor for:", motorcycle);
    // Implementation will connect to existing motorcycle dialog
  };

  return {
    handleAddRow,
    handleDeleteRow,
    handleSaveRow,
    handleOpenDetailedEditor
  };
};
