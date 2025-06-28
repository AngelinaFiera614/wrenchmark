
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ActivityLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const useSecurityAudit = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    action: '',
    dateRange: '7d',
    userId: ''
  });

  // Fetch admin audit logs (admin only)
  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['admin-audit-logs', filters],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      let query = supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters.action) {
        query = query.ilike('action', `%${filters.action}%`);
      }

      if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!user && isAdmin,
  });

  // Fetch user activity logs
  const { data: activityLogs, isLoading: activityLoading } = useQuery({
    queryKey: ['user-activity-logs', user?.id, filters],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Admins can see all activity, users see only their own
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      if (filters.action) {
        query = query.ilike('action', `%${filters.action}%`);
      }

      if (filters.userId && isAdmin) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ActivityLogEntry[];
    },
    enabled: !!user,
  });

  // Log user activity
  const logActivity = useMutation({
    mutationFn: async ({
      action,
      resourceType,
      resourceId,
      details
    }: {
      action: string;
      resourceType?: string;
      resourceId?: string;
      details?: any;
    }) => {
      const { error } = await supabase.rpc('log_user_activity', {
        p_action: action,
        p_resource_type: resourceType || null,
        p_resource_id: resourceId || null,
        p_details: details || null
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
    },
    onError: (error: any) => {
      console.error('Failed to log activity:', error);
    }
  });

  // Get security stats
  const { data: securityStats } = useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      if (!isAdmin) return null;

      const [auditCount, activityCount, verificationCount] = await Promise.all([
        supabase.from('admin_audit_log').select('id', { count: 'exact', head: true }),
        supabase.from('user_activity_log').select('id', { count: 'exact', head: true }),
        supabase.from('email_verification_log').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalAuditLogs: auditCount.count || 0,
        totalActivityLogs: activityCount.count || 0,
        totalVerificationLogs: verificationCount.count || 0
      };
    },
    enabled: !!user && isAdmin,
  });

  return {
    // Data
    auditLogs,
    activityLogs,
    securityStats,
    filters,

    // Loading states
    isLoading: auditLoading || activityLoading,

    // Actions
    setFilters,
    logActivity: logActivity.mutate,
    isLoggingActivity: logActivity.isPending,

    // Permissions
    canViewAuditLogs: isAdmin,
    canViewAllActivity: isAdmin
  };
};
