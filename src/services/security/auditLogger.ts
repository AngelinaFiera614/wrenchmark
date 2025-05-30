
import { supabase } from "@/integrations/supabase/client";

export interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
  user_agent?: string;
}

/**
 * Security audit logging service
 */
export class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;
  
  public static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  async logSecurityEvent(entry: AuditLogEntry): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('user_activity_log').insert({
        user_id: user?.id || null,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        details: {
          ...entry.details,
          severity: entry.severity,
          ip_address: entry.ip_address,
          user_agent: entry.user_agent,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  async logAdminAction(action: string, resourceType: string, resourceId?: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: `admin_${action}`,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      severity: 'medium'
    });
  }

  async logAuthenticationAttempt(success: boolean, email?: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: success ? 'auth_success' : 'auth_failure',
      resource_type: 'authentication',
      details: { email: email?.substring(0, 3) + '***', ...details }, // Partial email for privacy
      severity: success ? 'low' : 'medium'
    });
  }

  async logSuspiciousActivity(activity: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: 'suspicious_activity',
      resource_type: 'security',
      details: { activity, ...details },
      severity: 'high'
    });
  }

  async logDataAccess(resourceType: string, resourceId: string, action: 'read' | 'write' | 'delete'): Promise<void> {
    await this.logSecurityEvent({
      action: `data_${action}`,
      resource_type: resourceType,
      resource_id: resourceId,
      details: {},
      severity: action === 'delete' ? 'medium' : 'low'
    });
  }
}

export const auditLogger = SecurityAuditLogger.getInstance();
