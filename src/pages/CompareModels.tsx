
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompareModels() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Compare Models</h1>
          <p className="text-muted-foreground">
            Compare motorcycle specifications side by side
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Model Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Model comparison functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
