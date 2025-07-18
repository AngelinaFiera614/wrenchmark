
import React, { useEffect, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ManualWithMotorcycle } from '@/services/manuals';
import { getManuals, deleteManual } from '@/services/manuals';
import AdminManualDialog from '@/components/admin/manuals/AdminManualDialog';
import AdminManualsHeader from '@/components/admin/manuals/AdminManualsHeader';
import AdminManualsList from '@/components/admin/manuals/AdminManualsList';
import DeleteManualDialog from '@/components/admin/manuals/DeleteManualDialog';
import BatchImportDialog from '@/components/admin/manuals/BatchImportDialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminManuals = () => {
  const [manuals, setManuals] = useState<ManualWithMotorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentManual, setCurrentManual] = useState<ManualWithMotorcycle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [batchImportOpen, setBatchImportOpen] = useState(false);
  const { toast } = useToast();

  const loadManuals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getManuals();
      setManuals(data);
    } catch (error) {
      console.error('Error loading manuals:', error);
      setError('Failed to load manuals. Please try again.');
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

  const handleBatchImportSuccess = (importedManuals: ManualWithMotorcycle[]) => {
    // Add imported manuals to the list
    setManuals([...manuals, ...importedManuals]);
    setBatchImportOpen(false);
  };

  const handleRetry = () => {
    loadManuals();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AdminManualsHeader onCreateManual={handleCreate} />
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setBatchImportOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Batch Import
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="link" 
              className="px-0 ml-2 text-sm" 
              onClick={handleRetry}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal mb-2" />
          <p className="text-muted-foreground">Loading manuals...</p>
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
      
      {/* Batch Import Dialog */}
      <BatchImportDialog 
        open={batchImportOpen}
        onOpenChange={setBatchImportOpen}
        onImportSuccess={handleBatchImportSuccess}
      />
    </div>
  );
};

export default AdminManuals;
