
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { RidingSkill } from '@/types/riding-skills';
import AdminRidingSkillDialog from '@/components/admin/riding-skills/AdminRidingSkillDialog';
import { AdminRidingSkillsHeader } from '@/components/admin/riding-skills/AdminRidingSkillsHeader';
import { AdminRidingSkillsTable } from '@/components/admin/riding-skills/AdminRidingSkillsTable';
import { AdminRidingSkillsEmpty } from '@/components/admin/riding-skills/AdminRidingSkillsEmpty';
import { DeleteRidingSkillDialog } from '@/components/admin/riding-skills/DeleteRidingSkillDialog';
import { AdminSkillsProvider, useAdminSkills } from '@/components/admin/riding-skills/AdminSkillsContext';

const AdminRidingSkillsContent: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<RidingSkill | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const { 
    skills, 
    loading, 
    deleteLoading, 
    loadSkills, 
    handleDelete,
    handleCreateSuccess,
    handleUpdateSuccess
  } = useAdminSkills();

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const handleCreate = () => {
    setCurrentSkill(null);
    setDialogOpen(true);
  };

  const handleEdit = (skill: RidingSkill) => {
    setCurrentSkill(skill);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleSaveSuccess = (savedSkill: RidingSkill) => {
    setDialogOpen(false);
    
    if (currentSkill) {
      // Update existing skill
      handleUpdateSuccess(savedSkill);
    } else {
      // Add new skill
      handleCreateSuccess(savedSkill);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  return (
    <>
      <AdminRidingSkillsHeader onCreateNew={handleCreate} />
      
      {skills.length > 0 ? (
        <AdminRidingSkillsTable 
          skills={skills} 
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ) : (
        <AdminRidingSkillsEmpty />
      )}
      
      {/* Create/Edit Dialog */}
      <AdminRidingSkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skill={currentSkill}
        onSaveSuccess={handleSaveSuccess}
      />
      
      {/* Delete Confirmation */}
      <DeleteRidingSkillDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </>
  );
};

const AdminRidingSkills = () => {
  return (
    <AdminSkillsProvider>
      <AdminRidingSkillsContent />
    </AdminSkillsProvider>
  );
};

export default AdminRidingSkills;
