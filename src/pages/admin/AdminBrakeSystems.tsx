
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useComponentDeletion } from "@/hooks/useComponentDeletion";
import AdminBrakeSystemDialog from "@/components/admin/components/AdminBrakeSystemDialog";
import ComponentUsageDialog from "@/components/admin/components/ComponentUsageDialog";
import AdminBrakeSystemsHeader from "@/components/admin/brake-systems/AdminBrakeSystemsHeader";
import AdminBrakeSystemsStats from "@/components/admin/brake-systems/AdminBrakeSystemsStats";
import AdminBrakeSystemsSearch from "@/components/admin/brake-systems/AdminBrakeSystemsSearch";
import AdminBrakeSystemsTable from "@/components/admin/brake-systems/AdminBrakeSystemsTable";

const AdminBrakeSystems = () => {
  const { toast } = useToast();
  const { checkComponentUsage, isChecking } = useComponentDeletion();
  const [isCreateBrakeSystemOpen, setIsCreateBrakeSystemOpen] = useState(false);
  const [editBrakeSystem, setEditBrakeSystem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);
  const [selectedBrakeSystem, setSelectedBrakeSystem] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch brake systems
  const { data: brakeSystems, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-brake-systems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brake_systems')
        .select('*')
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const handleCreateBrakeSystem = () => {
    setEditBrakeSystem(null);
    setIsCreateBrakeSystemOpen(true);
  };

  const handleEditBrakeSystem = (brakeSystem) => {
    setEditBrakeSystem(brakeSystem);
    setIsCreateBrakeSystemOpen(true);
  };

  const handleDeleteBrakeSystem = async (brakeSystem) => {
    setSelectedBrakeSystem(brakeSystem);
    
    // Check if component can be deleted
    const usage = await checkComponentUsage("brake_system", brakeSystem.id);
    if (usage) {
      setUsageInfo(usage);
      setUsageDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBrakeSystem || !usageInfo?.canDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('brake_systems')
        .delete()
        .eq('id', selectedBrakeSystem.id);

      if (error) {
        console.error("Database error:", error);
        throw new Error(error.message || "Failed to delete brake system");
      }

      toast({
        title: "Brake system deleted",
        description: `${selectedBrakeSystem.type} has been removed.`,
      });

      refetch();
      setUsageDialogOpen(false);
      setSelectedBrakeSystem(null);
      setUsageInfo(null);
    } catch (error) {
      console.error("Error deleting brake system:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete brake system. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateBrakeSystemOpen(false);
    setEditBrakeSystem(null);
    if (refreshData) {
      refetch();
    }
  };

  const closeUsageDialog = () => {
    setUsageDialogOpen(false);
    setSelectedBrakeSystem(null);
    setUsageInfo(null);
  };

  // Filter brake systems based on search
  const filteredBrakeSystems = brakeSystems?.filter(brakeSystem => {
    const matchesSearch = !searchTerm || 
      brakeSystem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brakeSystem.brake_brand?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBrakeSystemsHeader onCreateBrakeSystem={handleCreateBrakeSystem} />
      
      <AdminBrakeSystemsStats brakeSystems={brakeSystems} />

      <AdminBrakeSystemsSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <AdminBrakeSystemsTable
        filteredBrakeSystems={filteredBrakeSystems}
        onEditBrakeSystem={handleEditBrakeSystem}
        onDeleteBrakeSystem={handleDeleteBrakeSystem}
        onCreateBrakeSystem={handleCreateBrakeSystem}
        isChecking={isChecking}
      />

      {/* Dialogs */}
      <AdminBrakeSystemDialog 
        open={isCreateBrakeSystemOpen}
        brakeSystem={editBrakeSystem}
        onClose={handleDialogClose}
      />

      {selectedBrakeSystem && usageInfo && (
        <ComponentUsageDialog
          open={usageDialogOpen}
          onClose={closeUsageDialog}
          componentName={selectedBrakeSystem.type}
          componentType="brake system"
          usageInfo={usageInfo}
          onConfirmDelete={usageInfo.canDelete ? confirmDelete : undefined}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminBrakeSystems;
