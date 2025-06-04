
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface AdminPartsLayoutHeaderProps {
  onRunValidation: () => void;
}

const AdminPartsLayoutHeader = ({ onRunValidation }: AdminPartsLayoutHeaderProps) => {
  return (
    <div className="border-b border-explorer-chrome/30 bg-explorer-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-explorer-text">MOTORCYCLE CONFIGURATIONS</h1>
            <p className="text-explorer-text-muted">Manage models, trims, and components</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRunValidation}
              className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Run Full Validation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPartsLayoutHeader;
