
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useComponentData = () => {
  // Fetch available components
  const { data: engines = [] } = useQuery({
    queryKey: ['engines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engines')
        .select('id, name, displacement_cc, power_hp')
        .eq('is_draft', false)
        .order('displacement_cc');
      if (error) throw error;
      return data;
    }
  });

  const { data: brakes = [] } = useQuery({
    queryKey: ['brakes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brake_systems')
        .select('id, type, has_abs, has_traction_control')
        .eq('is_draft', false)
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: frames = [] } = useQuery({
    queryKey: ['frames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('frames')
        .select('id, type, material')
        .eq('is_draft', false)
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: suspensions = [] } = useQuery({
    queryKey: ['suspensions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suspensions')
        .select('id, front_type, rear_type, brand')
        .eq('is_draft', false)
        .order('front_type');
      if (error) throw error;
      return data;
    }
  });

  const { data: wheels = [] } = useQuery({
    queryKey: ['wheels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wheels')
        .select('id, type, front_size, rear_size')
        .eq('is_draft', false)
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  return {
    engines,
    brakes,
    frames,
    suspensions,
    wheels,
    getComponentDataByType: (componentType: string) => {
      switch (componentType) {
        case 'engine': return engines;
        case 'brake_system': return brakes;
        case 'frame': return frames;
        case 'suspension': return suspensions;
        case 'wheel': return wheels;
        default: return [];
      }
    }
  };
};
