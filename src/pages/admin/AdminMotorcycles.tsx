
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, ArrowRight } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { getAllMotorcycles } from "@/services/motorcycleService";
import { useQuery } from "@tanstack/react-query";
import AdminMotorcycleDialog from "@/components/admin/motorcycles/AdminMotorcycleDialog";
import { supabase } from "@/integrations/supabase/client";

const AdminMotorcycles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editMotorcycle, setEditMotorcycle] = useState<Motorcycle | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState<Motorcycle | null>(null);

  const { data: motorcycles, isLoading, refetch } = useQuery({
    queryKey: ["admin-motorcycles"],
    queryFn: getAllMotorcycles
  });

  const handleAddMotorcycle = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    setEditMotorcycle(motorcycle);
  };

  const handleDeleteClick = (motorcycle: Motorcycle) => {
    setMotorcycleToDelete(motorcycle);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!motorcycleToDelete) return;

    try {
      const { error } = await supabase
        .from('motorcycles')
        .delete()
        .eq('id', motorcycleToDelete.id);

      if (error) throw error;

      toast({
        title: "Motorcycle deleted",
        description: `${motorcycleToDelete.make} ${motorcycleToDelete.model} has been removed.`,
      });

      refetch();
      setIsDeleteConfirmOpen(false);
      setMotorcycleToDelete(null);
    } catch (error) {
      console.error("Error deleting motorcycle:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete motorcycle. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateDialogOpen(false);
    setEditMotorcycle(null);
    if (refreshData) {
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Legacy Motorcycles</h1>
          <p className="text-muted-foreground">
            Manage individual motorcycle entries. For better organization with multiple years and configurations, use the Motorcycle Models interface.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/motorcycle-models')}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Motorcycle Models
          </Button>
          <Button 
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
            onClick={handleAddMotorcycle}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Motorcycle
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : motorcycles && motorcycles.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Engine</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {motorcycles.map((motorcycle) => (
                <TableRow key={motorcycle.id}>
                  <TableCell>
                    <div className="h-12 w-16 bg-black rounded overflow-hidden">
                      <img 
                        src={motorcycle.image_url || '/placeholder.svg'} 
                        alt={`${motorcycle.make} ${motorcycle.model}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{motorcycle.make}</TableCell>
                  <TableCell>{motorcycle.model}</TableCell>
                  <TableCell>{motorcycle.year}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{motorcycle.category}</Badge>
                  </TableCell>
                  <TableCell>{motorcycle.engine_size}cc</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditMotorcycle(motorcycle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(motorcycle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No motorcycles found. Add your first motorcycle to get started.</p>
        </div>
      )}

      <AdminMotorcycleDialog 
        open={isCreateDialogOpen || editMotorcycle !== null}
        motorcycle={editMotorcycle}
        onClose={handleDialogClose}
      />

      {isDeleteConfirmOpen && motorcycleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete {motorcycleToDelete.make} {motorcycleToDelete.model}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMotorcycles;
