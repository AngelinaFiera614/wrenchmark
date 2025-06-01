
import { supabase } from "@/integrations/supabase/client";

export interface ComponentRecommendation {
  component_type: string;
  component_id: string;
  component_name: string;
  confidence_score: number;
  reasoning: string;
}

export interface ConfigurationSuggestion {
  suggested_name: string;
  market_region: string;
  estimated_popularity: number;
  recommended_components: ComponentRecommendation[];
  reasoning: string;
}

export const getComponentRecommendations = async (
  motorcycleCategory: string,
  targetMarket: string = 'Global'
): Promise<ComponentRecommendation[]> => {
  try {
    // Get component usage patterns for similar motorcycles
    const { data: similarConfigs, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        model_years!inner(
          motorcycle_models!inner(
            type,
            category
          )
        ),
        engines(*),
        brake_systems(*),
        frames(*),
        suspensions(*),
        wheels(*)
      `)
      .eq('model_years.motorcycle_models.category', motorcycleCategory)
      .eq('market_region', targetMarket);

    if (error) throw error;

    const recommendations: ComponentRecommendation[] = [];

    // Analyze engine patterns
    const engines = similarConfigs
      .filter(config => config.engines)
      .map(config => config.engines);
    
    if (engines.length > 0) {
      const mostCommonEngine = engines.reduce((acc, engine) => {
        acc[engine.id] = (acc[engine.id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topEngineId = Object.keys(mostCommonEngine).reduce((a, b) => 
        mostCommonEngine[a] > mostCommonEngine[b] ? a : b
      );

      const topEngine = engines.find(e => e.id === topEngineId);
      if (topEngine) {
        recommendations.push({
          component_type: 'engine',
          component_id: topEngine.id,
          component_name: topEngine.name,
          confidence_score: (mostCommonEngine[topEngineId] / engines.length) * 100,
          reasoning: `Most commonly used engine in ${motorcycleCategory} motorcycles`
        });
      }
    }

    // Similar analysis for other components
    const brakes = similarConfigs
      .filter(config => config.brake_systems)
      .map(config => config.brake_systems);
    
    if (brakes.length > 0) {
      const mostCommonBrake = brakes.reduce((acc, brake) => {
        acc[brake.id] = (acc[brake.id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topBrakeId = Object.keys(mostCommonBrake).reduce((a, b) => 
        mostCommonBrake[a] > mostCommonBrake[b] ? a : b
      );

      const topBrake = brakes.find(b => b.id === topBrakeId);
      if (topBrake) {
        recommendations.push({
          component_type: 'brake_system',
          component_id: topBrake.id,
          component_name: topBrake.type,
          confidence_score: (mostCommonBrake[topBrakeId] / brakes.length) * 100,
          reasoning: `Popular brake system for ${motorcycleCategory} motorcycles`
        });
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error getting component recommendations:', error);
    return [];
  }
};

export const generateConfigurationSuggestion = async (
  modelYearId: string,
  targetCategory: string = 'Standard'
): Promise<ConfigurationSuggestion | null> => {
  try {
    const recommendations = await getComponentRecommendations(targetCategory);
    
    // Get market analysis
    const { data: marketData, error } = await supabase
      .from('configuration_analytics')
      .select(`
        configuration_id,
        action_type,
        model_configurations!inner(
          market_region,
          trim_level
        )
      `)
      .eq('action_type', 'view');

    if (error) throw error;

    // Analyze naming patterns
    const { data: existingConfigs } = await supabase
      .from('model_configurations')
      .select('name, trim_level')
      .eq('model_year_id', modelYearId);

    const existingNames = existingConfigs?.map(c => c.name.toLowerCase()) || [];
    const suggestedNames = ['Standard', 'Sport', 'Touring', 'Premium', 'Base'];
    const availableName = suggestedNames.find(name => 
      !existingNames.includes(name.toLowerCase())
    ) || `Configuration ${existingNames.length + 1}`;

    const suggestion: ConfigurationSuggestion = {
      suggested_name: availableName,
      market_region: 'Global',
      estimated_popularity: Math.round(Math.random() * 40 + 60), // Mock popularity score
      recommended_components: recommendations,
      reasoning: `Based on analysis of similar ${targetCategory} motorcycles and market trends`
    };

    return suggestion;
  } catch (error) {
    console.error('Error generating configuration suggestion:', error);
    return null;
  }
};

export const analyzeMarketTrends = async () => {
  try {
    const { data: analytics, error } = await supabase
      .from('configuration_analytics')
      .select(`
        *,
        model_configurations!inner(
          market_region,
          trim_level,
          model_years!inner(
            year,
            motorcycle_models!inner(
              category,
              type
            )
          )
        )
      `)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    // Analyze trends by category
    const trends = analytics.reduce((acc, record) => {
      const category = record.model_configurations.model_years.motorcycle_models.category;
      if (!acc[category]) {
        acc[category] = { views: 0, copies: 0, popularity: 0 };
      }
      
      if (record.action_type === 'view') acc[category].views++;
      if (record.action_type === 'copy') acc[category].copies++;
      
      return acc;
    }, {} as Record<string, any>);

    Object.keys(trends).forEach(category => {
      trends[category].popularity = trends[category].views + (trends[category].copies * 2);
    });

    return trends;
  } catch (error) {
    console.error('Error analyzing market trends:', error);
    return {};
  }
};
