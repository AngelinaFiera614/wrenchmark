
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { assignComponentToModel, removeComponentFromModel } from "@/services/modelComponent/assignmentService";
import { useComponentAssignmentRefresh } from "@/hooks/useComponentAssignmentRefresh";

export const useAssignmentActions = (model: any) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { refreshAfterAssignment } = useComponentAssignmentRefresh();

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
    if (!model?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No model selected"
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Assigning ${componentType} to model ${model.id}`);
      
      const result = await assignComponentToModel(model.id, componentType as any, componentId);
      
      if (result) {
        await Promise.all([
          refetch(),
          refreshAfterAssignment(model.id),
          queryClient.invalidateQueries({ queryKey: ['model-assignments-status'] })
        ]);
        
        toast({
          title: "Component Assigned",
          description: `${componentType.replace('_', ' ')} has been assigned to ${model.name}.`
        });
      } else {
        throw new Error('Assignment failed - no result returned');
      }
    } catch (error: any) {
      console.error('Assignment error:', error);
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
    if (!model?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No model selected"
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Removing ${componentType} from model ${model.id}`);
      
      await removeComponentFromModel(model.id, componentType as any);
      
      await Promise.all([
        refetch(),
        refreshAfterAssignment(model.id),
        queryClient.invalidateQueries({ queryKey: ['model-assignments-status'] })
      ]);
      
      toast({
        title: "Component Removed",
        description: `${componentType.replace('_', ' ')} has been removed from ${model.name}.`
      });
    } catch (error: any) {
      console.error('Removal error:', error);
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
