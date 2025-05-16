
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminRidingSkillsHeader } from '@/components/admin/riding-skills/AdminRidingSkillsHeader';
import { AdminRidingSkillsTable } from '@/components/admin/riding-skills/AdminRidingSkillsTable';
import { AdminRidingSkillsEmpty } from '@/components/admin/riding-skills/AdminRidingSkillsEmpty';
import { AdminSkillsProvider } from '@/components/admin/riding-skills/AdminSkillsContext';
import { DeleteRidingSkillDialog } from '@/components/admin/riding-skills/DeleteRidingSkillDialog';
import AdminRidingSkillDialog from '@/components/admin/riding-skills/AdminRidingSkillDialog';
import { useRidingSkills } from '@/hooks/useRidingSkills';
import { Loader2 } from 'lucide-react';
import { RidingSkill } from '@/types/riding-skills';

const AdminRidingSkills = () => {
  const { toast } = useToast();
  const { skills, isLoading, refetch } = useRidingSkills();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<RidingSkill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<RidingSkill | null>(null);

  const handleAddSkill = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditSkill = (skill: RidingSkill) => {
    setEditSkill(skill);
  };

  const handleDeleteClick = (skillId: string) => {
    // Find the skill in the list by ID and set it as the skill to delete
    const skillToDelete = skills.find(skill => skill.id === skillId);
    if (skillToDelete) {
      setSkillToDelete(skillToDelete);
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateDialogOpen(false);
    setEditSkill(null);
    if (refreshData) {
      refetch();
      toast({
        title: 'Success',
        description: 'Riding skill was updated successfully',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    setSkillToDelete(null);
    toast({
      title: 'Success',
      description: 'Riding skill was deleted successfully',
    });
    await refetch();
  };

  return (
    <AdminSkillsProvider>
      <div className="space-y-6">
        <AdminRidingSkillsHeader onCreateNew={handleAddSkill} />
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
          </div>
        ) : skills?.length > 0 ? (
          <AdminRidingSkillsTable 
            skills={skills} 
            onEdit={handleEditSkill} 
            onDelete={handleDeleteClick} 
          />
        ) : (
          <AdminRidingSkillsEmpty onCreateNew={handleAddSkill} />
        )}

        {/* Create/Edit Dialog */}
        <AdminRidingSkillDialog
          open={isCreateDialogOpen || editSkill !== null}
          skill={editSkill}
          onOpenChange={(open) => !open && handleDialogClose()}
          onSaveSuccess={() => handleDialogClose(true)}
        />
        
        {/* Delete Dialog */}
        <DeleteRidingSkillDialog
          open={skillToDelete !== null}
          onOpenChange={(open) => !open && setSkillToDelete(null)}
          onConfirm={handleDeleteConfirm}
          loading={false}
        />
      </div>
    </AdminSkillsProvider>
  );
};

export default AdminRidingSkills;
