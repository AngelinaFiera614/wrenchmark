
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface AddMilestoneButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const AddMilestoneButton: React.FC<AddMilestoneButtonProps> = ({ 
  onClick, 
  isDisabled = false,
  isLoading = false 
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Adding..." : "Add Milestone"}
    </Button>
  );
};
