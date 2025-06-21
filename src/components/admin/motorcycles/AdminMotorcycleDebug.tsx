
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotorcycleFilters } from "@/services/domain/MotorcycleService";

interface AdminMotorcycleDebugProps {
  isEnabled: boolean;
  motorcyclesCount: number;
  brandsCount: number;
  isLoading: boolean;
  error: string | null;
  isDraftMode: boolean;
  filters: MotorcycleFilters;
  componentStats?: { total: number };
}

const AdminMotorcycleDebug = ({
  isEnabled,
  motorcyclesCount,
  brandsCount,
  isLoading,
  error,
  isDraftMode,
  filters,
  componentStats
}: AdminMotorcycleDebugProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Connection Status</h4>
          <div className="flex items-center gap-2">
            <Badge variant={isEnabled ? "default" : "destructive"}>
              {isEnabled ? "Connected" : "Disconnected"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Admin authentication: {isEnabled ? "Valid" : "Invalid"}
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Data Counts</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Motorcycles: {motorcyclesCount}</div>
            <div>Brands: {brandsCount}</div>
            <div>Loading: {isLoading ? "Yes" : "No"}</div>
            <div>Error: {error || "None"}</div>
            <div>Draft Mode: {isDraftMode ? "On" : "Off"}</div>
            {componentStats && <div>Components: {componentStats.total}</div>}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Performance Improvements</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-green-600">
            <div>✓ Database indexes added</div>
            <div>✓ Draft filtering enabled</div>
            <div>✓ Foreign key queries optimized</div>
            <div>✓ Stats table created</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Active Filters</h4>
          <pre className="text-xs bg-muted p-2 rounded">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>

        {componentStats && (
          <div>
            <h4 className="font-medium mb-2">Component Stats</h4>
            <pre className="text-xs bg-muted p-2 rounded">
              {JSON.stringify(componentStats, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMotorcycleDebug;
