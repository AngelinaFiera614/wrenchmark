
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CategoryManager from "@/components/admin/categories/CategoryManager";
import { useMotorcycleCategories } from "@/hooks/useMotorcycleCategories";

const AdminCategories = () => {
  const { toast } = useToast();
  const { categories, updateCategories, resetToDefaults } = useMotorcycleCategories();

  const handleResetToDefaults = () => {
    resetToDefaults();
    toast({
      title: "Categories Reset",
      description: "Categories have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Motorcycle Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage the available motorcycle categories used in filters and forms.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleResetToDefaults}
          className="text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>

      <CategoryManager 
        categories={categories}
        onCategoriesChange={updateCategories}
      />
    </div>
  );
};

export default AdminCategories;
