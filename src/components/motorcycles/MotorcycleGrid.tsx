
import React from "react";
import { Motorcycle } from "@/types";
import MotorcycleCard from "./MotorcycleCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { Search, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MotorcycleGridProps {
  motorcycles: Motorcycle[];
  isLoading?: boolean;
}

export default function MotorcycleGrid({ motorcycles, isLoading }: MotorcycleGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading motorcycles..." />
      </div>
    );
  }

  if (motorcycles.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Motorcycles Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn't find any motorcycles matching your criteria. This might be because:
        </p>
        <div className="text-sm text-muted-foreground mb-6 space-y-2">
          <p>• All motorcycles are currently in draft status</p>
          <p>• Your search filters are too restrictive</p>
          <p>• The database connection is experiencing issues</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Search className="h-4 w-4 mr-2" />
            Try Refreshing
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {motorcycles.map((motorcycle) => (
        <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
      ))}
    </div>
  );
}
