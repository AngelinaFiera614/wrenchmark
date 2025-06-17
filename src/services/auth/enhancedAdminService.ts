
import { supabase } from "@/integrations/supabase/client";
import { enhancedAuditLogger } from "../security/enhancedAuditLogger";

/**
 * Enhanced admin verification service with improved security
 */
export async function verifyEnhancedAdminStatus(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      await enhancedAuditLogger.logSuspiciousActivity('admin_check_no_user_id');
      return false;
    }
    
    console.log("[enhancedAdminService] Verifying admin status for user:", userId);
    
    // Use the database function for consistency
    const { data, error } = await supabase.rpc('current_user_is_admin');
    
    if (error) {
      console.error("[enhancedAdminService] Error checking admin status:", error);
      await enhancedAuditLogger.logSecurityEvent({
        action: 'admin_check_error',
        resource_type: 'authentication',
        details: { error: error.message },
        severity: 'high'
      });
      return false;
    }
    
    const isAdmin = !!data;
    
    // Log admin access attempts
    await enhancedAuditLogger.logSecurityEvent({
      action: 'admin_verification',
      resource_type: 'authentication',
      details: { 
        user_id: userId,
        admin_status: isAdmin,
        verification_method: 'database_function'
      },
      severity: isAdmin ? 'low' : 'medium'
    });
    
    console.log(`[enhancedAdminService] User ${userId} admin status: ${isAdmin}`);
    return isAdmin;
  } catch (error) {
    console.error("[enhancedAdminService] Unexpected error during admin verification:", error);
    await enhancedAuditLogger.logSecurityEvent({
      action: 'admin_verification_exception',
      resource_type: 'authentication',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        user_id: userId
      },
      severity: 'critical'
    });
    return false;
  }
}

/**
 * Rate limiting for admin operations
 */
const adminOperationAttempts = new Map<string, { count: number; resetTime: number }>();

export function checkAdminRateLimit(userId: string, operation: string): boolean {
  const key = `${userId}:${operation}`;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxAttempts = 10; // Max 10 operations per minute
  
  const attempts = adminOperationAttempts.get(key);
  
  if (!attempts || now > attempts.resetTime) {
    adminOperationAttempts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (attempts.count >= maxAttempts) {
    enhancedAuditLogger.logSuspiciousActivity('admin_rate_limit_exceeded', {
      user_id: userId,
      operation,
      attempts: attempts.count
    });
    return false;
  }
  
  attempts.count++;
  return true;
}
