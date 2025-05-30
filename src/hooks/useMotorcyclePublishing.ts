
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMotorcyclePublishing = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const publishMotorcycles = async (motorcycleIds: string[]) => {
    if (motorcycleIds.length === 0) return false;

    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: false, updated_at: new Date().toISOString() })
        .in('id', motorcycleIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Published ${motorcycleIds.length} motorcycle${motorcycleIds.length > 1 ? 's' : ''}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error publishing motorcycles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to publish motorcycles",
      });
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  const unpublishMotorcycles = async (motorcycleIds: string[]) => {
    if (motorcycleIds.length === 0) return false;

    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: true, updated_at: new Date().toISOString() })
        .in('id', motorcycleIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Moved ${motorcycleIds.length} motorcycle${motorcycleIds.length > 1 ? 's' : ''} to drafts`,
      });

      return true;
    } catch (error: any) {
      console.error('Error unpublishing motorcycles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to unpublish motorcycles",
      });
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  const publishAllDrafts = async () => {
    setIsPublishing(true);
    try {
      // First get count of drafts
      const { count, error: countError } = await supabase
        .from('motorcycle_models')
        .select('*', { count: 'exact', head: true })
        .eq('is_draft', true);

      if (countError) throw countError;

      if (!count || count === 0) {
        toast({
          title: "No drafts",
          description: "No draft motorcycles found to publish",
        });
        return false;
      }

      // Publish all drafts
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: false, updated_at: new Date().toISOString() })
        .eq('is_draft', true);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Published all ${count} draft motorcycles`,
      });

      return true;
    } catch (error: any) {
      console.error('Error publishing all drafts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to publish all drafts",
      });
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publishMotorcycles,
    unpublishMotorcycles,
    publishAllDrafts,
    isPublishing
  };
};
