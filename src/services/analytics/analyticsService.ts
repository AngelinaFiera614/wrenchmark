
import { supabase } from "@/integrations/supabase/client";

export interface ConfigurationAnalytics {
  configuration_id: string;
  total_views: number;
  total_copies: number;
  total_edits: number;
  last_activity: string;
  popularity_score: number;
}

export interface ComponentUtilization {
  component_type: string;
  component_id: string;
  usage_count: number;
  popularity_percentage: number;
  component_name?: string;
}

export interface DataQualityMetrics {
  configuration_id: string;
  completeness_score: number;
  accuracy_score: number;
  consistency_score: number;
  overall_score: number;
  issues: string[];
}

export const trackUserAction = async (
  configurationId: string,
  actionType: 'view' | 'copy' | 'edit' | 'delete' | 'create',
  sessionId?: string
) => {
  try {
    const { error } = await supabase
      .from('configuration_analytics')
      .insert({
        configuration_id: configurationId,
        action_type: actionType,
        session_id: sessionId,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking user action:', error);
  }
};

export const getConfigurationAnalytics = async (): Promise<ConfigurationAnalytics[]> => {
  try {
    const { data, error } = await supabase
      .from('configuration_analytics')
      .select(`
        configuration_id,
        action_type,
        created_at
      `);

    if (error) throw error;

    // Aggregate the data
    const analytics = data.reduce((acc: Record<string, any>, row) => {
      const configId = row.configuration_id;
      if (!acc[configId]) {
        acc[configId] = {
          configuration_id: configId,
          total_views: 0,
          total_copies: 0,
          total_edits: 0,
          last_activity: row.created_at,
          popularity_score: 0
        };
      }

      switch (row.action_type) {
        case 'view':
          acc[configId].total_views++;
          break;
        case 'copy':
          acc[configId].total_copies++;
          break;
        case 'edit':
          acc[configId].total_edits++;
          break;
      }

      if (new Date(row.created_at) > new Date(acc[configId].last_activity)) {
        acc[configId].last_activity = row.created_at;
      }

      return acc;
    }, {});

    // Calculate popularity scores
    Object.values(analytics).forEach((config: any) => {
      config.popularity_score = (config.total_views * 1) + (config.total_copies * 3) + (config.total_edits * 2);
    });

    return Object.values(analytics) as ConfigurationAnalytics[];
  } catch (error) {
    console.error('Error fetching configuration analytics:', error);
    return [];
  }
};

export const getComponentUtilization = async (): Promise<ComponentUtilization[]> => {
  try {
    const { data, error } = await supabase
      .from('component_utilization')
      .select(`
        component_type,
        component_id,
        usage_date
      `);

    if (error) throw error;

    const utilization = data.reduce((acc: Record<string, any>, row) => {
      const key = `${row.component_type}-${row.component_id}`;
      if (!acc[key]) {
        acc[key] = {
          component_type: row.component_type,
          component_id: row.component_id,
          usage_count: 0
        };
      }
      acc[key].usage_count++;
      return acc;
    }, {});

    const totalUsage = Object.values(utilization).reduce((sum: number, item: any) => sum + item.usage_count, 0);

    return Object.values(utilization).map((item: any) => ({
      ...item,
      popularity_percentage: totalUsage > 0 ? (item.usage_count / totalUsage) * 100 : 0
    })) as ComponentUtilization[];
  } catch (error) {
    console.error('Error fetching component utilization:', error);
    return [];
  }
};

export const calculateDataQuality = async (configurationId: string): Promise<DataQualityMetrics | null> => {
  try {
    const { data: config, error } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', configurationId)
      .single();

    if (error) throw error;

    const issues: string[] = [];
    let completeness = 0;
    let accuracy = 0;
    let consistency = 0;

    // Check completeness
    const requiredFields = ['name', 'model_year_id'];
    const optionalFields = ['engine_id', 'brake_system_id', 'frame_id', 'suspension_id', 'wheel_id', 'seat_height_mm', 'weight_kg'];
    
    const completedRequired = requiredFields.filter(field => config[field]).length;
    const completedOptional = optionalFields.filter(field => config[field]).length;
    
    completeness = ((completedRequired / requiredFields.length) * 70) + ((completedOptional / optionalFields.length) * 30);

    if (completedRequired < requiredFields.length) {
      issues.push('Missing required fields');
    }

    // Check accuracy (basic validation)
    accuracy = 100;
    if (config.seat_height_mm && (config.seat_height_mm < 600 || config.seat_height_mm > 1000)) {
      accuracy -= 15;
      issues.push('Unusual seat height value');
    }
    if (config.weight_kg && (config.weight_kg < 50 || config.weight_kg > 500)) {
      accuracy -= 15;
      issues.push('Unusual weight value');
    }

    // Check consistency
    consistency = 100;
    if (config.price_premium_usd && config.price_premium_usd < 0) {
      consistency -= 20;
      issues.push('Negative price premium');
    }

    const overall = (completeness + accuracy + consistency) / 3;

    const qualityMetrics: DataQualityMetrics = {
      configuration_id: configurationId,
      completeness_score: Math.round(completeness * 100) / 100,
      accuracy_score: Math.round(accuracy * 100) / 100,
      consistency_score: Math.round(consistency * 100) / 100,
      overall_score: Math.round(overall * 100) / 100,
      issues
    };

    // Store in database
    await supabase
      .from('data_quality_metrics')
      .upsert(qualityMetrics);

    return qualityMetrics;
  } catch (error) {
    console.error('Error calculating data quality:', error);
    return null;
  }
};

export const detectAnomalies = async (configurationId: string) => {
  try {
    const { data: config, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        model_years!inner(
          motorcycle_id,
          year
        )
      `)
      .eq('id', configurationId)
      .single();

    if (error) throw error;

    const anomalies: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      suggestedFix: string;
    }> = [];

    // Price anomaly detection
    if (config.price_premium_usd && config.price_premium_usd > 10000) {
      anomalies.push({
        type: 'price_inconsistency',
        severity: 'high',
        description: 'Price premium seems unusually high',
        suggestedFix: 'Review pricing data or consider if this is a special edition'
      });
    }

    // Weight vs engine size correlation
    if (config.weight_kg && config.weight_kg < 100 && config.engine_id) {
      anomalies.push({
        type: 'spec_mismatch',
        severity: 'medium',
        description: 'Very low weight for a motorcycle with engine',
        suggestedFix: 'Verify weight measurement unit and accuracy'
      });
    }

    // Store anomalies
    for (const anomaly of anomalies) {
      await supabase
        .from('anomaly_detection_log')
        .insert({
          configuration_id: configurationId,
          anomaly_type: anomaly.type,
          severity: anomaly.severity,
          description: anomaly.description,
          suggested_fix: anomaly.suggestedFix
        });
    }

    return anomalies;
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    return [];
  }
};
