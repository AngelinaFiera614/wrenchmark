
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { 
  fetchMotorcyclesSimple, 
  fetchBrandsSimple, 
  fetchMotorcycleStatsSimple,
  SimpleMotorcycleFilters 
} from "@/services/motorcycles/simplifiedQueries";
import { Motorcycle } from "@/types";

export function useSimpleMotorcycleData() {
  const { user, isAdmin } = useAuth();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
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
      
      // Fetch all data in parallel
      const [motorcyclesData, brandsData, statsData] = await Promise.all([
        fetchMotorcyclesSimple(filters),
        fetchBrandsSimple(),
        fetchMotorcycleStatsSimple()
      ]);

      console.log('useSimpleMotorcycleData - Data fetched successfully:', {
        motorcycles: motorcyclesData.length,
        brands: brandsData.length,
        stats: statsData
      });

      setMotorcycles(motorcyclesData);
      setBrands(brandsData);
      setStats(statsData);
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

  return {
    motorcycles,
    brands,
    stats,
    filters,
    isLoading,
    error,
    isEnabled,
    handleFilterChange,
    clearFilters,
    refetch
  };
}
