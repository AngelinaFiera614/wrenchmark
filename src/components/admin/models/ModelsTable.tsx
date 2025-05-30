
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminModelDialog from "@/components/admin/models/AdminModelDialog";
import { Link } from "react-router-dom";

const ModelsTable = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch models
  const { data: models, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          id,
          brand_id,
          name,
          type,
          base_description,
          production_start_year,
          production_end_year,
          production_status,
          default_image_url,
          slug,
          brands:brand_id(
            id,
            name,
            slug
          )
        `)
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const handleCreateModel = () => {
    setEditModel(null);
    setIsCreateModelOpen(true);
  };

  const handleEditModel = (model) => {
    setEditModel(model);
    setIsCreateModelOpen(true);
  };

  const handleDeleteModel = async (model) => {
    if (!confirm(`Are you sure you want to delete the ${model.name} model? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .delete()
        .eq('id', model.id);

      if (error) throw error;

      toast({
        title: "Model deleted",
        description: `${model.name} has been removed.`,
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete model. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateModelOpen(false);
    setEditModel(null);
    if (refreshData) {
      refetch();
    }
  };

  // Filter models based on search
  const filteredModels = models?.filter(model => {
    const brandName = Array.isArray(model.brands) && model.brands.length > 0 ? model.brands[0].name : '';
    const matchesSearch = !searchTerm || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
            <Input
              placeholder="Search models by name, type or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Models ({filteredModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredModels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Brand</TableHead>
                  <TableHead className="text-explorer-text">Model</TableHead>
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Production</TableHead>
                  <TableHead className="text-explorer-text">Status</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id} className="border-explorer-chrome/20">
                    <TableCell className="text-explorer-text">
                      {Array.isArray(model.brands) && model.brands.length > 0 ? model.brands[0].name : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/admin/models/${model.slug}`}
                        className="font-medium text-accent-teal hover:text-accent-teal/80"
                      >
                        {model.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-explorer-text">{model.type}</TableCell>
                    <TableCell className="text-explorer-text">
                      {model.production_start_year}-{model.production_end_year || 'Present'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${
                          model.production_status === 'active' 
                            ? 'bg-green-400/20 text-green-400 border-green-400/30' 
                            : 'bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30'
                        }`}
                      >
                        {model.production_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/admin/models/${model.slug}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            Manage
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditModel(model)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteModel(model)}
                          className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-explorer-text-muted">
                {searchTerm 
                  ? "No models match your search." 
                  : "No models found. Start by adding your first model."
                }
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateModel}
                  className="mt-4"
                >
                  Add Model
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdminModelDialog 
        open={isCreateModelOpen}
        model={editModel}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default ModelsTable;
