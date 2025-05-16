
import React, { createContext, useContext, useState, useCallback } from 'react';
import { RidingSkill } from '@/types/riding-skills';
import { useToast } from '@/hooks/use-toast';
import { getRidingSkills, deleteRidingSkill } from '@/services/ridingSkillsService';

interface AdminSkillsContextType {
  skills: RidingSkill[];
  loading: boolean;
  deleteLoading: boolean;
  loadSkills: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleCreateSuccess: (savedSkill: RidingSkill) => void;
  handleUpdateSuccess: (savedSkill: RidingSkill) => void;
}

const AdminSkillsContext = createContext<AdminSkillsContextType | undefined>(undefined);

export const AdminSkillsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<RidingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRidingSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: 'Failed to load skills',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeleteLoading(true);
      await deleteRidingSkill(id);
      setSkills(skills.filter(skill => skill.id !== id));
      toast({
        title: 'Skill deleted',
        description: 'The riding skill has been removed',
      });
      // Removed the return true statement to match the expected void return type
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Failed to delete skill',
        description: 'Please try again later',
        variant: 'destructive',
      });
      // Removed the return false statement to match the expected void return type
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateSuccess = (savedSkill: RidingSkill) => {
    setSkills([...skills, savedSkill]);
    toast({
      title: 'Skill created',
      description: 'The new riding skill has been added successfully'
    });
  };

  const handleUpdateSuccess = (savedSkill: RidingSkill) => {
    setSkills(skills.map(skill => 
      skill.id === savedSkill.id ? savedSkill : skill
    ));
    toast({
      title: 'Skill updated',
      description: 'The riding skill has been updated successfully'
    });
  };

  return (
    <AdminSkillsContext.Provider value={{
      skills,
      loading,
      deleteLoading,
      loadSkills,
      handleDelete,
      handleCreateSuccess,
      handleUpdateSuccess,
    }}>
      {children}
    </AdminSkillsContext.Provider>
  );
};

export const useAdminSkills = () => {
  const context = useContext(AdminSkillsContext);
  if (context === undefined) {
    throw new Error('useAdminSkills must be used within an AdminSkillsProvider');
  }
  return context;
};
