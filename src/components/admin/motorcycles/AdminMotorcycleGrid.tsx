
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Check, X, Plus, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllBrands } from "@/services/brandService";
import { EditableTextCell } from "./cells/EditableTextCell";
import { EditableNumberCell } from "./cells/EditableNumberCell";
import { EditableBrandCell } from "./cells/EditableBrandCell";
import { EditableStatusCell } from "./cells/EditableStatusCell";
import { Brand } from "@/types";

type MotorcycleGridItem = {
  id: string;
  model_name: string;
  brand_id: string;
  brand_name?: string;
  year_start?: number;
  year_end?: number | null;
  description?: string;
  status?: string;
  is_new?: boolean;
  isDirty?: boolean;
};

export function AdminMotorcycleGrid() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleGridItem[]>([]);
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [originalData, setOriginalData] = useState<Record<string, MotorcycleGridItem>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const { toast } = useToast();

  // Load brands for dropdown
  const { data: brands = [] } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getAllBrands
  });

  // Fetch motorcycles with brand info
  const fetchMotorcycles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("motorcycles")
        .select(`
          id,
          model_name,
          brand_id,
          year,
          summary,
          status,
          year_end,
          brands:brand_id (
            id,
            name
          )
        `)
        .order("model_name");

      if (error) throw error;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Failed to load motorcycles",
          description: "No data was returned from the database.",
        });
        setIsLoading(false);
        return;
      }

      // Transform data for the grid
      const formattedData = data.map((item: any) => ({
        id: item.id,
        model_name: item.model_name,
        brand_id: item.brand_id,
        brand_name: item.brands?.name || "Unknown",
        year_start: item.year || undefined,
        year_end: item.year_end || null,
        description: item.summary || "", // Use summary instead of description
        status: item.status || "draft",
        isDirty: false,
      }));

      setMotorcycles(formattedData);
      
      // Initialize original data for cancel operations
      const originalMap: Record<string, MotorcycleGridItem> = {};
      formattedData.forEach(item => {
        originalMap[item.id] = { ...item };
      });
      setOriginalData(originalMap);
    } catch (error) {
      console.error("Error fetching motorcycles:", error);
      toast({
        variant: "destructive",
        title: "Failed to load motorcycles",
        description: "There was an error loading the motorcycle data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  // Start editing a row
  const handleEditRow = (id: string) => {
    setEditingRows(prev => ({ ...prev, [id]: true }));
  };

  // Cancel editing a row
  const handleCancelEdit = (id: string) => {
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

  // Handle cell value changes
  const handleCellChange = (id: string, field: string, value: any) => {
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

  // Open the detailed editor
  const handleOpenDetailedEditor = (motorcycle: MotorcycleGridItem) => {
    // This will be implemented to open the existing detail editor
    console.log("Open detailed editor for:", motorcycle);
    // Implementation will connect to existing motorcycle dialog
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year Start</TableHead>
              <TableHead>Year End</TableHead>
              <TableHead>Model Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {motorcycles.map((motorcycle) => (
              <TableRow 
                key={motorcycle.id}
                className={motorcycle.isDirty ? "bg-muted/20" : ""}
              >
                <TableCell>
                  <EditableNumberCell
                    value={motorcycle.year_start}
                    isEditing={editingRows[motorcycle.id]}
                    onChange={(value) => handleCellChange(motorcycle.id, "year_start", value)}
                    error={errors[motorcycle.id]?.year_start}
                    min={1885}
                    max={new Date().getFullYear() + 5}
                  />
                </TableCell>
                <TableCell>
                  <EditableNumberCell
                    value={motorcycle.year_end}
                    isEditing={editingRows[motorcycle.id]}
                    onChange={(value) => handleCellChange(motorcycle.id, "year_end", value)}
                    allowNull
                    min={motorcycle.year_start || 1885}
                    max={2100}
                    placeholder="Present"
                  />
                </TableCell>
                <TableCell>
                  <EditableTextCell
                    value={motorcycle.model_name}
                    isEditing={editingRows[motorcycle.id]}
                    onChange={(value) => handleCellChange(motorcycle.id, "model_name", value)}
                    error={errors[motorcycle.id]?.model_name}
                  />
                </TableCell>
                <TableCell>
                  <EditableBrandCell
                    value={motorcycle.brand_id}
                    displayValue={motorcycle.brand_name || ""}
                    isEditing={editingRows[motorcycle.id]}
                    onChange={(value) => handleCellChange(motorcycle.id, "brand_id", value)}
                    brands={brands}
                    error={errors[motorcycle.id]?.brand_id}
                  />
                </TableCell>
                <TableCell>
                  <EditableTextCell
                    value={motorcycle.description || ""}
                    isEditing={editingRows[motorcycle.id]}
                    onChange={(value) => handleCellChange(motorcycle.id, "description", value)}
                  />
                </TableCell>
                <TableCell>
                  <EditableStatusCell
                    value={motorcycle.status || "draft"}
                    isEditing={editingRows[motorcycle.id]}
                    onChange={(value) => handleCellChange(motorcycle.id, "status", value)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {editingRows[motorcycle.id] ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSaveRow(motorcycle.id)}
                          disabled={!motorcycle.isDirty}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCancelEdit(motorcycle.id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditRow(motorcycle.id)}
                        >
                          <span className="sr-only">Edit</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDetailedEditor(motorcycle)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDeleteRow(motorcycle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleAddRow} className="gap-1">
          <Plus className="h-4 w-4" /> Add Motorcycle
        </Button>
      </div>
    </div>
  );
}
