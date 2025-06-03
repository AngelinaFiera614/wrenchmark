import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useComponentDeletion } from "@/hooks/useComponentDeletion";
import AdminBrakeSystemDialog from "@/components/admin/components/AdminBrakeSystemDialog";
import ComponentUsageDialog from "@/components/admin/components/ComponentUsageDialog";

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Brake Systems</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage brake system components for motorcycle configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateBrakeSystem}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Brake System
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Total Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{brakeSystems?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">With ABS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {brakeSystems?.filter(b => b.type.toLowerCase().includes('abs')).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">With Traction Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {brakeSystems?.filter(b => b.has_traction_control).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">
              {new Set(brakeSystems?.map(b => b.brake_brand).filter(Boolean)).size || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
            <Input
              placeholder="Search brake systems by type or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brake Systems Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Brake Systems ({filteredBrakeSystems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBrakeSystems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Front</TableHead>
                  <TableHead className="text-explorer-text">Rear</TableHead>
                  <TableHead className="text-explorer-text">Brand</TableHead>
                  <TableHead className="text-explorer-text">Features</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrakeSystems.map((brakeSystem) => (
                  <TableRow key={brakeSystem.id} className="border-explorer-chrome/20">
                    <TableCell>
                      <div className="font-medium text-explorer-text">{brakeSystem.type}</div>
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      <div>{brakeSystem.brake_type_front || '-'}</div>
                      {brakeSystem.front_disc_size_mm && (
                        <div className="text-xs text-explorer-text-muted">{brakeSystem.front_disc_size_mm}mm disc</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      <div>{brakeSystem.brake_type_rear || '-'}</div>
                      {brakeSystem.rear_disc_size_mm && (
                        <div className="text-xs text-explorer-text-muted">{brakeSystem.rear_disc_size_mm}mm disc</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">{brakeSystem.brake_brand || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {brakeSystem.has_traction_control && (
                          <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30 text-xs">
                            TC
                          </Badge>
                        )}
                        {brakeSystem.caliper_type && (
                          <Badge variant="outline" className="bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30 text-xs">
                            {brakeSystem.caliper_type}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBrakeSystem(brakeSystem)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBrakeSystem(brakeSystem)}
                          disabled={isChecking}
                          className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          {isChecking ? "Checking..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-explorer-text-muted">
                {searchTerm 
                  ? "No brake systems match your search." 
                  : "No brake systems found. Start by adding your first brake system."
                }
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateBrakeSystem}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Brake System
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
