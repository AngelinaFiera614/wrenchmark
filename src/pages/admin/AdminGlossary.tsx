
import React, { useState, useEffect } from 'react';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import { GlossaryTerm } from '@/types/glossary';
import { AdminGlossaryHeader } from '@/components/admin/glossary/AdminGlossaryHeader';
import { AdminGlossaryFilters } from '@/components/admin/glossary/AdminGlossaryFilters';
import { AdminGlossaryTable } from '@/components/admin/glossary/AdminGlossaryTable';
import { AdminGlossaryList } from '@/components/admin/glossary/AdminGlossaryList';
import { AdminGlossaryEmptyState } from '@/components/admin/glossary/AdminGlossaryEmptyState';
import { GlossaryDeleteDialog } from '@/components/admin/glossary/GlossaryDeleteDialog';
import { BulkOperationsToolbar } from '@/components/admin/glossary/BulkOperationsToolbar';
import { QuickActionsPanel } from '@/components/admin/glossary/QuickActionsPanel';
import { FilterPreset } from '@/components/admin/glossary/FilterPresets';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth';
import { InlineGlossaryForm } from '@/components/admin/glossary/InlineGlossaryForm';
import { ColumnVisibility, DEFAULT_VISIBILITY } from '@/components/admin/glossary/ColumnVisibilityControls';
import { exportGlossaryTerms } from '@/utils/glossaryExport';

const AdminGlossary: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentTerm, setCurrentTerm] = useState<GlossaryTerm | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(DEFAULT_VISIBILITY);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<string>('');
  const { isAdmin } = useAuth();

  // Load column visibility from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('glossary-column-visibility');
    if (saved) {
      try {
        setColumnVisibility(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved column visibility:', error);
      }
    }
  }, []);

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
      setSelectedTerms(prev => prev.filter(id => id !== term.id));
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

  const handleBulkDelete = async (termIds: string[]) => {
    try {
      await Promise.all(termIds.map(id => deleteTerm(id)));
      toast.success(`${termIds.length} terms deleted successfully`);
      setSelectedTerms([]);
    } catch (error) {
      console.error("Error deleting terms:", error);
      toast.error("Failed to delete some terms. Please try again.");
    }
  };

  const handleBulkExport = (termsToExport: GlossaryTerm[]) => {
    exportGlossaryTerms(termsToExport, {
      format: 'csv',
      columnVisibility,
    });
    toast.success(`Exported ${termsToExport.length} terms`);
  };

  const handleBulkCategoryAssign = (termIds: string[]) => {
    // TODO: Implement bulk category assignment dialog
    toast.info("Bulk category assignment coming soon!");
  };

  const handleDuplicateTerm = (term: GlossaryTerm) => {
    setCurrentTerm({
      ...term,
      id: '',
      term: `${term.term} (Copy)`,
      slug: `${term.slug}-copy`,
    } as GlossaryTerm);
    setIsFormOpen(true);
  };

  const handleApplyPreset = (preset: FilterPreset) => {
    setActivePreset(preset.id);
    
    // Apply preset filters
    if (preset.filters.categories) {
      setSelectedCategories(preset.filters.categories);
    }
    if (preset.filters.search) {
      setSearch(preset.filters.search);
    }
    if (preset.filters.recentlyUpdated) {
      setSortBy('updated-desc');
    }
    
    toast.success(`Applied "${preset.name}" filter`);
  };

  // Get recent terms for quick actions
  const recentTerms = React.useMemo(() => 
    allTerms
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
  , [allTerms]);

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
            terms={terms}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <AdminGlossaryFilters
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={() => {
              clearFilters();
              setActivePreset('');
            }}
            hasActiveFilters={hasActiveFilters}
            onApplyPreset={handleApplyPreset}
            activePreset={activePreset}
          />
          
          {!isLoading && terms.length === 0 ? (
            <AdminGlossaryEmptyState onAddTerm={handleAddTerm} />
          ) : (
            <>
              {viewMode === "table" ? (
                <AdminGlossaryTable
                  terms={terms}
                  allTerms={allTerms}
                  searchTerm={search}
                  onSearchChange={setSearch}
                  onEdit={handleEditTerm}
                  onDelete={handleDeleteTerm}
                  columnVisibility={columnVisibility}
                  selectedTerms={selectedTerms}
                  onSelectionChange={setSelectedTerms}
                />
              ) : (
                <AdminGlossaryList
                  terms={terms}
                  allTerms={allTerms}
                  searchTerm={search}
                  onSearchChange={setSearch}
                  onEdit={handleEditTerm}
                  onDelete={handleDeleteTerm}
                  selectedTerms={selectedTerms}
                  onSelectionChange={setSelectedTerms}
                />
              )}
            </>
          )}

          <BulkOperationsToolbar
            selectedTerms={selectedTerms}
            terms={terms}
            onClearSelection={() => setSelectedTerms([])}
            onBulkDelete={handleBulkDelete}
            onBulkExport={handleBulkExport}
            onBulkCategoryAssign={handleBulkCategoryAssign}
          />

          <QuickActionsPanel
            onAddTerm={handleAddTerm}
            onDuplicateTerm={handleDuplicateTerm}
            recentTerms={recentTerms}
          />
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
