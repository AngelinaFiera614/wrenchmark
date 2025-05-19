
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
  isEditing: boolean;
  onMigrateToNew?: () => void;
  showMigrateOption?: boolean;
}

export function FormActions({ 
  loading, 
  onCancel, 
  isEditing, 
  onMigrateToNew,
  showMigrateOption = false
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {showMigrateOption && onMigrateToNew && (
        <Button 
          type="button" 
          variant="outline" 
          className="mr-auto text-accent-teal hover:text-accent-teal/80"
          onClick={onMigrateToNew}
        >
          Migrate to New Schema
        </Button>
      )}
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
