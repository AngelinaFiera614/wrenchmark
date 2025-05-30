
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
import AdminWheelDialog from "@/components/admin/components/AdminWheelDialog";

const AdminWheels = () => {
  const { toast } = useToast();
  const [isCreateWheelOpen, setIsCreateWheelOpen] = useState(false);
  const [editWheel, setEditWheel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch wheels
  const { data: wheels, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-wheels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wheels')
        .select('*')
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const handleCreateWheel = () => {
    setEditWheel(null);
    setIsCreateWheelOpen(true);
  };

  const handleEditWheel = (wheel) => {
    setEditWheel(wheel);
    setIsCreateWheelOpen(true);
  };

  const handleDeleteWheel = async (wheel) => {
    if (!confirm(`Are you sure you want to delete this wheel set? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('wheels')
        .delete()
        .eq('id', wheel.id);

      if (error) throw error;

      toast({
        title: "Wheel set deleted",
        description: `Wheel set has been removed.`,
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete wheel set. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateWheelOpen(false);
    setEditWheel(null);
    if (refreshData) {
      refetch();
    }
  };

  // Filter wheels based on search
  const filteredWheels = wheels?.filter(wheel => {
    const matchesSearch = !searchTerm || 
      wheel.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wheel.front_size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wheel.rear_size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wheel.rim_material?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  // Group wheels by material for stats
  const materialCounts = wheels?.reduce((acc, wheel) => {
    const material = wheel.rim_material || 'Unspecified';
    acc[material] = (acc[material] || 0) + 1;
    return acc;
  }, {}) || {};

  // Count unique front and rear sizes
  const frontSizes = new Set(wheels?.map(w => w.front_size).filter(Boolean)).size || 0;
  const rearSizes = new Set(wheels?.map(w => w.rear_size).filter(Boolean)).size || 0;

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
          <h1 className="text-3xl font-bold text-explorer-text">Wheels</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage wheel and tire components for motorcycle configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateWheel}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Wheel Set
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Total Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{wheels?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Unique Front Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {frontSizes}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Unique Rear Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {rearSizes}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Aluminum Rims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">
              {materialCounts['Aluminum'] || 0}
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
              placeholder="Search wheels by type, size or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wheels Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Wheel Sets ({filteredWheels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWheels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Front Size</TableHead>
                  <TableHead className="text-explorer-text">Rear Size</TableHead>
                  <TableHead className="text-explorer-text">Material</TableHead>
                  <TableHead className="text-explorer-text">Spoke Count</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWheels.map((wheel) => (
                  <TableRow key={wheel.id} className="border-explorer-chrome/20">
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30"
                      >
                        {wheel.type || 'Standard'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-explorer-text">{wheel.front_size || '-'}</div>
                      {wheel.front_tire_size && (
                        <div className="text-xs text-explorer-text-muted">Tire: {wheel.front_tire_size}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-explorer-text">{wheel.rear_size || '-'}</div>
                      {wheel.rear_tire_size && (
                        <div className="text-xs text-explorer-text-muted">Tire: {wheel.rear_tire_size}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {wheel.rim_material || '-'}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {wheel.spoke_count_front && (
                        <div>Front: {wheel.spoke_count_front}</div>
                      )}
                      {wheel.spoke_count_rear && (
                        <div>Rear: {wheel.spoke_count_rear}</div>
                      )}
                      {!wheel.spoke_count_front && !wheel.spoke_count_rear && '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditWheel(wheel)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWheel(wheel)}
                          className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
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
                  ? "No wheels match your search." 
                  : "No wheels found. Start by adding your first wheel set."
                }
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateWheel}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Wheel Set
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdminWheelDialog 
        open={isCreateWheelOpen}
        wheel={editWheel}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminWheels;
