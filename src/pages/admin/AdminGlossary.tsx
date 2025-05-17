
import React, { useState } from 'react';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import { GlossaryTerm } from '@/types/glossary';
import { AdminGlossaryHeader } from '@/components/admin/glossary/AdminGlossaryHeader';
import { AdminGlossaryTable } from '@/components/admin/glossary/AdminGlossaryTable';
import { AdminGlossaryList } from '@/components/admin/glossary/AdminGlossaryList';
import { AdminGlossaryEmptyState } from '@/components/admin/glossary/AdminGlossaryEmptyState';
import AdminGlossaryDialog from '@/components/admin/glossary/AdminGlossaryDialog';
import { GlossaryDeleteDialog } from '@/components/admin/glossary/GlossaryDeleteDialog';
import { BrandsMobileViewToggle } from '@/components/admin/brands/BrandsMobileViewToggle';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';

const AdminGlossary: React.FC = () => {
  const [isTableView, setIsTableView] = useState(true);
  const [currentTerm, setCurrentTerm] = useState<GlossaryTerm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  const {
    terms,
    allTerms,
    isLoading,
    deleteTerm
  } = useGlossaryTerms();

  const handleAddTerm = () => {
    setCurrentTerm(null);
    setIsDialogOpen(true);
  };

  const handleEditTerm = (term: GlossaryTerm) => {
    setCurrentTerm(term);
    setIsDialogOpen(true);
  };

  const handleDeleteTerm = (term: GlossaryTerm) => {
    setCurrentTerm(term);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (term: GlossaryTerm) => {
    setIsDeleteLoading(true);
    try {
      await deleteTerm(term.id);
      toast.success(`"${term.term}" has been deleted`);
      setIsDeleteDialogOpen(false);
      setCurrentTerm(null);
    } catch (error) {
      console.error("Error deleting term:", error);
      toast.error("Failed to delete term. Please try again.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleCloseDialog = (refresh?: boolean) => {
    setIsDialogOpen(false);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-2 text-center p-12">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminGlossaryHeader 
        onAddTerm={handleAddTerm}
        termCount={terms.length} 
      />
      
      {!isLoading && terms.length === 0 ? (
        <AdminGlossaryEmptyState onAddTerm={handleAddTerm} />
      ) : (
        <>
          <div className="flex justify-end">
            <BrandsMobileViewToggle
              isTableView={isTableView}
              setIsTableView={setIsTableView}
            />
          </div>
      
          {isTableView ? (
            <AdminGlossaryTable
              terms={terms}
              onEdit={handleEditTerm}
              onDelete={handleDeleteTerm}
            />
          ) : (
            <AdminGlossaryList
              terms={terms}
              onEdit={handleEditTerm}
              onDelete={handleDeleteTerm}
            />
          )}
        </>
      )}
      
      <AdminGlossaryDialog
        open={isDialogOpen}
        term={currentTerm}
        onClose={handleCloseDialog}
        availableTerms={allTerms}
      />
      
      <GlossaryDeleteDialog
        term={currentTerm}
        open={isDeleteDialogOpen}
        loading={isDeleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default AdminGlossary;
