
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface BrandFormFooterProps {
  loading: boolean;
  onCancel: () => void;
  isEditMode: boolean;
}

export const BrandFormFooter: React.FC<BrandFormFooterProps> = ({ 
  loading, 
  onCancel, 
  isEditMode 
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={loading} variant="teal">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isEditMode ? "Update" : "Create"}
      </Button>
    </DialogFooter>
  );
};
