
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AdminBrakeSystemsHeaderProps {
  onCreateBrakeSystem: () => void;
}

const AdminBrakeSystemsHeader = ({ onCreateBrakeSystem }: AdminBrakeSystemsHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-explorer-text">Brake Systems</h1>
        <p className="text-explorer-text-muted mt-1">
          Manage brake system components for motorcycle configurations.
        </p>
      </div>
      <Button 
        onClick={onCreateBrakeSystem}
        className="bg-accent-teal text-black hover:bg-accent-teal/80"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Brake System
      </Button>
    </div>
  );
};

export default AdminBrakeSystemsHeader;
