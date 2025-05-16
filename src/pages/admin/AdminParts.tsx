
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// This will be expanded with CRUD operations in future implementation
const AdminParts = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPart = () => {
    toast({
      title: "Feature in development",
      description: "Parts management functionality will be implemented in the next phase.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parts Reference</h1>
        <Button
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={handleAddPart}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Manage motorcycle parts and components. Add new parts with images, details, and associated motorcycles.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">
            Parts management functionality will be implemented in a future phase.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminParts;
