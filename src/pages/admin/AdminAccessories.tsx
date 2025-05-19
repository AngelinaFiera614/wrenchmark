
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllAccessories, deleteAccessory } from "@/services/accessoryService";
import { AccessoryDialog } from "@/components/admin/accessories/AccessoryDialog";
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
import { Accessory } from "@/types/accessories";

export default function AdminAccessories() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const [accessoryDialogOpen, setAccessoryDialogOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | undefined>();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accessoryToDelete, setAccessoryToDelete] = useState<Accessory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    data: accessories, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["accessories", debouncedSearch],
    queryFn: getAllAccessories
  });

  const filteredAccessories = accessories?.filter(accessory => {
    if (!debouncedSearch) return true;
    
    const query = debouncedSearch.toLowerCase();
    return (
      accessory.name.toLowerCase().includes(query) ||
      accessory.category.toLowerCase().includes(query) ||
      (accessory.manufacturer && accessory.manufacturer.toLowerCase().includes(query))
    );
  });

  const handleAddNew = () => {
    setSelectedAccessory(undefined);
    setAccessoryDialogOpen(true);
  };

  const handleEdit = (accessory: Accessory) => {
    setSelectedAccessory(accessory);
    setAccessoryDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!accessoryToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteAccessory(accessoryToDelete.id);
      if (success) {
        toast.success("Accessory deleted successfully");
        refetch();
      } else {
        toast.error("Failed to delete accessory");
      }
    } catch (error) {
      console.error("Error deleting accessory:", error);
      toast.error("An error occurred while deleting the accessory");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setAccessoryToDelete(null);
    }
  };

  const confirmDelete = (accessory: Accessory) => {
    setAccessoryToDelete(accessory);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Motorcycle Accessories</h1>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={handleAddNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Accessory
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search accessories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : filteredAccessories && filteredAccessories.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccessories.map((accessory) => (
                <TableRow key={accessory.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {accessory.image_url && (
                      <img 
                        src={accessory.image_url} 
                        alt={accessory.name} 
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    {accessory.name}
                  </TableCell>
                  <TableCell>{accessory.category}</TableCell>
                  <TableCell>{accessory.manufacturer || "N/A"}</TableCell>
                  <TableCell>
                    {accessory.price_usd ? `$${accessory.price_usd}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(accessory)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => confirmDelete(accessory)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">
            {debouncedSearch 
              ? "No accessories found matching your search." 
              : "No accessories found. Add your first accessory to get started."}
          </p>
        </div>
      )}
      
      {/* Accessory Dialog */}
      <AccessoryDialog
        open={accessoryDialogOpen}
        onClose={() => setAccessoryDialogOpen(false)}
        accessory={selectedAccessory}
        onSaved={refetch}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the accessory
              "{accessoryToDelete?.name}" and remove all its compatibility relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
