
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AdminRidingSkillsHeaderProps {
  onCreateNew: () => void;
}

export const AdminRidingSkillsHeader: React.FC<AdminRidingSkillsHeaderProps> = ({ onCreateNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Riding Skills & Drills</h1>
        <Button
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={onCreateNew}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Create and manage riding skills and practice drills for users to improve their motorcycle handling.
      </p>
    </div>
  );
};
