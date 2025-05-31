
import { supabase } from "@/integrations/supabase/client";

export interface AuditLogEntry {
  action: string;
  tableName: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export const logAdminAction = async (entry: AuditLogEntry): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user for audit logging');
      return;
    }

    // Try to use the existing admin_audit_log table if it exists
    const { error } = await supabase
      .from('admin_audit_log')
      .insert({
        user_id: user.id,
        action: entry.action,
        table_name: entry.tableName,
        record_id: entry.recordId || null,
        old_values: entry.oldValues || null,
        new_values: entry.newValues || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      // If the table doesn't exist or there's an error, log to console for now
      console.log('Admin action (audit log unavailable):', {
        user_id: user.id,
        action: entry.action,
        table_name: entry.tableName,
        record_id: entry.recordId,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw - logging failures shouldn't break the main flow
  }
};

export const auditActions = {
  MOTORCYCLE_CREATE: 'motorcycle_create',
  MOTORCYCLE_UPDATE: 'motorcycle_update',
  MOTORCYCLE_DELETE: 'motorcycle_delete',
  MOTORCYCLE_PUBLISH: 'motorcycle_publish',
  MOTORCYCLE_UNPUBLISH: 'motorcycle_unpublish',
  BRAND_CREATE: 'brand_create',
  BRAND_UPDATE: 'brand_update',
  BRAND_DELETE: 'brand_delete',
  USER_ROLE_CHANGE: 'user_role_change',
  MANUAL_UPLOAD: 'manual_upload',
  MANUAL_DELETE: 'manual_delete',
  ADMIN_VIEW_RECENT_BRANDS: 'admin_view_recent_brands',
  ADMIN_VIEW_RECENT_MOTORCYCLES: 'admin_view_recent_motorcycles',
} as const;
