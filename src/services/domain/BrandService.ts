
import { BaseDataService, ServiceResponse } from "../base/BaseDataService";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types/motorcycle";

export class BrandService extends BaseDataService {
  static async getAll(): Promise<ServiceResponse<Brand[]>> {
    return this.executeQuery(async () => {
      return await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
    });
  }

  static async getById(id: string): Promise<ServiceResponse<Brand>> {
    return this.executeQuery(async () => {
      return await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();
    });
  }

  static async create(data: Partial<Brand>): Promise<ServiceResponse<Brand>> {
    const validationError = this.validateRequiredFields(data, ['name', 'slug']);
    if (validationError) {
      return {
        data: null,
        error: validationError,
        success: false
      };
    }

    return this.executeQuery(async () => {
      return await supabase
        .from('brands')
        .insert([data])
        .select('*')
        .single();
    });
  }

  static async update(id: string, updates: Partial<Brand>): Promise<ServiceResponse<Brand>> {
    return this.executeQuery(async () => {
      return await supabase
        .from('brands')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
    });
  }

  static async delete(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);
      
      return { data: true, error };
    });
  }
}
