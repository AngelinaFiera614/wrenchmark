
import { useState } from "react";
import { useServiceQuery, useServiceMutation } from "./useServiceQuery";
import { MotorcycleService, MotorcycleFilters } from "@/services/domain/MotorcycleService";
import { BrandService } from "@/services/domain/BrandService";
import { Motorcycle } from "@/types";

export function useMotorcycleManagement() {
  const [filters, setFilters] = useState<MotorcycleFilters>({});
  const [selectedMotorcycles, setSelectedMotorcycles] = useState<string[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);

  // Create a serializable query key from filters
  const filtersKey = JSON.stringify(filters);

  // Queries
  const motorcyclesQuery = useServiceQuery({
    queryKey: ['motorcycles', filtersKey],
    queryFn: () => MotorcycleService.getAll(filters)
  });

  const brandsQuery = useServiceQuery({
    queryKey: ['brands'],
    queryFn: () => BrandService.getAll()
  });

  const statsQuery = useServiceQuery({
    queryKey: ['motorcycle-stats'],
    queryFn: () => MotorcycleService.getCompletionStats()
  });

  // Mutations
  const publishMutation = useServiceMutation({
    mutationFn: (id: string) => MotorcycleService.publish(id),
    invalidateQueries: [['motorcycles'], ['motorcycle-stats']]
  });

  const unpublishMutation = useServiceMutation({
    mutationFn: (id: string) => MotorcycleService.unpublish(id),
    invalidateQueries: [['motorcycles'], ['motorcycle-stats']]
  });

  const deleteMutation = useServiceMutation({
    mutationFn: (id: string) => MotorcycleService.delete(id),
    invalidateQueries: [['motorcycles'], ['motorcycle-stats']]
  });

  const bulkUpdateMutation = useServiceMutation({
    mutationFn: ({ ids, updates }: { ids: string[], updates: Partial<Motorcycle> }) =>
      MotorcycleService.bulkUpdate(ids, updates),
    invalidateQueries: [['motorcycles'], ['motorcycle-stats']]
  });

  // Actions
  const handleFilterChange = (newFilters: Partial<MotorcycleFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleMotorcycleSelect = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedMotorcycles(prev =>
      prev.includes(id)
        ? prev.filter(motorcycleId => motorcycleId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = motorcyclesQuery.data?.map(m => m.id) || [];
    setSelectedMotorcycles(allIds);
  };

  const handleClearSelection = () => {
    setSelectedMotorcycles([]);
  };

  const handleBulkPublish = () => {
    if (selectedMotorcycles.length > 0) {
      bulkUpdateMutation.mutate({
        ids: selectedMotorcycles,
        updates: { is_draft: false }
      });
    }
  };

  const handleBulkUnpublish = () => {
    if (selectedMotorcycles.length > 0) {
      bulkUpdateMutation.mutate({
        ids: selectedMotorcycles,
        updates: { is_draft: true }
      });
    }
  };

  return {
    // Data
    motorcycles: motorcyclesQuery.data || [],
    brands: brandsQuery.data || [],
    stats: statsQuery.data,
    selectedMotorcycles,
    selectedMotorcycle,
    filters,

    // Loading states
    isLoading: motorcyclesQuery.isLoading || brandsQuery.isLoading,
    isUpdating: publishMutation.isPending || unpublishMutation.isPending || 
               deleteMutation.isPending || bulkUpdateMutation.isPending,

    // Actions
    handleFilterChange,
    handleMotorcycleSelect,
    handleToggleSelection,
    handleSelectAll,
    handleClearSelection,
    handleBulkPublish,
    handleBulkUnpublish,
    publishMotorcycle: publishMutation.mutate,
    unpublishMotorcycle: unpublishMutation.mutate,
    deleteMotorcycle: deleteMutation.mutate,

    // Refresh
    refetch: () => {
      motorcyclesQuery.refetch();
      statsQuery.refetch();
    }
  };
}
