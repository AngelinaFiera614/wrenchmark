
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
    const { error } = await supabase.rpc('log_admin_action', {
      p_action: entry.action,
      p_table_name: entry.tableName,
      p_record_id: entry.recordId || null,
      p_old_values: entry.oldValues || null,
      p_new_values: entry.newValues || null,
    });

    if (error) {
      console.error('Failed to log admin action:', error);
    }
  } catch (error) {
    console.error('Error logging admin action:', error);
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
} as const;
