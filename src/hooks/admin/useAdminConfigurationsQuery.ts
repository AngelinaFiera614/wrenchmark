
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminConfigurationsQuery = (selectedYear?: string, selectedModel?: string) => {
  return useQuery({
    queryKey: ["admin-configurations", selectedYear, selectedModel],
    queryFn: async () => {
      console.log("=== FETCHING ADMIN CONFIGURATIONS ===");
      console.log("Selected year:", selectedYear);
      console.log("Selected model:", selectedModel);

      if (!selectedYear) {
        console.log("No year selected, returning empty array");
        return [];
      }

      // Build the query with proper joins to get component data
      let query = supabase
        .from("model_configurations")
        .select(`
          *,
          model_years!inner(
            id,
            year,
            motorcycle_id,
            motorcycle_models!inner(
              id,
              name,
              slug,
              brand_id,
              brands(name)
            )
          ),
          engines:engine_id(
            id,
            name,
            displacement_cc,
            power_hp,
            torque_nm,
            engine_type
          ),
          brake_systems:brake_system_id(
            id,
            type,
            brake_type_front,
            brake_type_rear,
            has_traction_control
          ),
          frames:frame_id(
            id,
            type,
            material,
            construction_method
          ),
          suspensions:suspension_id(
            id,
            front_type,
            rear_type,
            brand,
            adjustability
          ),
          wheels:wheel_id(
            id,
            type,
            front_size,
            rear_size,
            rim_material
          )
        `)
        .eq("model_years.id", selectedYear);

      // Add model filter if specified
      if (selectedModel) {
        query = query.eq("model_years.motorcycle_id", selectedModel);
      }

      const { data, error } = await query.order("name");

      if (error) {
        console.error("Error fetching configurations:", error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} configurations`);
      
      // For configurations missing components, get effective components via inheritance
      if (data && data.length > 0) {
        const enrichedData = await Promise.all(
          data.map(async (config) => {
            try {
              // Get effective components for this configuration
              const { data: effectiveComponents, error: effectiveError } = await supabase
                .rpc('get_effective_components', { config_id: config.id });

              if (effectiveError) {
                console.warn(`Error getting effective components for config ${config.id}:`, effectiveError);
                return config;
              }

              const effective = effectiveComponents?.[0];
              if (!effective) {
                return config;
              }

              // Fetch inherited components if they're missing
              const promises = [];
              
              if (!config.engines && effective.engine_id) {
                promises.push(
                  supabase.from('engines').select('*').eq('id', effective.engine_id).single()
                    .then(({ data }) => ({ type: 'engine', data, inherited: effective.engine_inherited }))
                );
              }
              
              if (!config.brake_systems && effective.brake_system_id) {
                promises.push(
                  supabase.from('brake_systems').select('*').eq('id', effective.brake_system_id).single()
                    .then(({ data }) => ({ type: 'brake_system', data, inherited: effective.brake_system_inherited }))
                );
              }
              
              if (!config.frames && effective.frame_id) {
                promises.push(
                  supabase.from('frames').select('*').eq('id', effective.frame_id).single()
                    .then(({ data }) => ({ type: 'frame', data, inherited: effective.frame_inherited }))
                );
              }
              
              if (!config.suspensions && effective.suspension_id) {
                promises.push(
                  supabase.from('suspensions').select('*').eq('id', effective.suspension_id).single()
                    .then(({ data }) => ({ type: 'suspension', data, inherited: effective.suspension_inherited }))
                );
              }
              
              if (!config.wheels && effective.wheel_id) {
                promises.push(
                  supabase.from('wheels').select('*').eq('id', effective.wheel_id).single()
                    .then(({ data }) => ({ type: 'wheel', data, inherited: effective.wheel_inherited }))
                );
              }

              if (promises.length > 0) {
                const inheritedComponents = await Promise.all(promises);
                const enrichedConfig = { ...config };
                
                inheritedComponents.forEach(({ type, data, inherited }) => {
                  if (data) {
                    if (type === 'engine') enrichedConfig.engines = { ...data, _inherited: inherited };
                    else if (type === 'brake_system') enrichedConfig.brake_systems = { ...data, _inherited: inherited };
                    else if (type === 'frame') enrichedConfig.frames = { ...data, _inherited: inherited };
                    else if (type === 'suspension') enrichedConfig.suspensions = { ...data, _inherited: inherited };
                    else if (type === 'wheel') enrichedConfig.wheels = { ...data, _inherited: inherited };
                  }
                });
                
                return enrichedConfig;
              }
              
              return config;
            } catch (err) {
              console.warn(`Error enriching config ${config.id}:`, err);
              return config;
            }
          })
        );
        
        return enrichedData;
      }

      return data || [];
    },
    enabled: !!selectedYear,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
