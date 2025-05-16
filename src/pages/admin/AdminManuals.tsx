
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Loader2, File, Trash2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllManuals, deleteManual } from '@/services/manualService';
import { Manual } from '@/types';
import AdminManualDialog from '@/components/admin/manuals/AdminManualDialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const manualTypeColors = {
  owner: 'bg-blue-500/20 text-blue-300 border-0',
  service: 'bg-amber-500/20 text-amber-300 border-0',
  wiring: 'bg-green-500/20 text-green-300 border-0'
};

const AdminManuals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: manuals, isLoading, refetch } = useQuery({
    queryKey: ['admin-manuals'],
    queryFn: getAllManuals
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (refreshData = false) => {
    setIsDialogOpen(false);
    if (refreshData) {
      refetch();
    }
  };

  const handleDeleteManual = async (manual: Manual) => {
    if (confirm(`Are you sure you want to delete "${manual.title}"? This will also remove the file.`)) {
      try {
        setIsDeleting(manual.id);
        await deleteManual(manual);
        toast.success('Manual deleted successfully');
        refetch();
      } catch (error) {
        console.error('Error deleting manual:', error);
        toast.error('Failed to delete manual');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleViewMotorcycle = (motorcycleId: string) => {
    navigate(`/motorcycles/${motorcycleId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manuals</h1>
        <Button className="bg-accent-teal text-black hover:bg-accent-teal/80" onClick={handleOpenDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Upload and manage motorcycle manuals. Add service manuals, owner's guides, and wiring diagrams.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : manuals && manuals.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Motorcycle</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manuals.map((manual) => (
                <TableRow key={manual.id}>
                  <TableCell className="font-medium flex items-center">
                    <File className="mr-2 h-4 w-4 text-muted-foreground" />
                    {manual.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={manualTypeColors[manual.manual_type as keyof typeof manualTypeColors]}>
                      {manual.manual_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{manual.year || '-'}</TableCell>
                  <TableCell>
                    <span className="cursor-pointer hover:text-accent-teal transition-colors" onClick={() => handleViewMotorcycle(manual.motorcycle_id)}>
                      {(manual as any).motorcycles?.make} {(manual as any).motorcycles?.model_name}
                    </span>
                  </TableCell>
                  <TableCell>{manual.downloads}</TableCell>
                  <TableCell>{manual.file_size_mb} MB</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(manual.file_url, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive" 
                        onClick={() => handleDeleteManual(manual)}
                        disabled={isDeleting === manual.id}
                      >
                        {isDeleting === manual.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground mb-4">No manuals found. Add your first manual to get started.</p>
          <Button onClick={handleOpenDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Manual
          </Button>
        </div>
      )}
      
      <AdminManualDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default AdminManuals;
