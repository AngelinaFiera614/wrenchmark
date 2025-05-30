
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface MotorcycleWithBrand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  brands: {
    name: string;
  };
}

const AdminDashboard = () => {
  const { stats, isLoading: statsLoading } = useAdminStats();

  // Fetch recent brand and motorcycle activity
  const { data: recentBrands, isLoading: brandsLoading } = useQuery({
    queryKey: ["recent-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    },
  });

  const { data: recentMotorcycles, isLoading: motorcyclesLoading } = useQuery({
    queryKey: ["recent-motorcycles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          id, name, created_at, updated_at, is_draft,
          brands(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data as MotorcycleWithBrand[];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <AdminStatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Brand Activity</CardTitle>
            <CardDescription>
              Recently updated brands in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recentBrands && recentBrands.length > 0 ? (
              <div className="space-y-3">
                {recentBrands.map((brand) => (
                  <div key={brand.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Updated: {format(new Date(brand.updated_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent brand activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Motorcycle Activity</CardTitle>
            <CardDescription>
              Recently updated motorcycle models
            </CardDescription>
          </CardHeader>
          <CardContent>
            {motorcyclesLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recentMotorcycles && recentMotorcycles.length > 0 ? (
              <div className="space-y-3">
                {recentMotorcycles.map((motorcycle) => (
                  <div key={motorcycle.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{motorcycle.brands?.name} {motorcycle.name}</p>
                        {motorcycle.is_draft && (
                          <Badge variant="outline" className="text-xs">Draft</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Updated: {format(new Date(motorcycle.updated_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent motorcycle activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>
              Recent administrative actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex justify-between items-start py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    {activity.resource_type && (
                      <p className="text-sm text-muted-foreground">
                        Resource: {activity.resource_type}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), "MMM d, HH:mm")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
