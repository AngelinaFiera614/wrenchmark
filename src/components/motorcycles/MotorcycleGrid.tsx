
import React from "react";
import { Motorcycle } from "@/types";
import MotorcycleCard from "./MotorcycleCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { Search } from "lucide-react";

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
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="No Motorcycles Found"
        description="Try adjusting your filters or search terms to find more motorcycles."
      />
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
