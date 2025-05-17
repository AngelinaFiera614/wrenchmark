
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandsEmptyStateProps {
  handleAddBrand: () => void;
}

const BrandsEmptyState = ({ handleAddBrand }: BrandsEmptyStateProps) => {
  return (
    <div className="border rounded-md p-12 text-center">
      <h3 className="text-lg font-medium">No brands found</h3>
      <p className="text-muted-foreground mt-2 mb-6">
        Add your first motorcycle brand to get started.
      </p>
      <Button 
        onClick={handleAddBrand}
        className="bg-accent-teal text-black hover:bg-accent-teal/80"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Brand
      </Button>
    </div>
  );
};

export default BrandsEmptyState;
