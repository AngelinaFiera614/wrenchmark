
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelYearWithModel, ColorFormData } from "../types";

export const useColorDialog = (color?: any, open?: boolean) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ColorFormData>({
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
          motorcycle_models!inner (
            name,
            brands!inner (
              name
            )
          )
        `)
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data as ModelYearWithModel[];
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Color name is required.",
      });
      return false;
    }

    if (!formData.model_year_id) {
      toast({
        variant: "destructive",
        title: "Validation Error", 
        description: "Please select a model year.",
      });
      return false;
    }

    return true;
  };

  const handleSave = async (onClose: (refresh?: boolean) => void) => {
    if (!validateForm()) return;

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

  return {
    formData,
    setFormData,
    saving,
    isEditing,
    modelYears,
    handleSave
  };
};
