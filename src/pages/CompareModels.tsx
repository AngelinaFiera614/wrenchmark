
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedComparisonMatrix from "@/components/motorcycles/EnhancedComparisonMatrix";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";

export default function CompareModels() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Compare Models</h1>
          <p className="text-muted-foreground">
            Advanced motorcycle comparison with calculated performance metrics
          </p>
        </div>

        <EnhancedComparisonMatrix />
      </div>
      
      <ComparisonIndicator />
    </div>
  );
}
