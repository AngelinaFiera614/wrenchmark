
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus, Edit } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface MotorcycleWithBrand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  brand_name: string | null;
  slug: string;
}

const AdminDashboard = () => {
  const { stats, isLoading: statsLoading } = useAdminStats();

  // Fetch recent brand activity
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

  // Fetch recent motorcycle activity with proper brand join
  const { data: recentMotorcycles, isLoading: motorcyclesLoading, error: motorcyclesError } = useQuery({
    queryKey: ["recent-motorcycles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          id, 
          name, 
          created_at, 
          updated_at, 
          is_draft,
          slug,
          brands!motorcycle_models_brand_id_fkey(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      // Transform the data to flatten the brand structure
      const transformedData: MotorcycleWithBrand[] = data.map(item => ({
        id: item.id,
        name: item.name,
        created_at: item.created_at,
        updated_at: item.updated_at,
        is_draft: item.is_draft,
        slug: item.slug,
        brand_name: item.brands?.name || null
      }));
      
      return transformedData;
    },
  });

  const getActivityType = (motorcycle: MotorcycleWithBrand) => {
    const created = new Date(motorcycle.created_at);
    const updated = new Date(motorcycle.updated_at);
    const timeDiff = updated.getTime() - created.getTime();
    
    // If updated within 1 minute of creation, consider it "created"
    if (timeDiff < 60000) {
      return 'created';
    }
    return 'updated';
  };

  const getActivityIcon = (activityType: string) => {
    return activityType === 'created' ? <Plus className="h-3 w-3" /> : <Edit className="h-3 w-3" />;
  };

  const getActivityColor = (activityType: string) => {
    return activityType === 'created' ? 'text-green-400' : 'text-blue-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Admin Dashboard</h1>
          <p className="text-explorer-text-muted mt-1">Welcome to the Wrenchmark admin portal</p>
        </div>
      </div>
      
      <AdminStatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              Recent Brand Activity
              <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                {recentBrands?.length || 0}
              </Badge>
            </CardTitle>
            <CardDescription className="text-explorer-text-muted">
              Recently updated brands in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal mx-auto"></div>
                <p className="text-explorer-text-muted mt-2">Loading...</p>
              </div>
            ) : recentBrands && recentBrands.length > 0 ? (
              <div className="space-y-3">
                {recentBrands.map((brand) => (
                  <div key={brand.id} className="flex justify-between items-center py-2 border-b border-explorer-chrome/20 last:border-b-0">
                    <div>
                      <p className="font-medium text-explorer-text">{brand.name}</p>
                      <p className="text-sm text-explorer-text-muted">
                        {formatDistanceToNow(new Date(brand.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-explorer-text-muted text-center py-4">No recent brand activity</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-explorer-text flex items-center justify-between">
              <div className="flex items-center gap-2">
                Recent Motorcycle Activity
                <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                  {recentMotorcycles?.length || 0}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-accent-teal hover:bg-accent-teal/20"
              >
                <Link to="/admin/models">
                  View All <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription className="text-explorer-text-muted">
              Recently added or updated motorcycle models
            </CardDescription>
          </CardHeader>
          <CardContent>
            {motorcyclesLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal mx-auto"></div>
                <p className="text-explorer-text-muted mt-2">Loading...</p>
              </div>
            ) : motorcyclesError ? (
              <div className="text-center py-4">
                <p className="text-red-400 mb-2">Failed to load motorcycle activity</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-explorer-text border-explorer-chrome/30"
                >
                  Retry
                </Button>
              </div>
            ) : recentMotorcycles && recentMotorcycles.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentMotorcycles.slice(0, 8).map((motorcycle) => {
                  const activityType = getActivityType(motorcycle);
                  return (
                    <div key={motorcycle.id} className="flex justify-between items-center py-2 border-b border-explorer-chrome/20 last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`flex items-center gap-1 ${getActivityColor(activityType)}`}>
                            {getActivityIcon(activityType)}
                            <span className="text-xs font-medium capitalize">{activityType}</span>
                          </div>
                          {motorcycle.is_draft && (
                            <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-explorer-text truncate">
                          {motorcycle.brand_name ? `${motorcycle.brand_name} ${motorcycle.name}` : motorcycle.name}
                        </p>
                        <p className="text-sm text-explorer-text-muted">
                          {formatDistanceToNow(new Date(motorcycle.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="ml-2 flex-shrink-0"
                      >
                        <Link to={`/admin/models/${motorcycle.slug}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-explorer-text-muted mb-2">No recent motorcycle activity</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/20"
                >
                  <Link to="/admin/models">
                    <Plus className="mr-1 h-3 w-3" />
                    Add First Model
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
