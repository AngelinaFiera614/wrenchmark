
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { RidingSkill } from '@/types/riding-skills';

export const useRidingSkills = () => {
  const { data: skills, isLoading, refetch } = useQuery({
    queryKey: ['admin-riding-skills'],
    queryFn: async (): Promise<RidingSkill[]> => {
      try {
        const { data, error } = await supabase
          .from('riding_skills')
          .select('*')
          .order('title', { ascending: true });
          
        if (error) throw error;
        return data as RidingSkill[];
      } catch (error: any) {
        toast.error('Failed to load riding skills');
        console.error('Error loading riding skills:', error);
        return [];
      }
    },
  });

  return { skills: skills || [], isLoading, refetch };
};
