
import { supabase } from "@/integrations/supabase/client";

export interface WorkflowStatus {
  id: string;
  configuration_id: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  assigned_to?: string;
  reviewed_by?: string;
  approved_by?: string;
  notes?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const createWorkflow = async (configurationId: string, initialStatus: string = 'draft') => {
  try {
    const { data, error } = await supabase
      .from('configuration_workflow')
      .insert({
        configuration_id: configurationId,
        status: initialStatus
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
};

export const updateWorkflowStatus = async (
  configurationId: string,
  status: string,
  notes?: string,
  assignedTo?: string
) => {
  try {
    const updateData: any = { status };
    
    if (notes) updateData.notes = notes;
    if (assignedTo) updateData.assigned_to = assignedTo;
    
    // Set reviewer/approver based on status
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (status === 'review' && currentUserId) {
      updateData.reviewed_by = currentUserId;
    } else if (status === 'approved' && currentUserId) {
      updateData.approved_by = currentUserId;
    }

    const { data, error } = await supabase
      .from('configuration_workflow')
      .update(updateData)
      .eq('configuration_id', configurationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating workflow status:', error);
    throw error;
  }
};

export const getWorkflowStatus = async (configurationId: string): Promise<WorkflowStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('configuration_workflow')
      .select('*')
      .eq('configuration_id', configurationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error getting workflow status:', error);
    return null;
  }
};

export const getWorkflowsByStatus = async (status: string) => {
  try {
    const { data, error } = await supabase
      .from('configuration_workflow')
      .select(`
        *,
        model_configurations!inner(
          id,
          name,
          model_year_id,
          model_years!inner(
            year,
            motorcycle_id,
            motorcycle_models!inner(
              name,
              brands!inner(name)
            )
          )
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting workflows by status:', error);
    return [];
  }
};

export const assignWorkflow = async (configurationId: string, assignedTo: string) => {
  try {
    const { data, error } = await supabase
      .from('configuration_workflow')
      .update({ assigned_to: assignedTo })
      .eq('configuration_id', configurationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error assigning workflow:', error);
    throw error;
  }
};
