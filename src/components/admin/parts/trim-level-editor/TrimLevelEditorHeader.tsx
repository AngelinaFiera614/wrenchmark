
import React from "react";
import { Button } from "@/components/ui/button";

interface TrimLevelEditorHeaderProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  formData: { name: string };
}

const TrimLevelEditorHeader = ({
  isEditing,
  onSave,
  onCancel,
  saving,
  formData
}: TrimLevelEditorHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-explorer-text">
        {isEditing ? 'Edit Trim Level' : 'New Trim Level'}
      </h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          disabled={saving || !formData.name.trim()}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          {saving ? "Saving..." : isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default TrimLevelEditorHeader;
