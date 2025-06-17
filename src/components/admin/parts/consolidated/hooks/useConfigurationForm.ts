
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  description: string;
  trim_level: string;
  market_region: string;
  seat_height_mm: string;
  weight_kg: string;
  wheelbase_mm: string;
  fuel_capacity_l: string;
  ground_clearance_mm: string;
  msrp_usd: string;
  price_premium_usd: string;
  special_features: string[];
  optional_equipment: string[];
  notes: string;
  is_default: boolean;
}

export const useConfigurationForm = (
  selectedYearData?: any,
  configurationToEdit?: any,
  onSuccess?: () => void
) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    trim_level: "",
    market_region: "US",
    seat_height_mm: "",
    weight_kg: "",
    wheelbase_mm: "",
    fuel_capacity_l: "",
    ground_clearance_mm: "",
    msrp_usd: "",
    price_premium_usd: "",
    special_features: [],
    optional_equipment: [],
    notes: "",
    is_default: false
  });

  // Initialize form data when editing
  useEffect(() => {
    if (configurationToEdit) {
      setFormData({
        name: configurationToEdit.name || "",
        description: configurationToEdit.description || "",
        trim_level: configurationToEdit.trim_level || "",
        market_region: configurationToEdit.market_region || "US",
        seat_height_mm: configurationToEdit.seat_height_mm?.toString() || "",
        weight_kg: configurationToEdit.weight_kg?.toString() || "",
        wheelbase_mm: configurationToEdit.wheelbase_mm?.toString() || "",
        fuel_capacity_l: configurationToEdit.fuel_capacity_l?.toString() || "",
        ground_clearance_mm: configurationToEdit.ground_clearance_mm?.toString() || "",
        msrp_usd: configurationToEdit.msrp_usd?.toString() || "",
        price_premium_usd: configurationToEdit.price_premium_usd?.toString() || "",
        special_features: configurationToEdit.special_features || [],
        optional_equipment: configurationToEdit.optional_equipment || [],
        notes: configurationToEdit.notes || "",
        is_default: configurationToEdit.is_default || false
      });
    } else {
      setFormData({
        name: "Standard",
        description: "",
        trim_level: "",
        market_region: "US",
        seat_height_mm: "",
        weight_kg: "",
        wheelbase_mm: "",
        fuel_capacity_l: "",
        ground_clearance_mm: "",
        msrp_usd: "",
        price_premium_usd: "",
        special_features: [],
        optional_equipment: [],
        notes: "",
        is_default: false
      });
    }
    setErrors({});
  }, [configurationToEdit]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(field, arrayValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Configuration name is required";
    }
    
    if (!selectedYearData && !configurationToEdit) {
      newErrors.general = "No model year selected";
    }

    // Validate numeric fields
    const numericFields = ['seat_height_mm', 'weight_kg', 'wheelbase_mm', 'fuel_capacity_l', 'ground_clearance_mm', 'msrp_usd', 'price_premium_usd'];
    numericFields.forEach(field => {
      const value = formData[field as keyof FormData] as string;
      if (value && isNaN(Number(value))) {
        newErrors[field] = "Must be a valid number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before saving."
      });
      return;
    }

    setSaving(true);
    
    try {
      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        trim_level: formData.trim_level.trim() || null,
        market_region: formData.market_region,
        seat_height_mm: formData.seat_height_mm ? parseInt(formData.seat_height_mm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        wheelbase_mm: formData.wheelbase_mm ? parseInt(formData.wheelbase_mm) : null,
        fuel_capacity_l: formData.fuel_capacity_l ? parseFloat(formData.fuel_capacity_l) : null,
        ground_clearance_mm: formData.ground_clearance_mm ? parseInt(formData.ground_clearance_mm) : null,
        msrp_usd: formData.msrp_usd ? parseFloat(formData.msrp_usd) : null,
        price_premium_usd: formData.price_premium_usd ? parseFloat(formData.price_premium_usd) : null,
        special_features: formData.special_features.length > 0 ? formData.special_features : null,
        optional_equipment: formData.optional_equipment.length > 0 ? formData.optional_equipment : null,
        notes: formData.notes.trim() || null,
        is_default: formData.is_default
      };

      if (configurationToEdit) {
        const { error } = await supabase
          .from('model_configurations')
          .update(dataToSave)
          .eq('id', configurationToEdit.id);

        if (error) throw error;
        
        toast({
          title: "Configuration Updated",
          description: `${formData.name} has been updated successfully.`
        });
      } else {
        const { error } = await supabase
          .from('model_configurations')
          .insert({
            model_year_id: selectedYearData.id,
            ...dataToSave
          });

        if (error) throw error;
        
        toast({
          title: "Configuration Created",
          description: `${formData.name} has been created successfully.`
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: `Failed to save configuration: ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    errors,
    saving,
    handleInputChange,
    handleArrayChange,
    handleSave,
    validateForm
  };
};
