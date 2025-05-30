
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
    is_draft: false,
    category: 'Standard',
    engine_size: null,
    horsepower: null,
    torque_nm: null,
    weight_kg: null,
    seat_height_mm: null,
    wheelbase_mm: null,
    ground_clearance_mm: null,
    fuel_capacity_l: null,
    top_speed_kph: null,
    has_abs: false,
    difficulty_level: 3,
    summary: ''
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
        is_draft: model.is_draft || false,
        category: model.category || model.type || 'Standard',
        engine_size: model.engine_size || null,
        horsepower: model.horsepower || null,
        torque_nm: model.torque_nm || null,
        weight_kg: model.weight_kg || null,
        seat_height_mm: model.seat_height_mm || null,
        wheelbase_mm: model.wheelbase_mm || null,
        ground_clearance_mm: model.ground_clearance_mm || null,
        fuel_capacity_l: model.fuel_capacity_l || null,
        top_speed_kph: model.top_speed_kph || null,
        has_abs: model.has_abs || false,
        difficulty_level: model.difficulty_level || 3,
        summary: model.summary || model.base_description || ''
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
        is_draft: false,
        category: 'Standard',
        engine_size: null,
        horsepower: null,
        torque_nm: null,
        weight_kg: null,
        seat_height_mm: null,
        wheelbase_mm: null,
        ground_clearance_mm: null,
        fuel_capacity_l: null,
        top_speed_kph: null,
        has_abs: false,
        difficulty_level: 3,
        summary: ''
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
        production_end_year: formData.production_end_year || null,
        engine_size: formData.engine_size ? Number(formData.engine_size) : null,
        horsepower: formData.horsepower ? Number(formData.horsepower) : null,
        torque_nm: formData.torque_nm ? Number(formData.torque_nm) : null,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        seat_height_mm: formData.seat_height_mm ? Number(formData.seat_height_mm) : null,
        wheelbase_mm: formData.wheelbase_mm ? Number(formData.wheelbase_mm) : null,
        ground_clearance_mm: formData.ground_clearance_mm ? Number(formData.ground_clearance_mm) : null,
        fuel_capacity_l: formData.fuel_capacity_l ? Number(formData.fuel_capacity_l) : null,
        top_speed_kph: formData.top_speed_kph ? Number(formData.top_speed_kph) : null,
        difficulty_level: Number(formData.difficulty_level)
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
        description: `Failed to save model: ${error.message}`,
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

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine_size">Engine Size (cc)</Label>
                <Input
                  id="engine_size"
                  type="number"
                  value={formData.engine_size || ''}
                  onChange={(e) => handleInputChange('engine_size', e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horsepower">Horsepower (hp)</Label>
                <Input
                  id="horsepower"
                  type="number"
                  value={formData.horsepower || ''}
                  onChange={(e) => handleInputChange('horsepower', e.target.value)}
                  placeholder="e.g., 150"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight_kg">Weight (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  value={formData.weight_kg || ''}
                  onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                  placeholder="e.g., 180"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seat_height_mm">Seat Height (mm)</Label>
                <Input
                  id="seat_height_mm"
                  type="number"
                  value={formData.seat_height_mm || ''}
                  onChange={(e) => handleInputChange('seat_height_mm', e.target.value)}
                  placeholder="e.g., 800"
                />
              </div>
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
            <Label htmlFor="default_image_url">Image URL</Label>
            <Input
              id="default_image_url"
              value={formData.default_image_url}
              onChange={(e) => handleInputChange('default_image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
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
