
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ImageUpload from "@/components/admin/shared/ImageUpload";

const AdminConfigurationDialog = ({ open, modelYear, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Standard',
    engine_id: '',
    brake_system_id: '',
    frame_id: '',
    suspension_id: '',
    wheel_id: '',
    color_id: '',
    seat_height_mm: '',
    weight_kg: '',
    wheelbase_mm: '',
    fuel_capacity_l: '',
    ground_clearance_mm: '',
    market_region: '',
    trim_level: '',
    special_features: [],
    optional_equipment: [],
    price_premium_usd: '',
    image_url: '',
    is_default: false
  });

  // Fetch components for dropdowns
  const { data: engines } = useQuery({
    queryKey: ["engines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engines')
        .select('id, name, displacement_cc, power_hp')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: brakes } = useQuery({
    queryKey: ["brake_systems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brake_systems')
        .select('id, type')
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: frames } = useQuery({
    queryKey: ["frames"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('frames')
        .select('id, type, material')
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: suspensions } = useQuery({
    queryKey: ["suspensions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suspensions')
        .select('id, front_type, rear_type, brand')
        .order('brand');
      if (error) throw error;
      return data;
    }
  });

  const { data: wheels } = useQuery({
    queryKey: ["wheels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wheels')
        .select('id, type, front_size, rear_size')
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: colors } = useQuery({
    queryKey: ["color_options", modelYear?.id],
    queryFn: async () => {
      if (!modelYear?.id) return [];
      const { data, error } = await supabase
        .from('color_options')
        .select('id, name, hex_code')
        .eq('model_year_id', modelYear.id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!modelYear?.id
  });

  useEffect(() => {
    if (open && !modelYear) {
      // Reset form
      setFormData({
        name: 'Standard',
        engine_id: '',
        brake_system_id: '',
        frame_id: '',
        suspension_id: '',
        wheel_id: '',
        color_id: '',
        seat_height_mm: '',
        weight_kg: '',
        wheelbase_mm: '',
        fuel_capacity_l: '',
        ground_clearance_mm: '',
        market_region: '',
        trim_level: '',
        special_features: [],
        optional_equipment: [],
        price_premium_usd: '',
        image_url: '',
        is_default: false
      });
    }
  }, [open, modelYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelYear) return;

    setLoading(true);

    try {
      const dataToSubmit = {
        model_year_id: modelYear.id,
        name: formData.name,
        engine_id: formData.engine_id || null,
        brake_system_id: formData.brake_system_id || null,
        frame_id: formData.frame_id || null,
        suspension_id: formData.suspension_id || null,
        wheel_id: formData.wheel_id || null,
        color_id: formData.color_id || null,
        seat_height_mm: formData.seat_height_mm ? parseInt(formData.seat_height_mm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        wheelbase_mm: formData.wheelbase_mm ? parseInt(formData.wheelbase_mm) : null,
        fuel_capacity_l: formData.fuel_capacity_l ? parseFloat(formData.fuel_capacity_l) : null,
        ground_clearance_mm: formData.ground_clearance_mm ? parseInt(formData.ground_clearance_mm) : null,
        market_region: formData.market_region || null,
        trim_level: formData.trim_level || null,
        special_features: formData.special_features.length > 0 ? formData.special_features : null,
        optional_equipment: formData.optional_equipment.length > 0 ? formData.optional_equipment : null,
        price_premium_usd: formData.price_premium_usd ? parseFloat(formData.price_premium_usd) : null,
        image_url: formData.image_url || null,
        is_default: formData.is_default
      };

      const { error } = await supabase
        .from('model_configurations')
        .insert([dataToSubmit]);

      if (error) throw error;

      toast({
        title: "Configuration added",
        description: `${formData.name} configuration has been added successfully.`,
      });

      onClose(true);
    } catch (error) {
      console.error("Error creating configuration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add configuration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  if (!modelYear) return null;

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add Configuration for {modelYear.year} {modelYear.motorcycle?.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Configuration Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Standard, S, Base, Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim_level">Trim Level</Label>
              <Input
                id="trim_level"
                value={formData.trim_level}
                onChange={(e) => handleInputChange('trim_level', e.target.value)}
                placeholder="e.g., Base, Sport, Touring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market_region">Market Region</Label>
              <Input
                id="market_region"
                value={formData.market_region}
                onChange={(e) => handleInputChange('market_region', e.target.value)}
                placeholder="e.g., North America, Europe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_premium_usd">Price Premium (USD)</Label>
              <Input
                id="price_premium_usd"
                type="number"
                step="0.01"
                value={formData.price_premium_usd}
                onChange={(e) => handleInputChange('price_premium_usd', e.target.value)}
                placeholder="Additional cost over base"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => handleInputChange('is_default', checked)}
            />
            <Label htmlFor="is_default">Default Configuration</Label>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Components</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine_id">Engine</Label>
                <Select value={formData.engine_id} onValueChange={(value) => handleInputChange('engine_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {engines?.map((engine) => (
                      <SelectItem key={engine.id} value={engine.id}>
                        {engine.name} ({engine.displacement_cc}cc, {engine.power_hp}hp)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brake_system_id">Brake System</Label>
                <Select value={formData.brake_system_id} onValueChange={(value) => handleInputChange('brake_system_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brake system" />
                  </SelectTrigger>
                  <SelectContent>
                    {brakes?.map((brake) => (
                      <SelectItem key={brake.id} value={brake.id}>
                        {brake.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frame_id">Frame</Label>
                <Select value={formData.frame_id} onValueChange={(value) => handleInputChange('frame_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frame" />
                  </SelectTrigger>
                  <SelectContent>
                    {frames?.map((frame) => (
                      <SelectItem key={frame.id} value={frame.id}>
                        {frame.type} ({frame.material})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suspension_id">Suspension</Label>
                <Select value={formData.suspension_id} onValueChange={(value) => handleInputChange('suspension_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select suspension" />
                  </SelectTrigger>
                  <SelectContent>
                    {suspensions?.map((suspension) => (
                      <SelectItem key={suspension.id} value={suspension.id}>
                        {suspension.brand} ({suspension.front_type} / {suspension.rear_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wheel_id">Wheels</Label>
                <Select value={formData.wheel_id} onValueChange={(value) => handleInputChange('wheel_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wheels" />
                  </SelectTrigger>
                  <SelectContent>
                    {wheels?.map((wheel) => (
                      <SelectItem key={wheel.id} value={wheel.id}>
                        {wheel.type} ({wheel.front_size} / {wheel.rear_size})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color_id">Color Option</Label>
                <Select value={formData.color_id} onValueChange={(value) => handleInputChange('color_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors?.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Physical Specifications</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seat_height_mm">Seat Height (mm)</Label>
                <Input
                  id="seat_height_mm"
                  type="number"
                  value={formData.seat_height_mm}
                  onChange={(e) => handleInputChange('seat_height_mm', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight_kg">Weight (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wheelbase_mm">Wheelbase (mm)</Label>
                <Input
                  id="wheelbase_mm"
                  type="number"
                  value={formData.wheelbase_mm}
                  onChange={(e) => handleInputChange('wheelbase_mm', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_capacity_l">Fuel Capacity (L)</Label>
                <Input
                  id="fuel_capacity_l"
                  type="number"
                  step="0.1"
                  value={formData.fuel_capacity_l}
                  onChange={(e) => handleInputChange('fuel_capacity_l', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ground_clearance_mm">Ground Clearance (mm)</Label>
                <Input
                  id="ground_clearance_mm"
                  type="number"
                  value={formData.ground_clearance_mm}
                  onChange={(e) => handleInputChange('ground_clearance_mm', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="special_features">Special Features</Label>
              <Input
                id="special_features"
                value={formData.special_features.join(', ')}
                onChange={(e) => handleArrayInputChange('special_features', e.target.value)}
                placeholder="e.g., Traction Control, Quickshifter (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optional_equipment">Optional Equipment</Label>
              <Input
                id="optional_equipment"
                value={formData.optional_equipment.join(', ')}
                onChange={(e) => handleArrayInputChange('optional_equipment', e.target.value)}
                placeholder="e.g., Heated Grips, Cruise Control (comma-separated)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Configuration Image</Label>
            <ImageUpload
              bucketName="motorcycles"
              folderPath={`configurations/${modelYear.motorcycle?.slug}/${modelYear.year}/${formData.name.toLowerCase()}`}
              value={formData.image_url}
              onChange={(url) => handleInputChange('image_url', url)}
              previewHeight={200}
              previewWidth={300}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onClose(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-accent-teal text-black hover:bg-accent-teal/80">
              {loading ? "Adding..." : "Add Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminConfigurationDialog;
