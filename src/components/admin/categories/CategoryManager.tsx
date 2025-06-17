
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MotorcycleCategory } from "@/types/motorcycle";

const CategoryManager = () => {
  const [categories, setCategories] = useState<MotorcycleCategory[]>([
    {
      id: "1",
      name: "Sport",
      description: "High-performance motorcycles designed for speed and agility",
      slug: "sport"
    },
    {
      id: "2", 
      name: "Cruiser",
      description: "Comfortable motorcycles for long-distance touring",
      slug: "cruiser"
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MotorcycleCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: ""
  });

  const handleAddCategory = () => {
    const newCategory: MotorcycleCategory = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString()
    };

    setCategories([...categories, newCategory]);
    setFormData({ name: "", description: "", slug: "" });
    setIsEditing(false);
  };

  const handleEditCategory = (category: MotorcycleCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      slug: category.slug
    });
    setIsEditing(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, ...formData, updated_at: new Date().toISOString() }
        : cat
    );

    setCategories(updatedCategories);
    setFormData({ name: "", description: "", slug: "" });
    setIsEditing(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", slug: "" });
    setIsEditing(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            {isEditing ? "Edit Category" : "Add New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-explorer-text mb-2">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category name"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-explorer-text mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Category description"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-explorer-text mb-2">
              Slug
            </label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="category-slug"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdateCategory} className="bg-accent-teal text-black">
                  Update Category
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAddCategory} className="bg-accent-teal text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Existing Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border border-explorer-chrome/20 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-explorer-text">{category.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {category.slug}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-sm text-explorer-text-muted">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditCategory(category)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
