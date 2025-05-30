
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter, Eye, FileText, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminModelDialog from "@/components/admin/models/AdminModelDialog";

const AdminModels = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch motorcycle models with brand information
  const { data: models, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-motorcycle-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          *,
          brands!inner (
            id,
            name
          )
        `)
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch brands for filter dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands-for-filter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
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
    if (!confirm(`Are you sure you want to delete ${model.brands?.name} ${model.name}? This action cannot be undone.`)) {
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
        description: `${model.brands?.name} ${model.name} has been removed.`,
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

  const handleTogglePublishStatus = async (model) => {
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: !model.is_draft })
        .eq('id', model.id);

      if (error) throw error;

      toast({
        title: model.is_draft ? "Model Published" : "Model Unpublished",
        description: `${model.brands?.name} ${model.name} has been ${model.is_draft ? 'published' : 'moved to drafts'}.`,
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model status. Please try again.",
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

  // Filter models based on search and filters
  const filteredModels = models?.filter(model => {
    const matchesSearch = !searchTerm || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.brands?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = selectedBrand === "all" || model.brand_id === selectedBrand;
    
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "draft" && model.is_draft) ||
      (selectedStatus === "published" && !model.is_draft);

    return matchesSearch && matchesBrand && matchesStatus;
  }) || [];

  const publishedCount = models?.filter(m => !m.is_draft).length || 0;
  const draftCount = models?.filter(m => m.is_draft).length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Models</h1>
            <p className="text-explorer-text-muted mt-1">
              Manage motorcycle models with detailed specifications.
            </p>
          </div>
        </div>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-red-400 font-medium">
                Failed to load motorcycle models
              </div>
              <div className="text-explorer-text-muted">
                There was an error loading the motorcycle data. Please check your admin permissions and try again.
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Models</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage motorcycle models with detailed specifications and configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateModel}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{models?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{publishedCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{draftCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {new Set(models?.map(m => m.brand_id)).size || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
                <Input
                  placeholder="Search models or brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                />
              </div>
            </div>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full md:w-48 bg-explorer-dark border-explorer-chrome/30">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48 bg-explorer-dark border-explorer-chrome/30">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Models ({filteredModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredModels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Model</TableHead>
                  <TableHead className="text-explorer-text">Brand</TableHead>
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Years</TableHead>
                  <TableHead className="text-explorer-text">Status</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id} className="border-explorer-chrome/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {model.default_image_url && (
                          <img 
                            src={model.default_image_url} 
                            alt={model.name}
                            className="w-12 h-8 object-cover rounded border border-explorer-chrome/30"
                          />
                        )}
                        <div>
                          <div className="font-medium text-explorer-text">{model.name}</div>
                          <div className="text-sm text-explorer-text-muted">{model.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-explorer-text">{model.brands?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-explorer-chrome/20 text-explorer-text border-explorer-chrome/30">
                        {model.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {model.production_start_year}
                      {model.production_end_year && ` - ${model.production_end_year}`}
                    </TableCell>
                    <TableCell>
                      {model.is_draft ? (
                        <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <FileText className="mr-1 h-3 w-3" />
                          Draft
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Eye className="mr-1 h-3 w-3" />
                          Published
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublishStatus(model)}
                          className="h-8 px-2 text-xs"
                        >
                          {model.is_draft ? (
                            <>
                              <Eye className="mr-1 h-3 w-3" />
                              Publish
                            </>
                          ) : (
                            <>
                              <FileText className="mr-1 h-3 w-3" />
                              Unpublish
                            </>
                          )}
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
                {searchTerm || selectedBrand !== "all" || selectedStatus !== "all" 
                  ? "No models match your current filters." 
                  : "No motorcycle models found. Start by adding your first model."
                }
              </div>
              {!searchTerm && selectedBrand === "all" && selectedStatus === "all" && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateModel}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
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

export default AdminModels;
