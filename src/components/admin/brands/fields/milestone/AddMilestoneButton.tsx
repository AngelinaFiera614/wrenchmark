
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddMilestoneButtonProps {
  onClick: () => void;
}

export const AddMilestoneButton: React.FC<AddMilestoneButtonProps> = ({ onClick }) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="w-full"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Milestone
    </Button>
  );
};
