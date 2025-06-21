
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brand, Motorcycle } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditMotorcycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorcycle: Motorcycle | null;
  brands: Brand[];
  onSuccess: () => void;
}

const EditMotorcycleDialog = ({ open, onOpenChange, motorcycle, brands, onSuccess }: EditMotorcycleDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    type: "",
    production_start_year: "",
    base_description: "",
    is_draft: false
  });

  const motorcycleTypes = [
    "Sport", "Cruiser", "Touring", "Adventure", "Naked", 
    "Standard", "Scooter", "Off-road", "Dual-sport"
  ];

  // Populate form when motorcycle changes
  useEffect(() => {
    if (motorcycle) {
      setFormData({
        name: motorcycle.name || "",
        brand_id: motorcycle.brand_id || "",
        type: motorcycle.type || "",
        production_start_year: motorcycle.production_start_year?.toString() || "",
        base_description: motorcycle.base_description || "",
        is_draft: motorcycle.is_draft || false
      });
    }
  }, [motorcycle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motorcycle || !formData.name || !formData.brand_id || !formData.type) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in name, brand, and type.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({
          name: formData.name,
          brand_id: formData.brand_id,
          type: formData.type,
          production_start_year: formData.production_start_year ? parseInt(formData.production_start_year) : null,
          base_description: formData.base_description,
          is_draft: formData.is_draft,
          updated_at: new Date().toISOString()
        })
        .eq('id', motorcycle.id);

      if (error) throw error;

      toast({
        title: "Motorcycle Updated",
        description: `${formData.name} has been updated successfully.`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating motorcycle:', error);
      toast({
        title: "Error",
        description: "Failed to update motorcycle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Motorcycle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Model Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Ninja 650"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-brand">Brand *</Label>
            <Select value={formData.brand_id} onValueChange={(value) => setFormData({ ...formData, brand_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {motorcycleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-year">Production Start Year</Label>
            <Input
              id="edit-year"
              type="number"
              value={formData.production_start_year}
              onChange={(e) => setFormData({ ...formData, production_start_year: e.target.value })}
              placeholder="e.g., 2020"
              min="1900"
              max="2030"
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.base_description}
              onChange={(e) => setFormData({ ...formData, base_description: e.target.value })}
              placeholder="Brief description of the motorcycle..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-is_draft"
              checked={formData.is_draft}
              onCheckedChange={(checked) => setFormData({ ...formData, is_draft: !!checked })}
            />
            <Label htmlFor="edit-is_draft">Save as draft</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Motorcycle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMotorcycleDialog;
