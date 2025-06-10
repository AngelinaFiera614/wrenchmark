
import React from "react";
import CategoryManager from "@/components/admin/categories/CategoryManager";
import { useMotorcycleCategories } from "@/hooks/useMotorcycleCategories";

const AdminCategories = () => {
  const { categories, updateCategories } = useMotorcycleCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Motorcycle Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage the available motorcycle categories used in filters and forms.
          </p>
        </div>
      </div>

      <CategoryManager 
        categories={categories}
        onCategoriesChange={updateCategories}
      />
    </div>
  );
};

export default AdminCategories;
