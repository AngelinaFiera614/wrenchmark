
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MotorcycleCategory } from "@/types";

interface CategoryManagerProps {
  categories: MotorcycleCategory[];
  onCategoriesChange: (categories: MotorcycleCategory[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCategoriesChange
}) => {
  const { toast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newCategory.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty.",
      });
      return;
    }

    if (categories.includes(newCategory.trim() as MotorcycleCategory)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category already exists.",
      });
      return;
    }

    const updatedCategories = [...categories, newCategory.trim() as MotorcycleCategory];
    onCategoriesChange(updatedCategories);
    setNewCategory("");
    setIsAdding(false);
    
    toast({
      title: "Category Added",
      description: `"${newCategory.trim()}" has been added to the categories.`,
    });
  };

  const handleEdit = (index: number, category: MotorcycleCategory) => {
    setEditingIndex(index);
    setEditValue(category);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty.",
      });
      return;
    }

    if (editingIndex === null) return;

    const updatedCategories = [...categories];
    updatedCategories[editingIndex] = editValue.trim() as MotorcycleCategory;
    onCategoriesChange(updatedCategories);
    setEditingIndex(null);
    setEditValue("");
    
    toast({
      title: "Category Updated",
      description: "Category has been successfully updated.",
    });
  };

  const handleDelete = (index: number, category: MotorcycleCategory) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    onCategoriesChange(updatedCategories);
    
    toast({
      title: "Category Deleted",
      description: `"${category}" has been removed from the categories.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCategory("");
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center justify-between">
          Motorcycle Categories
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Category
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new category form */}
        {isAdding && (
          <div className="flex items-center gap-2 p-3 bg-explorer-dark rounded-md border border-explorer-chrome/20">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdd}
              className="text-green-400 border-green-400/30 hover:bg-green-400/10"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelAdd}
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Categories list */}
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-explorer-dark rounded-md border border-explorer-chrome/20">
              {editingIndex === index ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="text-green-400 border-green-400/30 hover:bg-green-400/10"
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <Badge variant="outline" className="text-explorer-text border-explorer-chrome/30">
                    {category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(index, category)}
                      className="h-7 px-2 text-xs text-blue-400 border-blue-400/30 hover:bg-blue-400/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(index, category)}
                      className="h-7 px-2 text-xs text-red-400 border-red-400/30 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {categories.length === 0 && (
            <div className="text-center py-8 text-explorer-text-muted">
              No categories defined. Add your first category to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
