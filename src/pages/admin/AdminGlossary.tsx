
import React, { useState } from 'react';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import { GlossaryTerm } from '@/types/glossary';
import { AdminGlossaryHeader } from '@/components/admin/glossary/AdminGlossaryHeader';
import { AdminGlossaryFilters } from '@/components/admin/glossary/AdminGlossaryFilters';
import { AdminGlossaryTable } from '@/components/admin/glossary/AdminGlossaryTable';
import { AdminGlossaryList } from '@/components/admin/glossary/AdminGlossaryList';
import { AdminGlossaryEmptyState } from '@/components/admin/glossary/AdminGlossaryEmptyState';
import { GlossaryDeleteDialog } from '@/components/admin/glossary/GlossaryDeleteDialog';
import BrandsMobileViewToggle from '@/components/admin/brands/BrandsMobileViewToggle';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth';
import { InlineGlossaryForm } from '@/components/admin/glossary/InlineGlossaryForm';

const AdminGlossary: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentTerm, setCurrentTerm] = useState<GlossaryTerm | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  const {
    terms,
    allTerms,
    isLoading,
    search,
    setSearch,
    categories,
    selectedCategories,
    setSelectedCategories,
    sortBy,
    setSortBy,
    hasActiveFilters,
    clearFilters,
    deleteTerm
  } = useGlossaryTerms();

  const handleAddTerm = () => {
    setCurrentTerm(null);
    setIsFormOpen(true);
  };

  const handleEditTerm = (term: GlossaryTerm) => {
    setCurrentTerm(term);
    setIsFormOpen(true);
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

  const handleCloseForm = (refresh?: boolean) => {
    setIsFormOpen(false);
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
      {!isFormOpen ? (
        <>
          <AdminGlossaryHeader 
            onAddTerm={handleAddTerm}
            termCount={terms.length} 
          />
          
          <AdminGlossaryFilters
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          
          {!isLoading && terms.length === 0 ? (
            <AdminGlossaryEmptyState onAddTerm={handleAddTerm} />
          ) : (
            <>
              <div className="flex justify-end">
                <BrandsMobileViewToggle
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>
          
              {viewMode === "table" ? (
                <AdminGlossaryTable
                  terms={terms}
                  searchTerm={search}
                  onSearchChange={setSearch}
                  onEdit={handleEditTerm}
                  onDelete={handleDeleteTerm}
                />
              ) : (
                <AdminGlossaryList
                  terms={terms}
                  searchTerm={search}
                  onSearchChange={setSearch}
                  onEdit={handleEditTerm}
                  onDelete={handleDeleteTerm}
                />
              )}
            </>
          )}
        </>
      ) : (
        <InlineGlossaryForm
          term={currentTerm}
          onClose={handleCloseForm}
          availableTerms={allTerms}
        />
      )}
      
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
