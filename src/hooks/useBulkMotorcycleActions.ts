
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";

export const useBulkMotorcycleActions = () => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (motorcycles: Motorcycle[]) => {
    setSelectedIds(motorcycles.map(m => m.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkPublish = async (onSuccess?: () => void) => {
    if (selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: false })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Motorcycles Published",
        description: `${selectedIds.length} motorcycles have been published.`
      });

      setSelectedIds([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error publishing motorcycles:', error);
      toast({
        title: "Error",
        description: "Failed to publish motorcycles.",
        variant: "destructive"
      });
    }
  };

  const handleBulkDraft = async (onSuccess?: () => void) => {
    if (selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: true })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Motorcycles Drafted",
        description: `${selectedIds.length} motorcycles have been marked as drafts.`
      });

      setSelectedIds([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error drafting motorcycles:', error);
      toast({
        title: "Error",
        description: "Failed to mark motorcycles as drafts.",
        variant: "destructive"
      });
    }
  };

  const handleBulkExport = (motorcycles: Motorcycle[]) => {
    const selectedMotorcycles = motorcycles.filter(m => selectedIds.includes(m.id));
    
    const exportData = selectedMotorcycles.map(motorcycle => ({
      id: motorcycle.id,
      name: motorcycle.name,
      brand: motorcycle.brand?.name || motorcycle.brands?.name || 'Unknown',
      type: motorcycle.type,
      production_start_year: motorcycle.production_start_year,
      is_draft: motorcycle.is_draft,
      engine_size: motorcycle.engine_size,
      horsepower: motorcycle.horsepower,
      weight_kg: motorcycle.weight_kg
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `motorcycles_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: `${selectedIds.length} motorcycles exported successfully.`
    });
  };

  const handleBulkDelete = async (onSuccess?: () => void) => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} motorcycles? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Motorcycles Deleted",
        description: `${selectedIds.length} motorcycles have been deleted.`
      });

      setSelectedIds([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting motorcycles:', error);
      toast({
        title: "Error",
        description: "Failed to delete motorcycles.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedIds,
    handleSelect,
    handleSelectAll,
    handleClearSelection,
    handleBulkPublish,
    handleBulkDraft,
    handleBulkExport,
    handleBulkDelete
  };
};
