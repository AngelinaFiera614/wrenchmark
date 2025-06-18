
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ColorOptionDialogProps {
  open: boolean;
  color?: any;
  onClose: (refresh?: boolean) => void;
}

interface ModelYear {
  id: string;
  year: number;
  motorcycle_models: {
    name: string;
    brands: {
      name: string;
    } | null;
  } | null;
}

const ColorOptionDialog = ({ open, color, onClose }: ColorOptionDialogProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hex_code: "",
    image_url: "",
    is_limited: false,
    model_year_id: ""
  });

  const isEditing = !!color;

  // Fetch model years for selection
  const { data: modelYears } = useQuery({
    queryKey: ['model-years'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_years')
        .select(`
          id,
          year,
          motorcycle_models (
            name,
            brands (
              name
            )
          )
        `)
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data as ModelYear[];
    }
  });

  useEffect(() => {
    if (color) {
      setFormData({
        name: color.name || "",
        hex_code: color.hex_code || "",
        image_url: color.image_url || "",
        is_limited: color.is_limited || false,
        model_year_id: color.model_year_id || ""
      });
    } else if (open) {
      setFormData({
        name: "",
        hex_code: "",
        image_url: "",
        is_limited: false,
        model_year_id: ""
      });
    }
  }, [color, open]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Color name is required.",
      });
      return;
    }

    if (!formData.model_year_id) {
      toast({
        variant: "destructive",
        title: "Validation Error", 
        description: "Please select a model year.",
      });
      return;
    }

    setSaving(true);

    try {
      const colorData = {
        name: formData.name.trim(),
        hex_code: formData.hex_code || null,
        image_url: formData.image_url || null,
        is_limited: formData.is_limited,
        model_year_id: formData.model_year_id
      };

      if (isEditing) {
        const { error } = await supabase
          .from('color_options')
          .update(colorData)
          .eq('id', color.id);

        if (error) throw error;

        toast({
          title: "Color updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        const { error } = await supabase
          .from('color_options')
          .insert([colorData]);

        if (error) throw error;

        toast({
          title: "Color created",
          description: `${formData.name} has been created successfully.`,
        });
      }

      onClose(true);

    } catch (error) {
      console.error('Error saving color:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} color option.`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Color Option</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Color Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Midnight Black"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model_year">Model Year *</Label>
            <Select
              value={formData.model_year_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, model_year_id: value }))}
            >
              <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                <SelectValue placeholder="Select model year" />
              </SelectTrigger>
              <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                {modelYears?.map((modelYear) => {
                  const brandName = modelYear.motorcycle_models?.brands?.name || 'Unknown Brand';
                  const modelName = modelYear.motorcycle_models?.name || 'Unknown Model';
                  return (
                    <SelectItem key={modelYear.id} value={modelYear.id}>
                      {brandName} {modelName} ({modelYear.year})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hex_code">Hex Color Code</Label>
              <div className="flex gap-2">
                <Input
                  id="hex_code"
                  placeholder="#000000"
                  value={formData.hex_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                  className="bg-explorer-dark border-explorer-chrome/30"
                />
                {formData.hex_code && (
                  <div 
                    className="w-10 h-10 rounded border-2 border-explorer-chrome/30 flex-shrink-0"
                    style={{ backgroundColor: formData.hex_code }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="is_limited"
                checked={formData.is_limited}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_limited: checked }))}
              />
              <Label htmlFor="is_limited">Limited Edition</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              placeholder="https://example.com/color-image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          {formData.image_url && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img
                src={formData.image_url}
                alt="Color preview"
                className="w-full h-32 object-cover rounded border border-explorer-chrome/30"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onClose()}
              className="border-explorer-chrome/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorOptionDialog;
