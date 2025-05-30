
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
import AdminFrameDialog from "@/components/admin/components/AdminFrameDialog";

const AdminFrames = () => {
  const { toast } = useToast();
  const [isCreateFrameOpen, setIsCreateFrameOpen] = useState(false);
  const [editFrame, setEditFrame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch frames
  const { data: frames, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-frames"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('frames')
        .select('*')
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const handleCreateFrame = () => {
    setEditFrame(null);
    setIsCreateFrameOpen(true);
  };

  const handleEditFrame = (frame) => {
    setEditFrame(frame);
    setIsCreateFrameOpen(true);
  };

  const handleDeleteFrame = async (frame) => {
    if (!confirm(`Are you sure you want to delete the ${frame.type} frame? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('frames')
        .delete()
        .eq('id', frame.id);

      if (error) throw error;

      toast({
        title: "Frame deleted",
        description: `${frame.type} frame has been removed.`,
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete frame. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateFrameOpen(false);
    setEditFrame(null);
    if (refreshData) {
      refetch();
    }
  };

  // Filter frames based on search
  const filteredFrames = frames?.filter(frame => {
    const matchesSearch = !searchTerm || 
      frame.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frame.material?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  // Group frames by material for stats
  const materialCounts = frames?.reduce((acc, frame) => {
    const material = frame.material || 'Unspecified';
    acc[material] = (acc[material] || 0) + 1;
    return acc;
  }, {}) || {};

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
          <h1 className="text-3xl font-bold text-explorer-text">Frames</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage frame components for motorcycle configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateFrame}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Frame
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Total Frames</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{frames?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Aluminum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {materialCounts['Aluminum'] || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Steel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">
              {materialCounts['Steel'] || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Carbon Fiber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {materialCounts['Carbon Fiber'] || 0}
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
              placeholder="Search frames by type or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Frames Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Frames ({filteredFrames.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFrames.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Material</TableHead>
                  <TableHead className="text-explorer-text">Geometry</TableHead>
                  <TableHead className="text-explorer-text">Construction</TableHead>
                  <TableHead className="text-explorer-text">Notes</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFrames.map((frame) => (
                  <TableRow key={frame.id} className="border-explorer-chrome/20">
                    <TableCell>
                      <div className="font-medium text-explorer-text">{frame.type}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30">
                        {frame.material || 'Unspecified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {frame.rake_degrees && (
                        <div>Rake: {frame.rake_degrees}°</div>
                      )}
                      {frame.trail_mm && (
                        <div className="text-xs text-explorer-text-muted">Trail: {frame.trail_mm}mm</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {frame.construction_method || '-'}
                    </TableCell>
                    <TableCell className="text-explorer-text max-w-[200px] truncate">
                      {frame.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFrame(frame)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFrame(frame)}
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
                  ? "No frames match your search." 
                  : "No frames found. Start by adding your first frame."
                }
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateFrame}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Frame
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdminFrameDialog 
        open={isCreateFrameOpen}
        frame={editFrame}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminFrames;
