
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AdminManuals = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manuals</h1>
        <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Upload and manage motorcycle manuals. Add service manuals, owner's guides, and wiring diagrams.
      </p>
      
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          Manual management functionality will be implemented in a future phase.
        </p>
      </div>
    </div>
  );
};

export default AdminManuals;
