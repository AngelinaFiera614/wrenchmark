
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Accessory } from "@/types/accessories";
import { MotorcycleModel, Configuration } from "@/types/motorcycle";
import { 
  getCompatibleAccessories,
  addAccessoryCompatibility,
  removeAccessoryCompatibility,
  getAllAccessories 
} from "@/services/accessoryService";
import { getMotorcycleModelBySlug } from "@/services/modelService";

interface AccessoryCompatibilityManagerProps {
  configurationId: string;
  modelSlug: string;
}

export function AccessoryCompatibilityManager({
  configurationId,
  modelSlug
}: AccessoryCompatibilityManagerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch the model data
  const { data: model, isLoading: modelLoading } = useQuery({
    queryKey: ["model", modelSlug],
    queryFn: () => getMotorcycleModelBySlug(modelSlug),
    enabled: !!modelSlug
  });

  // Fetch compatible accessories
  const { 
    data: compatibleAccessories, 
    isLoading: compatibleLoading,
    refetch: refetchCompatible 
  } = useQuery({
    queryKey: ["compatible-accessories", configurationId],
    queryFn: () => getCompatibleAccessories(configurationId),
    enabled: !!configurationId
  });

  // Fetch all accessories for the dialog
  const { 
    data: allAccessories, 
    isLoading: accessoriesLoading 
  } = useQuery({
    queryKey: ["accessories"],
    queryFn: getAllAccessories,
    enabled: open
  });

  // Initialize selected accessories when dialog opens
  useEffect(() => {
    if (open && compatibleAccessories) {
      setSelectedAccessories(compatibleAccessories.map(a => a.id));
    }
  }, [open, compatibleAccessories]);

  // Filter accessories based on search query
  const filteredAccessories = allAccessories?.filter(accessory => {
    const query = searchQuery.toLowerCase();
    return (
      accessory.name.toLowerCase().includes(query) ||
      accessory.category.toLowerCase().includes(query) ||
      (accessory.manufacturer && accessory.manufacturer.toLowerCase().includes(query))
    );
  });

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleSaveCompatibility = async () => {
    if (!compatibleAccessories) return;
    
    const currentIds = compatibleAccessories.map(a => a.id);
    const toAdd = selectedAccessories.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !selectedAccessories.includes(id));
    
    setSaving(true);
    try {
      // Add new compatibilities
      for (const accessoryId of toAdd) {
        await addAccessoryCompatibility(accessoryId, configurationId);
      }
      
      // Remove compatibilities
      for (const accessoryId of toRemove) {
        await removeAccessoryCompatibility(accessoryId, configurationId);
      }
      
      toast.success("Accessory compatibility updated");
      await refetchCompatible();
      setOpen(false);
    } catch (error) {
      console.error("Error updating accessory compatibility:", error);
      toast.error("Failed to update accessory compatibility");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAccessory = (accessoryId: string) => {
    setSelectedAccessories(prev => {
      if (prev.includes(accessoryId)) {
        return prev.filter(id => id !== accessoryId);
      } else {
        return [...prev, accessoryId];
      }
    });
  };

  const getConfiguration = (configId: string): Configuration | undefined => {
    if (!model?.years) return undefined;
    
    for (const year of model.years) {
      if (!year.configurations) continue;
      const config = year.configurations.find(c => c.id === configId);
      if (config) return config;
    }
    
    return undefined;
  };

  const configuration = getConfiguration(configurationId);

  if (modelLoading || compatibleLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-accent-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Compatible Accessories</h3>
        <Button 
          onClick={handleOpenDialog}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Manage Accessories
        </Button>
      </div>

      {compatibleAccessories && compatibleAccessories.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compatibleAccessories.map((accessory) => (
                <TableRow key={accessory.id}>
                  <TableCell className="font-medium">{accessory.name}</TableCell>
                  <TableCell>{accessory.category}</TableCell>
                  <TableCell>{accessory.manufacturer || "N/A"}</TableCell>
                  <TableCell>
                    {accessory.price_usd ? `$${accessory.price_usd}` : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No compatible accessories found for this configuration.
          </p>
          <Button 
            variant="link" 
            onClick={handleOpenDialog}
            className="mt-2 text-accent-teal"
          >
            Add Compatible Accessories
          </Button>
        </div>
      )}

      {/* Accessory Selection Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Manage Compatible Accessories
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Select accessories that are compatible with: <br />
              <span className="font-semibold">
                {model?.name} {configuration?.name ? `- ${configuration.name}` : ""}
              </span>
            </p>

            <div className="mb-4">
              <Input
                placeholder="Search accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
            </div>

            {accessoriesLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-accent-teal" />
              </div>
            ) : filteredAccessories && filteredAccessories.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccessories.map((accessory) => (
                      <TableRow key={accessory.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedAccessories.includes(accessory.id)}
                            onCheckedChange={() => handleToggleAccessory(accessory.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{accessory.name}</TableCell>
                        <TableCell>{accessory.category}</TableCell>
                        <TableCell>{accessory.manufacturer || "N/A"}</TableCell>
                        <TableCell>
                          {accessory.price_usd ? `$${accessory.price_usd}` : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  No accessories found matching your search.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompatibility} disabled={saving || accessoriesLoading}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
