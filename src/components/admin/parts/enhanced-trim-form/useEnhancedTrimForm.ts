import { useState, useEffect, useMemo } from "react";
import { Configuration, ModelYear } from "@/types/motorcycle";
import { ComponentType } from "@/services/modelComponent/types";

interface FormData {
  name: string;
  description: string;
  market_region: string;
  msrp_usd: number | "";
  price_premium_usd: number | "";
  is_default: boolean;
  trim_level: string;
  special_features: string[];
  optional_equipment: string[];
  // Physical dimensions
  seat_height_mm: number | "";
  weight_kg: number | "";
  wheelbase_mm: number | "";
  fuel_capacity_l: number | "";
  ground_clearance_mm: number | "";
  // Model year targeting
  target_years: string[];
}

interface ComponentOverride {
  yearId: string;
  componentType: ComponentType;
  componentId: string | null;
  isOverride: boolean;
  inheritedFrom?: string;
}

interface ColorSelection {
  yearId: string;
  colorIds: string[];
  defaultColorId?: string;
}

interface ValidationError {
  field: string;
  message: string;
  section: string;
}

interface Validation {
  isValid: boolean;
  errors: ValidationError[];
}

interface Completeness {
  overall: number;
  sections: {
    basic: number;
    components: number;
    colors: number;
  };
}

export const useEnhancedTrimForm = (
  modelYears: ModelYear[],
  configuration?: Configuration,
  onSave?: (config: Configuration) => void
) => {
  const [formData, setFormData] = useState<FormData>({
    name: configuration?.name || "",
    description: configuration?.description || "",
    market_region: configuration?.market_region || "",
    msrp_usd: configuration?.msrp_usd || "",
    price_premium_usd: configuration?.price_premium_usd || "",
    is_default: configuration?.is_default || false,
    trim_level: configuration?.trim_level || "",
    special_features: configuration?.special_features || [],
    optional_equipment: configuration?.optional_equipment || [],
    seat_height_mm: configuration?.seat_height_mm || "",
    weight_kg: configuration?.weight_kg || "",
    wheelbase_mm: configuration?.wheelbase_mm || "",
    fuel_capacity_l: configuration?.fuel_capacity_l || "",
    ground_clearance_mm: configuration?.ground_clearance_mm || "",
    target_years: modelYears.length > 0 ? [modelYears[0].id] : [],
  });

  const [componentOverrides, setComponentOverrides] = useState<ComponentOverride[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColorSelection[]>([]);
  const [saving, setSaving] = useState(false);

  // Initialize component overrides for target years
  useEffect(() => {
    if (formData.target_years.length > 0) {
      const componentTypes: ComponentType[] = ['engine', 'brake_system', 'frame', 'suspension', 'wheel'];
      const newOverrides: ComponentOverride[] = [];

      formData.target_years.forEach(yearId => {
        componentTypes.forEach(componentType => {
          const existingOverride = componentOverrides.find(
            o => o.yearId === yearId && o.componentType === componentType
          );

          if (!existingOverride) {
            newOverrides.push({
              yearId,
              componentType,
              componentId: null,
              isOverride: false,
            });
          }
        });
      });

      if (newOverrides.length > 0) {
        setComponentOverrides(prev => [...prev, ...newOverrides]);
      }
    }
  }, [formData.target_years]);

  // Initialize color selections for target years
  useEffect(() => {
    if (formData.target_years.length > 0) {
      const newColorSelections: ColorSelection[] = [];

      formData.target_years.forEach(yearId => {
        const existingSelection = selectedColors.find(s => s.yearId === yearId);
        if (!existingSelection) {
          newColorSelections.push({
            yearId,
            colorIds: [],
          });
        }
      });

      if (newColorSelections.length > 0) {
        setSelectedColors(prev => [...prev, ...newColorSelections]);
      }
    }
  }, [formData.target_years]);

  // Validation logic
  const validation: Validation = useMemo(() => {
    const errors: ValidationError[] = [];

    // Basic info validation
    if (!formData.name.trim()) {
      errors.push({ field: "name", message: "Configuration name is required", section: "basic" });
    }

    if (formData.target_years.length === 0) {
      errors.push({ field: "target_years", message: "At least one model year must be selected", section: "basic" });
    }

    // Component validation
    const missingComponents = componentOverrides.filter(
      override => override.isOverride && !override.componentId
    );
    
    if (missingComponents.length > 0) {
      errors.push({
        field: "components",
        message: `${missingComponents.length} component override(s) are enabled but not assigned`,
        section: "components"
      });
    }

    // Color validation
    const yearsWithoutColors = selectedColors.filter(
      selection => selection.colorIds.length === 0
    );

    if (yearsWithoutColors.length > 0) {
      errors.push({
        field: "colors",
        message: `${yearsWithoutColors.length} model year(s) have no colors assigned`,
        section: "colors"
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [formData, componentOverrides, selectedColors]);

  // Completeness calculation
  const completeness: Completeness = useMemo(() => {
    let basicScore = 0;
    let componentsScore = 0;
    let colorsScore = 0;

    // Basic info scoring (40 points total)
    if (formData.name.trim()) basicScore += 15;
    if (formData.description.trim()) basicScore += 5;
    if (formData.target_years.length > 0) basicScore += 10;
    if (formData.msrp_usd || formData.price_premium_usd) basicScore += 5;
    if (formData.market_region.trim()) basicScore += 3;
    if (formData.trim_level.trim()) basicScore += 2;

    // Components scoring (30 points total)
    const totalPossibleOverrides = formData.target_years.length * 5; // 5 component types
    const activeOverrides = componentOverrides.filter(o => o.isOverride);
    const completedOverrides = activeOverrides.filter(o => o.componentId);
    
    if (totalPossibleOverrides > 0) {
      componentsScore = Math.round((completedOverrides.length / totalPossibleOverrides) * 100);
    }

    // Colors scoring (30 points total)
    const yearsWithColors = selectedColors.filter(s => s.colorIds.length > 0);
    if (formData.target_years.length > 0) {
      colorsScore = Math.round((yearsWithColors.length / formData.target_years.length) * 100);
    }

    const overall = Math.round((basicScore + componentsScore + colorsScore) / 3);

    return {
      overall,
      sections: {
        basic: Math.round((basicScore / 40) * 100),
        components: componentsScore,
        colors: colorsScore,
      }
    };
  }, [formData, componentOverrides, selectedColors]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComponentOverride = (
    yearId: string,
    componentType: ComponentType,
    componentId: string | null,
    isOverride: boolean
  ) => {
    setComponentOverrides(prev => {
      const updated = prev.filter(
        o => !(o.yearId === yearId && o.componentType === componentType)
      );
      
      updated.push({
        yearId,
        componentType,
        componentId,
        isOverride,
      });

      return updated;
    });
  };

  const handleColorSelection = (yearId: string, colorIds: string[], defaultColorId?: string) => {
    setSelectedColors(prev => {
      const updated = prev.filter(s => s.yearId !== yearId);
      updated.push({
        yearId,
        colorIds,
        defaultColorId,
      });
      return updated;
    });
  };

  const handleSave = async () => {
    if (!validation.isValid) return;

    setSaving(true);
    try {
      // Create configuration object
      const configData: Partial<Configuration> = {
        ...formData,
        msrp_usd: typeof formData.msrp_usd === 'number' ? formData.msrp_usd : undefined,
        price_premium_usd: typeof formData.price_premium_usd === 'number' ? formData.price_premium_usd : undefined,
        seat_height_mm: typeof formData.seat_height_mm === 'number' ? formData.seat_height_mm : undefined,
        weight_kg: typeof formData.weight_kg === 'number' ? formData.weight_kg : undefined,
        wheelbase_mm: typeof formData.wheelbase_mm === 'number' ? formData.wheelbase_mm : undefined,
        fuel_capacity_l: typeof formData.fuel_capacity_l === 'number' ? formData.fuel_capacity_l : undefined,
        ground_clearance_mm: typeof formData.ground_clearance_mm === 'number' ? formData.ground_clearance_mm : undefined,
      };

      if (onSave) {
        onSave(configData as Configuration);
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      market_region: "",
      msrp_usd: "",
      price_premium_usd: "",
      is_default: false,
      trim_level: "",
      special_features: [],
      optional_equipment: [],
      seat_height_mm: "",
      weight_kg: "",
      wheelbase_mm: "",
      fuel_capacity_l: "",
      ground_clearance_mm: "",
      target_years: modelYears.length > 0 ? [modelYears[0].id] : [],
    });
    setComponentOverrides([]);
    setSelectedColors([]);
  };

  return {
    formData,
    componentOverrides,
    selectedColors,
    validation,
    completeness,
    saving,
    handleInputChange,
    handleComponentOverride,
    handleColorSelection,
    handleSave,
    resetForm,
  };
};