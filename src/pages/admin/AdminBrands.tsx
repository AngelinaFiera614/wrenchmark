
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Grid, List, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import AdminBrandDialog from "@/components/admin/brands/AdminBrandDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const AdminBrands = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Fetch brands data
  const { data: brands, isLoading, refetch } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data as Brand[];
    }
  });

  const handleAddBrand = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditBrand(brand);
  };

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandToDelete.id);

      if (error) throw error;

      toast({
        title: "Brand deleted",
        description: `${brandToDelete.name} has been removed.`,
      });

      refetch();
      setIsDeleteConfirmOpen(false);
      setBrandToDelete(null);
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete brand. It may have associated motorcycles.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateDialogOpen(false);
    setEditBrand(null);
    if (refreshData) {
      refetch();
    }
  };

  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands?.map((brand) => (
          <Card key={brand.id} className="overflow-hidden hover:border-accent-teal/50 transition-colors">
            <div className="h-32 flex items-center justify-center bg-black p-4">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-800 text-gray-400">
                  No Logo
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{brand.name}</h3>
              <p className="text-sm text-muted-foreground">{brand.country || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">Founded: {brand.founded || 'Unknown'}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {brand.known_for?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {brand.known_for && brand.known_for.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{brand.known_for.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditBrand(brand)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteClick(brand)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Country</TableHead>
              <TableHead className="hidden md:table-cell">Founded</TableHead>
              <TableHead className="hidden lg:table-cell">Known For</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands?.map((brand) => (
              <TableRow key={brand.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="h-10 w-10 bg-black rounded overflow-hidden">
                    <img 
                      src={brand.logo_url || '/placeholder.svg'} 
                      alt={brand.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell className="hidden md:table-cell">{brand.country || 'Unknown'}</TableCell>
                <TableCell className="hidden md:table-cell">{brand.founded || 'Unknown'}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {brand.known_for?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {brand.known_for && brand.known_for.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{brand.known_for.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Desktop Actions */}
                    <div className="hidden md:flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditBrand(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(brand)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(brand)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-muted-foreground">
            Manage motorcycle brands. Add new manufacturers, update information, or remove brands.
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs 
            value={viewMode} 
            onValueChange={(val) => setViewMode(val as "table" | "card")}
            className="hidden sm:flex"
          >
            <TabsList className="bg-background border">
              <TabsTrigger value="table" className="data-[state=active]:bg-muted">
                <List className="h-4 w-4 mr-1" /> Table
              </TabsTrigger>
              <TabsTrigger value="card" className="data-[state=active]:bg-muted">
                <Grid className="h-4 w-4 mr-1" /> Cards
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
            onClick={handleAddBrand}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : brands && brands.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile view toggle */}
          <div className="sm:hidden flex justify-end mb-4">
            <Tabs 
              value={viewMode} 
              onValueChange={(val) => setViewMode(val as "table" | "card")}
            >
              <TabsList className="bg-background border">
                <TabsTrigger value="table" className="data-[state=active]:bg-muted">
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="card" className="data-[state=active]:bg-muted">
                  <Grid className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "table" ? renderTableView() : renderCardView()}
        </div>
      ) : (
        <div className="border rounded-md p-12 text-center">
          <h3 className="text-lg font-medium">No brands found</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Add your first motorcycle brand to get started.
          </p>
          <Button 
            onClick={handleAddBrand}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <AdminBrandDialog
        open={isCreateDialogOpen || editBrand !== null}
        brand={editBrand}
        onClose={handleDialogClose}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              brand <strong>{brandToDelete?.name}</strong> and may affect motorcycles
              associated with this brand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBrands;
