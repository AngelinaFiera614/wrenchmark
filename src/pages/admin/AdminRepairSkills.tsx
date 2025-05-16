
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AdminRepairSkills = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Repair Skills</h1>
        <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Create and manage repair guides for motorcycles. Add step-by-step instructions for common maintenance tasks.
      </p>
      
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          Repair skills management functionality will be implemented in a future phase.
        </p>
      </div>
    </div>
  );
};

export default AdminRepairSkills;
