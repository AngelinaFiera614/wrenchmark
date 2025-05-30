
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
import AdminSuspensionDialog from "@/components/admin/components/AdminSuspensionDialog";

const AdminSuspensions = () => {
  const { toast } = useToast();
  const [isCreateSuspensionOpen, setIsCreateSuspensionOpen] = useState(false);
  const [editSuspension, setEditSuspension] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch suspensions
  const { data: suspensions, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-suspensions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suspensions')
        .select('*')
        .order('front_type');
      if (error) throw error;
      return data;
    }
  });

  const handleCreateSuspension = () => {
    setEditSuspension(null);
    setIsCreateSuspensionOpen(true);
  };

  const handleEditSuspension = (suspension) => {
    setEditSuspension(suspension);
    setIsCreateSuspensionOpen(true);
  };

  const handleDeleteSuspension = async (suspension) => {
    if (!confirm(`Are you sure you want to delete this suspension? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('suspensions')
        .delete()
        .eq('id', suspension.id);

      if (error) throw error;

      toast({
        title: "Suspension deleted",
        description: `Suspension has been removed.`,
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete suspension. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateSuspensionOpen(false);
    setEditSuspension(null);
    if (refreshData) {
      refetch();
    }
  };

  // Filter suspensions based on search
  const filteredSuspensions = suspensions?.filter(suspension => {
    const matchesSearch = !searchTerm || 
      suspension.front_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suspension.rear_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suspension.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suspension.front_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suspension.rear_brand?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  // Group suspensions by adjustability for stats
  const adjustabilityCounts = suspensions?.reduce((acc, suspension) => {
    const adjustability = suspension.adjustability || 'Standard';
    acc[adjustability] = (acc[adjustability] || 0) + 1;
    return acc;
  }, {}) || {};

  // Count unique front and rear types
  const frontTypes = new Set(suspensions?.map(s => s.front_type).filter(Boolean)).size || 0;
  const rearTypes = new Set(suspensions?.map(s => s.rear_type).filter(Boolean)).size || 0;

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
          <h1 className="text-3xl font-bold text-explorer-text">Suspensions</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage suspension components for motorcycle configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateSuspension}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Suspension
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Total Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{suspensions?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Front Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {frontTypes}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Rear Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {rearTypes}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Fully Adjustable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">
              {adjustabilityCounts['Fully Adjustable'] || 0}
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
              placeholder="Search suspensions by type, brand or adjustability..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suspensions Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Suspensions ({filteredSuspensions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSuspensions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Front</TableHead>
                  <TableHead className="text-explorer-text">Rear</TableHead>
                  <TableHead className="text-explorer-text">Travel</TableHead>
                  <TableHead className="text-explorer-text">Brands</TableHead>
                  <TableHead className="text-explorer-text">Adjustability</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuspensions.map((suspension) => (
                  <TableRow key={suspension.id} className="border-explorer-chrome/20">
                    <TableCell>
                      <div className="font-medium text-explorer-text">{suspension.front_type || '-'}</div>
                      {suspension.front_brand && (
                        <div className="text-xs text-explorer-text-muted">{suspension.front_brand}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-explorer-text">{suspension.rear_type || '-'}</div>
                      {suspension.rear_brand && (
                        <div className="text-xs text-explorer-text-muted">{suspension.rear_brand}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {suspension.front_travel_mm && (
                        <div>Front: {suspension.front_travel_mm}mm</div>
                      )}
                      {suspension.rear_travel_mm && (
                        <div>Rear: {suspension.rear_travel_mm}mm</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {suspension.brand || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${suspension.adjustability === 'Fully Adjustable' ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30' : 
                           suspension.adjustability ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                           'bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30'}
                        `}
                      >
                        {suspension.adjustability || 'Standard'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSuspension(suspension)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSuspension(suspension)}
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
                  ? "No suspensions match your search." 
                  : "No suspensions found. Start by adding your first suspension system."
                }
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateSuspension}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Suspension
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdminSuspensionDialog 
        open={isCreateSuspensionOpen}
        suspension={editSuspension}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminSuspensions;
