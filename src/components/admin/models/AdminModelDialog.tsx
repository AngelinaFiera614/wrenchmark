
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ImageUpload from "@/components/admin/shared/ImageUpload";

const AdminModelDialog = ({ open, model, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    type: 'Standard',
    base_description: '',
    production_start_year: new Date().getFullYear(),
    production_end_year: null,
    production_status: 'active',
    default_image_url: '',
    model_history: '',
    production_notes: '',
    design_philosophy: '',
    target_market: ''
  });

  // Fetch brands for selection
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (model) {
      setFormData({
        brand_id: model.brand_id || '',
        name: model.name || '',
        type: model.type || 'Standard',
        base_description: model.base_description || '',
        production_start_year: model.production_start_year || new Date().getFullYear(),
        production_end_year: model.production_end_year || null,
        production_status: model.production_status || 'active',
        default_image_url: model.default_image_url || '',
        model_history: model.model_history || '',
        production_notes: model.production_notes || '',
        design_philosophy: model.design_philosophy || '',
        target_market: model.target_market || ''
      });
    } else {
      setFormData({
        brand_id: '',
        name: '',
        type: 'Standard',
        base_description: '',
        production_start_year: new Date().getFullYear(),
        production_end_year: null,
        production_status: 'active',
        default_image_url: '',
        model_history: '',
        production_notes: '',
        design_philosophy: '',
        target_market: ''
      });
    }
  }, [model]);

  const generateSlug = () => {
    if (formData.brand_id && formData.name && brands) {
      const brand = brands.find(b => b.id === formData.brand_id);
      if (brand) {
        return `${brand.name.toLowerCase().replace(/\s+/g, "-")}-${formData.name.toLowerCase().replace(/\s+/g, "-")}`;
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug();
      const dataToSubmit = {
        ...formData,
        slug,
        production_end_year: formData.production_end_year || null
      };

      if (model) {
        // Update existing model
        const { error } = await supabase
          .from('motorcycle_models')
          .update(dataToSubmit)
          .eq('id', model.id);

        if (error) throw error;

        toast({
          title: "Model updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Create new model
        const { error } = await supabase
          .from('motorcycle_models')
          .insert([dataToSubmit]);

        if (error) throw error;

        toast({
          title: "Model created",
          description: `${formData.name} has been created successfully.`,
        });
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save model. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {model ? "Edit Motorcycle Model" : "Add New Motorcycle Model"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand_id">Brand *</Label>
              <Select value={formData.brand_id} onValueChange={(value) => handleInputChange('brand_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Model Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Panigale V4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Sport">Sport</SelectItem>
                  <SelectItem value="Cruiser">Cruiser</SelectItem>
                  <SelectItem value="Touring">Touring</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Dirt">Dirt</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="production_status">Status</Label>
              <Select value={formData.production_status} onValueChange={(value) => handleInputChange('production_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                  <SelectItem value="concept">Concept</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="production_start_year">Production Start Year</Label>
              <Input
                id="production_start_year"
                type="number"
                value={formData.production_start_year}
                onChange={(e) => handleInputChange('production_start_year', parseInt(e.target.value))}
                min="1885"
                max="2030"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="production_end_year">Production End Year</Label>
              <Input
                id="production_end_year"
                type="number"
                value={formData.production_end_year || ''}
                onChange={(e) => handleInputChange('production_end_year', e.target.value ? parseInt(e.target.value) : null)}
                min="1885"
                max="2030"
                placeholder="Leave empty if still in production"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_description">Description</Label>
            <Textarea
              id="base_description"
              value={formData.base_description}
              onChange={(e) => handleInputChange('base_description', e.target.value)}
              placeholder="Brief description of the motorcycle model"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Default Image</Label>
            <ImageUpload
              bucketName="motorcycles"
              folderPath={`models/${generateSlug()}`}
              value={formData.default_image_url}
              onChange={(url) => handleInputChange('default_image_url', url)}
              previewHeight={200}
              previewWidth={300}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historical Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="model_history">Model History</Label>
              <Textarea
                id="model_history"
                value={formData.model_history}
                onChange={(e) => handleInputChange('model_history', e.target.value)}
                placeholder="Historical background and evolution of the model"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="design_philosophy">Design Philosophy</Label>
              <Textarea
                id="design_philosophy"
                value={formData.design_philosophy}
                onChange={(e) => handleInputChange('design_philosophy', e.target.value)}
                placeholder="Design principles and philosophy behind the model"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_market">Target Market</Label>
              <Input
                id="target_market"
                value={formData.target_market}
                onChange={(e) => handleInputChange('target_market', e.target.value)}
                placeholder="e.g., Sport riders, commuters, touring enthusiasts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="production_notes">Production Notes</Label>
              <Textarea
                id="production_notes"
                value={formData.production_notes}
                onChange={(e) => handleInputChange('production_notes', e.target.value)}
                placeholder="Notes about production, manufacturing, or special details"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onClose(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-accent-teal text-black hover:bg-accent-teal/80">
              {loading ? "Saving..." : model ? "Update Model" : "Create Model"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModelDialog;
