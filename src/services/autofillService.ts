
import { supabase } from "@/integrations/supabase/client";
import { ModelSuggestion, ModelFetchLog, FetchedModelData } from "@/types/autofill";

class AutofillService {
  // Fetch model data from external sources (mock implementation for now)
  async fetchModelData(brandName: string, modelName: string): Promise<FetchedModelData | null> {
    try {
      // Mock data implementation - in production this would call external APIs
      const mockData = this.getMockDataForModel(brandName, modelName);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockData;
    } catch (error) {
      console.error('Error fetching model data:', error);
      return null;
    }
  }

  // Store suggestions in database
  async storeSuggestions(
    motorcycleModelId: string, 
    suggestedData: FetchedModelData, 
    source?: string
  ): Promise<ModelSuggestion | null> {
    try {
      const { data, error } = await supabase
        .from('model_suggestions')
        .insert({
          motorcycle_model_id: motorcycleModelId,
          suggested_data: suggestedData,
          source: source || 'Mock API',
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing suggestions:', error);
      return null;
    }
  }

  // Get stored suggestions for a model
  async getSuggestions(motorcycleModelId: string): Promise<ModelSuggestion | null> {
    try {
      const { data, error } = await supabase
        .from('model_suggestions')
        .select('*')
        .eq('motorcycle_model_id', motorcycleModelId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return null;
    }
  }

  // Apply selected fields to model
  async applySelectedFields(
    motorcycleModelId: string,
    selectedFields: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update(selectedFields)
        .eq('id', motorcycleModelId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error applying fields:', error);
      return false;
    }
  }

  // Log fetch attempt or action
  async logAction(
    motorcycleModelId: string,
    actionType: 'fetch' | 'apply' | 'ignore',
    appliedFields: Record<string, any> = {},
    rejectedFields: Record<string, any> = {},
    source?: string,
    notes?: string
  ): Promise<void> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      await supabase
        .from('model_fetch_logs')
        .insert({
          motorcycle_model_id: motorcycleModelId,
          user_id: user.data.user.id,
          action_type: actionType,
          applied_fields: appliedFields,
          rejected_fields: rejectedFields,
          source,
          notes
        });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  // Set ignore autofill flag
  async setIgnoreAutofill(motorcycleModelId: string, ignore: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ ignore_autofill: ignore })
        .eq('id', motorcycleModelId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error setting ignore flag:', error);
      return false;
    }
  }

  // Mock data generator for testing
  private getMockDataForModel(brandName: string, modelName: string): FetchedModelData {
    const mockDatabase: Record<string, Record<string, FetchedModelData>> = {
      'Kawasaki': {
        'Ninja 300': {
          type: 'Sport',
          engine_size: 296,
          horsepower: 39,
          torque_nm: 27,
          top_speed_kph: 180,
          weight_kg: 172,
          seat_height_mm: 785,
          fuel_capacity_l: 17,
          has_abs: true,
          base_description: 'The Ninja 300 is a beginner-friendly sport bike with a parallel-twin engine, offering excellent handling and fuel efficiency.',
          default_image_url: 'https://example.com/ninja300.jpg',
          production_start_year: 2013
        }
      },
      'Honda': {
        'CBR600RR': {
          type: 'Sport',
          engine_size: 599,
          horsepower: 118,
          torque_nm: 64,
          top_speed_kph: 260,
          weight_kg: 194,
          seat_height_mm: 820,
          fuel_capacity_l: 18.1,
          has_abs: true,
          base_description: 'The CBR600RR is a high-performance supersport motorcycle featuring advanced electronics and track-focused design.',
          default_image_url: 'https://example.com/cbr600rr.jpg',
          production_start_year: 2003
        }
      }
    };

    const brandData = mockDatabase[brandName];
    if (brandData && brandData[modelName]) {
      return brandData[modelName];
    }

    // Return generic data if specific model not found
    return {
      type: 'Standard',
      engine_size: 400,
      horsepower: 40,
      torque_nm: 35,
      top_speed_kph: 160,
      weight_kg: 180,
      seat_height_mm: 800,
      fuel_capacity_l: 15,
      has_abs: false,
      base_description: `The ${modelName} is a versatile motorcycle from ${brandName}.`,
      production_start_year: 2020
    };
  }
}

export const autofillService = new AutofillService();
