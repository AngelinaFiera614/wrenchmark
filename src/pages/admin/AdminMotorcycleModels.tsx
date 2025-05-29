
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, FileText, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { publishMotorcycle, unpublishMotorcycle } from "@/services/motorcycleService";
import { supabase } from "@/integrations/supabase/client";
import AdminMotorcycleDialog from "@/components/admin/motorcycles/AdminMotorcycleDialog";
import { Motorcycle } from "@/types";
import { fetchAllMotorcyclesForAdmin } from "@/services/motorcycles/motorcycleQueries";
import { transformMotorcycleData } from "@/services/motorcycles/motorcycleTransforms";

const AdminMotorcycleModels = () => {
  const { toast } = useToast();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [editModel, setEditModel] = useState<Motorcycle | null>(null);

  // Fetch motorcycle models with admin permissions and proper error handling
  const { data: models, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-motorcycle-models"],
    queryFn: async () => {
      try {
        console.log("Admin: Starting to fetch motorcycle models...");
        const rawData = await fetchAllMotorcyclesForAdmin();
        console.log("Admin: Raw data received:", rawData?.length);
        
        // Transform the raw data to match the Motorcycle interface
        const transformedData = rawData.map(transformMotorcycleData);
        console.log("Admin: Successfully transformed models:", transformedData?.length);
        
        return transformedData;
      } catch (error) {
        console.error("Admin: Error fetching motorcycle models:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load motorcycle models. Please check your admin permissions.",
        });
        throw error;
      }
    }
  });

  const handleCreateModel = () => {
    setEditModel(null);
    setIsCreateModelOpen(true);
  };

  const handleEditModel = (model: Motorcycle) => {
    setEditModel(model);
    setIsCreateModelOpen(true);
  };

  const handleTogglePublishStatus = async (motorcycle: Motorcycle) => {
    try {
      const success = motorcycle.is_draft 
        ? await publishMotorcycle(motorcycle.id)
        : await unpublishMotorcycle(motorcycle.id);

      if (success) {
        toast({
          title: motorcycle.is_draft ? "Motorcycle Published" : "Motorcycle Unpublished",
          description: `${motorcycle.make} ${motorcycle.model} has been ${motorcycle.is_draft ? 'published' : 'moved to drafts'}.`,
        });
        refetch();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update motorcycle status. Please try again.",
      });
    }
  };

  const handleDeleteModel = async (model: Motorcycle) => {
    if (!confirm(`Are you sure you want to delete ${model.make} ${model.model}? This action cannot be undone.`)) {
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
        description: `${model.make} ${model.model} has been removed.`,
      });

      refetch();
    } catch (error) {
      console.error("Error deleting model:", error);
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Motorcycles</h1>
            <p className="text-muted-foreground mt-1">
              Manage motorcycle models with detailed specifications.
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-destructive font-medium">
                Failed to load motorcycle models
              </div>
              <div className="text-muted-foreground">
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

  const publishedModels = models?.filter(m => !m.is_draft) || [];
  const draftModels = models?.filter(m => m.is_draft) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Motorcycles</h1>
          <p className="text-muted-foreground mt-1">
            Manage motorcycle models with detailed specifications.
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={handleCreateModel}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      {/* Summary Stats */}
      {models && models.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{models.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedModels.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{draftModels.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {models.filter(m => m.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Models List */}
      {models && models.length > 0 ? (
        <div className="space-y-6">
          {/* Draft Models Section */}
          {draftModels.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-orange-600" />
                Draft Models ({draftModels.length})
              </h2>
              <div className="grid gap-4">
                {draftModels.map((motorcycle) => (
                  <Card key={motorcycle.id} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <FileText className="mr-1 h-3 w-3" />
                            Draft
                          </Badge>
                          <div>
                            <h3 className="font-medium">{motorcycle.make} {motorcycle.model}</h3>
                            <p className="text-sm text-muted-foreground">
                              {motorcycle.year} • {motorcycle.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublishStatus(motorcycle)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Publish
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditModel(motorcycle)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteModel(motorcycle)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Published Models Section */}
          {publishedModels.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="mr-2 h-5 w-5 text-green-600" />
                Published Models ({publishedModels.length})
              </h2>
              <div className="grid gap-4">
                {publishedModels.map((motorcycle) => (
                  <Card key={motorcycle.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Eye className="mr-1 h-3 w-3" />
                            Published
                          </Badge>
                          <div>
                            <h3 className="font-medium">{motorcycle.make} {motorcycle.model}</h3>
                            <p className="text-sm text-muted-foreground">
                              {motorcycle.year} • {motorcycle.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublishStatus(motorcycle)}
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            Unpublish
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditModel(motorcycle)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteModel(motorcycle)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                No motorcycle models found. Start by adding your first model.
              </div>
              <Button variant="outline" onClick={handleCreateModel}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <AdminMotorcycleDialog 
        open={isCreateModelOpen}
        motorcycle={editModel}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminMotorcycleModels;
