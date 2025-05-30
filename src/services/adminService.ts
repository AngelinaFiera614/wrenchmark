import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminStats {
  totalUsers: number;
  totalBrands: number;
  totalMotorcycles: number;
  totalManuals: number;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: any;
  created_at: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get counts from various tables
    const [usersResult, brandsResult, motorcyclesResult, manualsResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('brands').select('id', { count: 'exact', head: true }),
      supabase.from('motorcycle_models').select('id', { count: 'exact', head: true }),
      supabase.from('manuals').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalUsers: usersResult.count || 0,
      totalBrands: brandsResult.count || 0,
      totalMotorcycles: motorcyclesResult.count || 0,
      totalManuals: manualsResult.count || 0
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}

export async function grantAdminRole(targetUserId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('grant_admin_role', {
      target_user_id: targetUserId
    });

    if (error) throw error;

    toast.success("Admin role granted successfully");
    return data;
  } catch (error: any) {
    console.error("Error granting admin role:", error);
    toast.error(error.message || "Failed to grant admin role");
    return false;
  }
}

export async function revokeAdminRole(targetUserId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('revoke_admin_role', {
      target_user_id: targetUserId
    });

    if (error) throw error;

    toast.success("Admin role revoked successfully");
    return data;
  } catch (error: any) {
    console.error("Error revoking admin role:", error);
    toast.error(error.message || "Failed to revoke admin role");
    return false;
  }
}

export async function logUserActivity(
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: any
): Promise<void> {
  try {
    await supabase.rpc('log_user_activity', {
      p_action: action,
      p_resource_type: resourceType || null,
      p_resource_id: resourceId || null,
      p_details: details || null
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
    // Don't throw - logging failures shouldn't break the main flow
  }
}
