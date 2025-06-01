
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";

interface EmptyTrimLevelStateProps {
  onAdd: () => void;
}

const EmptyTrimLevelState = ({ onAdd }: EmptyTrimLevelStateProps) => {
  return (
    <div className="text-center py-8">
      <Car className="h-16 w-16 text-explorer-text-muted mx-auto mb-4" />
      <div className="text-explorer-text-muted mb-2">
        No trim levels found for this model year
      </div>
      <p className="text-sm text-explorer-text-muted mb-6">
        Create trim levels like "Base", "Sport", "Touring", or model-specific variants like "Fireball", "Stellar", "Supernova"
      </p>
      <Button
        onClick={onAdd}
        variant="outline"
        className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create First Trim Level
      </Button>
    </div>
  );
};

export default EmptyTrimLevelState;
