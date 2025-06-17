
import { supabase } from "@/integrations/supabase/client";

export interface SecurityEvent {
  action: string;
  resource_type: string;
  resource_id?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

/**
 * Enhanced security audit logging service with direct database integration
 */
export class EnhancedSecurityAuditLogger {
  private static instance: EnhancedSecurityAuditLogger;
  
  public static getInstance(): EnhancedSecurityAuditLogger {
    if (!EnhancedSecurityAuditLogger.instance) {
      EnhancedSecurityAuditLogger.instance = new EnhancedSecurityAuditLogger();
    }
    return EnhancedSecurityAuditLogger.instance;
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { error } = await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource_type: event.resource_type,
        p_resource_id: event.resource_id || null,
        p_severity: event.severity || 'medium',
        p_details: event.details || null
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  async logComponentOperation(action: string, componentType: string, componentId?: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: `component_${action}`,
      resource_type: componentType,
      resource_id: componentId,
      details: {
        ...details,
        timestamp: new Date().toISOString()
      },
      severity: action === 'delete' ? 'high' : 'medium'
    });
  }

  async logAdminAction(action: string, resourceType: string, resourceId?: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: `admin_${action}`,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      severity: 'high'
    });
  }

  async logAuthenticationAttempt(success: boolean, email?: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: success ? 'auth_success' : 'auth_failure',
      resource_type: 'authentication',
      details: { 
        email: email ? email.substring(0, 3) + '***' : undefined, 
        ...details 
      },
      severity: success ? 'low' : 'medium'
    });
  }

  async logSuspiciousActivity(activity: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: 'suspicious_activity',
      resource_type: 'security',
      details: { activity, ...details },
      severity: 'critical'
    });
  }
}

export const enhancedAuditLogger = EnhancedSecurityAuditLogger.getInstance();
