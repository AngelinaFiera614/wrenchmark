
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

export function FormActions({ loading, onCancel, isEditing }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isEditing ? "Update" : "Create"}
      </Button>
    </div>
  );
}
