
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  action: string;
  resourceType: string;
  resourceId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Security audit logging service for tracking security-related events
 */
export class SecurityAuditService {
  
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Get client information if available
      const userAgent = navigator?.userAgent || event.userAgent;
      
      // Call the database function to log the security event
      const { error } = await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource_type: event.resourceType,
        p_resource_id: event.resourceId || null,
        p_severity: event.severity,
        p_details: event.details || null
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  // Specific logging methods for common security events
  static async logXSSAttempt(content: string, location: string): Promise<void> {
    await this.logSecurityEvent({
      action: 'xss_attempt_blocked',
      resourceType: 'content_security',
      severity: 'high',
      details: {
        location,
        contentLength: content.length,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async logInvalidFileUpload(fileName: string, fileType: string, reason: string): Promise<void> {
    await this.logSecurityEvent({
      action: 'invalid_file_upload',
      resourceType: 'file_security',
      severity: 'medium',
      details: {
        fileName,
        fileType,
        reason,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async logRateLimitExceeded(endpoint: string, identifier: string): Promise<void> {
    await this.logSecurityEvent({
      action: 'rate_limit_exceeded',
      resourceType: 'api_security',
      severity: 'medium',
      details: {
        endpoint,
        identifier,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async logPasswordValidationFailure(errors: string[]): Promise<void> {
    await this.logSecurityEvent({
      action: 'password_validation_failed',
      resourceType: 'authentication_security',
      severity: 'low',
      details: {
        errors,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async logSuspiciousActivity(activity: string, details: Record<string, any>): Promise<void> {
    await this.logSecurityEvent({
      action: 'suspicious_activity_detected',
      resourceType: 'general_security',
      severity: 'high',
      details: {
        activity,
        ...details,
        timestamp: new Date().toISOString()
      }
    });
  }
}
