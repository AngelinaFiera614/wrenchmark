
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AdminRidingSkillsEmptyProps {
  onCreateNew: () => void;
}

export const AdminRidingSkillsEmpty: React.FC<AdminRidingSkillsEmptyProps> = ({ onCreateNew }) => {
  return (
    <div className="text-center p-12 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">No riding skills found</h3>
      <p className="text-muted-foreground mb-6">
        Create your first riding skill to help riders improve their motorcycle handling.
      </p>
      <Button 
        onClick={onCreateNew}
        className="bg-accent-teal text-black hover:bg-accent-teal/80"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create First Skill
      </Button>
    </div>
  );
};
