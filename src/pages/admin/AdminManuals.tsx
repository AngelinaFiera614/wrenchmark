
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ManualWithMotorcycle } from '@/services/manuals';
import { getManuals, deleteManual } from '@/services/manuals';
import AdminManualDialog from '@/components/admin/manuals/AdminManualDialog';
import AdminManualsHeader from '@/components/admin/manuals/AdminManualsHeader';
import AdminManualsList from '@/components/admin/manuals/AdminManualsList';
import DeleteManualDialog from '@/components/admin/manuals/DeleteManualDialog';

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
      <AdminManualsHeader onCreateManual={handleCreate} />
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : (
        <AdminManualsList 
          manuals={manuals} 
          onEdit={handleEdit} 
          onDelete={setDeleteId} 
        />
      )}
      
      {/* Create/Edit Dialog */}
      <AdminManualDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        manual={currentManual}
        onSaveSuccess={handleSaveSuccess}
      />
      
      {/* Delete Confirmation */}
      <DeleteManualDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        onDelete={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminManuals;
