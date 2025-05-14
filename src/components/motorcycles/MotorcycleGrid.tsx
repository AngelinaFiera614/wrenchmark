
import { Motorcycle } from "@/types";
import MotorcycleCard from "./MotorcycleCard";

interface MotorcycleGridProps {
  motorcycles: Motorcycle[];
}

export default function MotorcycleGrid({ motorcycles }: MotorcycleGridProps) {
  if (motorcycles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium text-muted-foreground">
          No motorcycles match your filter criteria
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search term
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {motorcycles.map((motorcycle) => (
        <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
      ))}
    </div>
  );
}
