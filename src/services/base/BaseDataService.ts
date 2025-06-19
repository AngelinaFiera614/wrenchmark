
import { supabase } from "@/integrations/supabase/client";

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ServiceResponse<T[]> {
  count: number | null;
  hasMore: boolean;
}

export class BaseDataService {
  protected static async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: any; count?: number | null }>
  ): Promise<ServiceResponse<T>> {
    try {
      const { data, error, count } = await queryFn();
      
      if (error) {
        console.error('Database query error:', error);
        return {
          data: null,
          error: this.formatError(error),
          success: false
        };
      }
      
      return {
        data: data || null,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('Service execution error:', error);
      return {
        data: null,
        error: error.message || 'An unexpected error occurred',
        success: false
      };
    }
  }

  protected static async executePaginatedQuery<T>(
    queryFn: () => Promise<{ data: T[] | null; error: any; count?: number | null }>,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PaginatedResponse<T>> {
    try {
      const { data, error, count } = await queryFn();
      
      if (error) {
        console.error('Database query error:', error);
        return {
          data: null,
          error: this.formatError(error),
          success: false,
          count: null,
          hasMore: false
        };
      }
      
      const items = data || [];
      const totalCount = count || items.length;
      const hasMore = totalCount > (page * pageSize);
      
      return {
        data: items,
        error: null,
        success: true,
        count: totalCount,
        hasMore
      };
    } catch (error: any) {
      console.error('Service execution error:', error);
      return {
        data: null,
        error: error.message || 'An unexpected error occurred',
        success: false,
        count: null,
        hasMore: false
      };
    }
  }

  protected static formatError(error: any): string {
    if (error?.message) {
      // Handle specific Supabase errors
      if (error.message.includes('violates row-level security policy')) {
        return 'You do not have permission to perform this action.';
      }
      if (error.message.includes('duplicate key')) {
        return 'This item already exists. Please check for duplicates.';
      }
      if (error.message.includes('foreign key')) {
        return 'This item is referenced by other data and cannot be modified.';
      }
      if (error.message.includes('not found')) {
        return 'The requested item was not found.';
      }
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  protected static validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        return `${field.replace('_', ' ')} is required`;
      }
    }
    return null;
  }
}
