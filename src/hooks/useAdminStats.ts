
import { useState, useEffect } from "react";
import { getAdminStats, AdminStats } from "@/services/adminService";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export function useAdminStats() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err as Error);
      toast.error("Failed to load admin statistics");
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats
  };
}
