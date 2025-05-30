
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminModels() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Model Management</h1>
        <p className="text-muted-foreground">
          Manage motorcycle models, model years, and configurations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Model management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
