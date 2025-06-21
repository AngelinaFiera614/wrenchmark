
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brand } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddMotorcycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  onSuccess: () => void;
}

const AddMotorcycleDialog = ({ open, onOpenChange, brands, onSuccess }: AddMotorcycleDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    type: "",
    production_start_year: "",
    base_description: "",
    is_draft: true
  });

  const motorcycleTypes = [
    "Sport", "Cruiser", "Touring", "Adventure", "Naked", 
    "Standard", "Scooter", "Off-road", "Dual-sport"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand_id || !formData.type) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in name, brand, and type.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Generate slug from name
      const slug = formData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { error } = await supabase
        .from('motorcycle_models')
        .insert([{
          ...formData,
          slug,
          production_start_year: formData.production_start_year ? parseInt(formData.production_start_year) : null,
          production_status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Motorcycle Added",
        description: `${formData.name} has been created successfully.`
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        name: "",
        brand_id: "",
        type: "",
        production_start_year: "",
        base_description: "",
        is_draft: true
      });
    } catch (error) {
      console.error('Error adding motorcycle:', error);
      toast({
        title: "Error",
        description: "Failed to add motorcycle. Please try again.",
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
          <DialogTitle>Add New Motorcycle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Model Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Ninja 650"
              required
            />
          </div>

          <div>
            <Label htmlFor="brand">Brand *</Label>
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
            <Label htmlFor="type">Type *</Label>
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
            <Label htmlFor="year">Production Start Year</Label>
            <Input
              id="year"
              type="number"
              value={formData.production_start_year}
              onChange={(e) => setFormData({ ...formData, production_start_year: e.target.value })}
              placeholder="e.g., 2020"
              min="1900"
              max="2030"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.base_description}
              onChange={(e) => setFormData({ ...formData, base_description: e.target.value })}
              placeholder="Brief description of the motorcycle..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_draft"
              checked={formData.is_draft}
              onCheckedChange={(checked) => setFormData({ ...formData, is_draft: !!checked })}
            />
            <Label htmlFor="is_draft">Save as draft</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Motorcycle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMotorcycleDialog;
