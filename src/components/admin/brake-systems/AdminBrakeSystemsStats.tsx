
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminBrakeSystemsStatsProps {
  brakeSystems: any[] | undefined;
}

const AdminBrakeSystemsStats = ({ brakeSystems }: AdminBrakeSystemsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-explorer-text">Total Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-explorer-text">{brakeSystems?.length || 0}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-explorer-text">With ABS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {brakeSystems?.filter(b => b.type.toLowerCase().includes('abs')).length || 0}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-explorer-text">With Traction Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent-teal">
            {brakeSystems?.filter(b => b.has_traction_control).length || 0}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-explorer-text">Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-explorer-text">
            {new Set(brakeSystems?.map(b => b.brake_brand).filter(Boolean)).size || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBrakeSystemsStats;
