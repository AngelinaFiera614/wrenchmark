
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cpu, Database } from "lucide-react";

interface AdminMotorcycleStatsProps {
  stats?: {
    total: number;
    complete: number;
    drafts: number;
  };
  componentStats?: {
    total: number;
  };
  brandsCount: number;
}

const AdminMotorcycleStats = ({ stats, componentStats, brandsCount }: AdminMotorcycleStatsProps) => {
  if (!stats && !componentStats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {stats && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <CheckCircle className="h-3 w-3" />
                Database Optimized
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
              <div className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}% of total
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.drafts}</div>
              <div className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.drafts / stats.total) * 100) : 0}% of total
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Brands Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{brandsCount}</div>
          <div className="text-xs text-muted-foreground">
            Active brands
          </div>
        </CardContent>
      </Card>

      {componentStats && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Cpu className="h-4 w-4" />
                Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{componentStats.total}</div>
              <div className="text-xs text-muted-foreground">
                Published components
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Database className="h-4 w-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-teal">Fast</div>
              <div className="text-xs text-muted-foreground">
                Indexed & optimized
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminMotorcycleStats;
