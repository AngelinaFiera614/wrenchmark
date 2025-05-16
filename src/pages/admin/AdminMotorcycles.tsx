
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AdminMotorcycles = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Motorcycles</h1>
        <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Manage motorcycle listings in the database. Add, edit, or remove motorcycles.
      </p>
      
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          Motorcycle management functionality will be implemented in the next phase.
        </p>
      </div>
    </div>
  );
};

export default AdminMotorcycles;
