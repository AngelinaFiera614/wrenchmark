
import { useState } from "react";
import { useServiceQuery, useServiceMutation } from "./useServiceQuery";
import { MotorcycleService, MotorcycleFilters } from "@/services/domain/MotorcycleService";
import { BrandService } from "@/services/domain/BrandService";
import { Motorcycle } from "@/types";
import { useAuth } from "@/context/auth";

export function useMotorcycleManagement() {
  const { user, isAdmin } = useAuth();
  const [filters, setFilters] = useState<MotorcycleFilters>({});
  const [selectedMotorcycles, setSelectedMotorcycles] = useState<string[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);

  // Create a serializable query key from filters
  const filtersKey = JSON.stringify(filters);

  // Only fetch data if user is authenticated and is admin
  const isEnabled = !!user && isAdmin;

  console.log('useMotorcycleManagement - isEnabled:', isEnabled, 'user:', !!user, 'isAdmin:', isAdmin);

  // Queries
  const motorcyclesQuery = useServiceQuery({
    queryKey: ['motorcycles', filtersKey],
    queryFn: async () => {
      console.log('Executing motorcycles query...');
      const result = await MotorcycleService.getAll(filters);
      console.log('Motorcycles query result:', result);
      return result;
    },
    enabled: isEnabled,
    onError: (error) => {
      console.error("Failed to fetch motorcycles:", error);
    }
  });

  const brandsQuery = useServiceQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      console.log('Executing brands query...');
      const result = await BrandService.getAll();
      console.log('Brands query result:', result);
      return result;
    },
    enabled: isEnabled,
    onError: (error) => {
      console.error("Failed to fetch brands:", error);
    }
  });

  const statsQuery = useServiceQuery({
    queryKey: ['motorcycle-stats'],
    queryFn: async () => {
      console.log('Executing stats query...');
      const result = await MotorcycleService.getCompletionStats();
      console.log('Stats query result:', result);
      return result;
    },
    enabled: isEnabled,
    onError: (error) => {
      console.error("Failed to fetch stats:", error);
    }
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
    console.log('Filter change:', newFilters);
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

  // Log current state for debugging
  console.log('useMotorcycleManagement state:', {
    motorcyclesLoading: motorcyclesQuery.isLoading,
    motorcyclesError: motorcyclesQuery.error,
    motorcyclesCount: motorcyclesQuery.data?.length || 0,
    brandsLoading: brandsQuery.isLoading,
    brandsError: brandsQuery.error,
    brandsCount: brandsQuery.data?.length || 0,
    isEnabled
  });

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

    // Error states
    motorcyclesError: motorcyclesQuery.error,
    brandsError: brandsQuery.error,
    statsError: statsQuery.error,

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
