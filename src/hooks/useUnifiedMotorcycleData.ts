
import { useState, useEffect } from 'react';
import { Motorcycle } from '@/types';
import { getModelComponentAssignments } from '@/services/modelComponentService';
import { supabase } from '@/integrations/supabase/client';

interface ComponentData {
  engine?: any;
  brake_system?: any;
  suspension?: any;
  frame?: any;
  wheel?: any;
}

interface UnifiedMotorcycleData {
  motorcycle: Motorcycle;
  components: ComponentData;
  configurations: any[];
  stats: any[];
  loading: boolean;
  error: string | null;
}

export const useUnifiedMotorcycleData = (motorcycle: Motorcycle): UnifiedMotorcycleData => {
  const [components, setComponents] = useState<ComponentData>({});
  const [configurations, setConfigurations] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUnifiedData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load component assignments
        const assignments = await getModelComponentAssignments(motorcycle.id);
        
        // Load actual component data
        const componentData: ComponentData = {};
        
        for (const assignment of assignments) {
          const { component_type, component_id } = assignment;
          
          try {
            let componentQuery;
            switch (component_type) {
              case 'engine':
                componentQuery = supabase.from('engines').select('*').eq('id', component_id).single();
                break;
              case 'brake_system':
                componentQuery = supabase.from('brake_systems').select('*').eq('id', component_id).single();
                break;
              case 'suspension':
                componentQuery = supabase.from('suspensions').select('*').eq('id', component_id).single();
                break;
              case 'frame':
                componentQuery = supabase.from('frames').select('*').eq('id', component_id).single();
                break;
              case 'wheel':
                componentQuery = supabase.from('wheels').select('*').eq('id', component_id).single();
                break;
              default:
                continue;
            }
            
            const { data, error: componentError } = await componentQuery;
            if (!componentError && data) {
              (componentData as any)[component_type] = data;
            }
          } catch (err) {
            console.warn(`Failed to load ${component_type} component:`, err);
          }
        }
        
        setComponents(componentData);

        // Load model years and configurations
        const { data: modelYears, error: yearError } = await supabase
          .from('model_years')
          .select(`
            *,
            model_configurations (
              *,
              motorcycle_stats (*)
            )
          `)
          .eq('motorcycle_id', motorcycle.id);

        if (yearError) throw yearError;

        const allConfigurations = modelYears?.flatMap(year => year.model_configurations || []) || [];
        const allStats = allConfigurations.flatMap(config => (config as any).motorcycle_stats || []);
        
        setConfigurations(allConfigurations);
        setStats(allStats);

      } catch (err) {
        console.error('Error loading unified motorcycle data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load motorcycle data');
      } finally {
        setLoading(false);
      }
    };

    if (motorcycle.id) {
      loadUnifiedData();
    }
  }, [motorcycle.id]);

  return {
    motorcycle,
    components,
    configurations,
    stats,
    loading,
    error
  };
};
