
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAssignmentActions = (model: any) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Fetch current assignments for this model
  const { data: assignments = [], refetch } = useQuery({
    queryKey: ['model-assignments', model?.id],
    queryFn: async () => {
      if (!model?.id) return [];
      const { data, error } = await supabase
        .from('model_component_assignments')
        .select('*')
        .eq('model_id', model.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!model?.id
  });

  const handleAssignComponent = async (componentType: string, componentId: string) => {
    setLoading(true);
    try {
      const existingAssignment = assignments.find(a => a.component_type === componentType);
      
      if (existingAssignment) {
        // Update existing assignment
        const { error } = await supabase
          .from('model_component_assignments')
          .update({ 
            component_id: componentId, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingAssignment.id);
        
        if (error) throw error;
      } else {
        // Create new assignment
        const { error } = await supabase
          .from('model_component_assignments')
          .insert({
            model_id: model.id,
            component_type: componentType,
            component_id: componentId,
            assignment_type: 'standard',
            is_default: true
          });
        
        if (error) throw error;
      }
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['model-assignments-status'] });
      
      toast({
        title: "Component Assigned",
        description: `${componentType.replace('_', ' ')} has been assigned to ${model.name}.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "Failed to assign component."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveComponent = async (componentType: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('model_component_assignments')
        .delete()
        .eq('model_id', model.id)
        .eq('component_type', componentType);
      
      if (error) throw error;
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['model-assignments-status'] });
      
      toast({
        title: "Component Removed",
        description: `${componentType.replace('_', ' ')} has been removed from ${model.name}.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Removal Failed",
        description: error.message || "Failed to remove component."
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    assignments,
    loading,
    handleAssignComponent,
    handleRemoveComponent,
    refetch
  };
};
