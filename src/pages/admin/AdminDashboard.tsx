
import React from "react";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useRecentBrands, useRecentMotorcycles } from "@/hooks/useRecentActivity";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminDashboardHeader from "@/components/admin/dashboard/AdminDashboardHeader";
import RecentBrandsCard from "@/components/admin/dashboard/RecentBrandsCard";
import RecentMotorcyclesCard from "@/components/admin/dashboard/RecentMotorcyclesCard";

const AdminDashboard = () => {
  const { stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentBrands, isLoading: brandsLoading } = useRecentBrands();
  const { 
    data: recentMotorcycles, 
    isLoading: motorcyclesLoading, 
    error: motorcyclesError,
    refetch: refetchMotorcycles 
  } = useRecentMotorcycles();

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminDashboardHeader />
      
      <AdminStatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBrandsCard 
          brands={recentBrands} 
          isLoading={brandsLoading} 
        />
        
        <RecentMotorcyclesCard 
          motorcycles={recentMotorcycles} 
          isLoading={motorcyclesLoading} 
          error={motorcyclesError} 
          refetch={refetchMotorcycles}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
