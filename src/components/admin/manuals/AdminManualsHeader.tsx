
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminManualsHeaderProps {
  onCreateManual: () => void;
}

const AdminManualsHeader = ({ onCreateManual }: AdminManualsHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manuals</h1>
        <Button
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={onCreateManual}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Create and manage manuals for motorcycles.
      </p>
    </>
  );
};

export default AdminManualsHeader;
