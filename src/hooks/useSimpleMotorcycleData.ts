
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { 
  fetchMotorcyclesSimple, 
  fetchBrandsSimple, 
  fetchMotorcycleStatsSimple,
  fetchComponentStatsSimple,
  SimpleMotorcycleFilters 
} from "@/services/motorcycles/simplifiedQueries";
import { Motorcycle } from "@/types";

export function useSimpleMotorcycleData() {
  const { user, isAdmin } = useAuth();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [componentStats, setComponentStats] = useState<any>(null);
  const [filters, setFilters] = useState<SimpleMotorcycleFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a serializable query key from filters
  const filtersKey = JSON.stringify(filters);

  // Only fetch data if user is authenticated and is admin
  const isEnabled = !!user && isAdmin;

  console.log('useSimpleMotorcycleData - State:', {
    isEnabled,
    user: !!user,
    isAdmin,
    filtersKey,
    motorcyclesCount: motorcycles.length,
    brandsCount: brands.length
  });

  const fetchData = async () => {
    if (!isEnabled) {
      console.log('useSimpleMotorcycleData - Not enabled, skipping fetch');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('useSimpleMotorcycleData - Starting data fetch');
      
      // Fetch all data in parallel with optimized queries
      const [motorcyclesData, brandsData, statsData, compStatsData] = await Promise.all([
        fetchMotorcyclesSimple(filters),
        fetchBrandsSimple(),
        fetchMotorcycleStatsSimple(),
        fetchComponentStatsSimple()
      ]);

      console.log('useSimpleMotorcycleData - Data fetched successfully:', {
        motorcycles: motorcyclesData.length,
        brands: brandsData.length,
        stats: statsData,
        componentStats: compStatsData
      });

      setMotorcycles(motorcyclesData);
      setBrands(brandsData);
      setStats(statsData);
      setComponentStats(compStatsData);
    } catch (err: any) {
      console.error('useSimpleMotorcycleData - Fetch error:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when enabled or filters change
  useEffect(() => {
    fetchData();
  }, [isEnabled, filtersKey]);

  const handleFilterChange = (newFilters: Partial<SimpleMotorcycleFilters>) => {
    console.log('useSimpleMotorcycleData - Filter change:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    console.log('useSimpleMotorcycleData - Clearing filters');
    setFilters({});
  };

  const refetch = () => {
    console.log('useSimpleMotorcycleData - Manual refetch triggered');
    fetchData();
  };

  // Toggle draft mode
  const toggleDraftMode = () => {
    const currentDraftMode = filters.isDraft;
    handleFilterChange({ isDraft: !currentDraftMode });
  };

  return {
    motorcycles,
    brands,
    stats,
    componentStats,
    filters,
    isLoading,
    error,
    isEnabled,
    handleFilterChange,
    clearFilters,
    refetch,
    toggleDraftMode,
    isDraftMode: filters.isDraft || false
  };
}
