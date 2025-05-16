
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AdminBrands = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brands</h1>
        <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Manage motorcycle brands. Add new manufacturers, update information, or remove brands.
      </p>
      
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          Brand management functionality will be implemented in the next phase.
        </p>
      </div>
    </div>
  );
};

export default AdminBrands;
