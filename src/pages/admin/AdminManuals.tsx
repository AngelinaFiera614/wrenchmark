
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ManualWithMotorcycle } from '@/services/manuals';
import { getManuals, deleteManual } from '@/services/manuals';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminManualDialog from '@/components/admin/manuals/AdminManualDialog';

const AdminManuals = () => {
  const [manuals, setManuals] = useState<ManualWithMotorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentManual, setCurrentManual] = useState<ManualWithMotorcycle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  const loadManuals = async () => {
    try {
      setLoading(true);
      const data = await getManuals();
      setManuals(data);
    } catch (error) {
      console.error('Error loading manuals:', error);
      toast({
        title: 'Failed to load manuals',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManuals();
  }, []);

  const handleCreate = () => {
    setCurrentManual(null);
    setDialogOpen(true);
  };

  const handleEdit = (manual: ManualWithMotorcycle) => {
    setCurrentManual(manual);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setDeleteLoading(true);
      await deleteManual(deleteId);
      setManuals(manuals.filter(manual => manual.id !== deleteId));
      toast({
        title: 'Manual deleted',
        description: 'The manual has been removed',
      });
    } catch (error) {
      console.error('Error deleting manual:', error);
      toast({
        title: 'Failed to delete manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleSaveSuccess = (savedManual: ManualWithMotorcycle) => {
    setDialogOpen(false);
    
    if (currentManual) {
      // Update existing manual
      setManuals(manuals.map(manual => 
        manual.id === savedManual.id ? savedManual : manual
      ));
      toast({
        title: 'Manual updated',
        description: 'The manual has been updated successfully'
      });
    } else {
      // Add new manual
      setManuals([...manuals, savedManual]);
      toast({
        title: 'Manual created',
        description: 'The new manual has been added successfully'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manuals</h1>
        <Button
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={handleCreate}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Create and manage manuals for motorcycles.
      </p>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : manuals.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Motorcycle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manuals.map((manual) => (
                <TableRow key={manual.id}>
                  <TableCell className="font-medium">{manual.title}</TableCell>
                  <TableCell>{manual.motorcycle_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{manual.manual_type}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(manual)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(manual.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">
            No manuals have been created yet. Add your first manual using the button above.
          </p>
        </div>
      )}
      
      {/* Create/Edit Dialog */}
      <AdminManualDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        manual={currentManual}
        onSaveSuccess={handleSaveSuccess}
      />
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this manual. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManuals;
