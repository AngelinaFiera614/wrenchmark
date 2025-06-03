
import { useState, useEffect } from "react";
import { Configuration } from "@/types/motorcycle";
import { checkForExistingDefault } from "@/services/models/configurationService";

export const useTrimLevelForm = (modelYearId: string, configuration?: Configuration) => {
  const [formData, setFormData] = useState({
    model_year_id: modelYearId,
    name: configuration?.name || "",
    description: configuration?.description || "",
    notes: configuration?.notes || "",
    engine_id: configuration?.engine_id || "",
    brake_system_id: configuration?.brake_system_id || "",
    frame_id: configuration?.frame_id || "",
    suspension_id: configuration?.suspension_id || "",
    wheel_id: configuration?.wheel_id || "",
    seat_height_mm: configuration?.seat_height_mm?.toString() || "",
    weight_kg: configuration?.weight_kg?.toString() || "",
    wheelbase_mm: configuration?.wheelbase_mm?.toString() || "",
    fuel_capacity_l: configuration?.fuel_capacity_l?.toString() || "",
    ground_clearance_mm: configuration?.ground_clearance_mm?.toString() || "",
    is_default: configuration?.is_default || false,
    trim_level: configuration?.trim_level || "",
    market_region: configuration?.market_region || "",
    msrp_usd: configuration?.msrp_usd?.toString() || configuration?.price_premium_usd?.toString() || "",
    color_id: configuration?.color_id || "",
  });

  const [selectedComponents, setSelectedComponents] = useState({
    engine: configuration?.engine || null,
    brakes: configuration?.brakes || null,
    frame: configuration?.frame || null,
    suspension: configuration?.suspension || null,
    wheels: configuration?.wheels || null,
  });

  const [existingDefault, setExistingDefault] = useState<Configuration | null>(null);
  const [hasCheckedDefault, setHasCheckedDefault] = useState(false);

  // Check for existing default configuration when component loads
  useEffect(() => {
    const checkDefault = async () => {
      if (!hasCheckedDefault && modelYearId) {
        try {
          const existing = await checkForExistingDefault(modelYearId);
          setExistingDefault(existing);
          setHasCheckedDefault(true);
          
          // If no default exists and this is the first trim, suggest making it default
          if (!existing && !configuration) {
            console.log("No default configuration exists, suggesting this as default");
          }
        } catch (error) {
          console.error("Error checking for existing default:", error);
          setHasCheckedDefault(true);
        }
      }
    };
    
    checkDefault();
  }, [modelYearId, configuration, hasCheckedDefault]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComponentSelect = (componentType: string, componentId: string, component: any) => {
    handleInputChange(`${componentType}_id`, componentId);
    setSelectedComponents(prev => ({ ...prev, [componentType]: component }));
  };

  const getMockConfiguration = (): Configuration => ({
    id: configuration?.id || 'temp',
    model_year_id: modelYearId,
    name: formData.name,
    description: formData.description,
    notes: formData.notes,
    engine_id: formData.engine_id,
    brake_system_id: formData.brake_system_id,
    frame_id: formData.frame_id,
    suspension_id: formData.suspension_id,
    wheel_id: formData.wheel_id,
    seat_height_mm: Number(formData.seat_height_mm) || undefined,
    weight_kg: Number(formData.weight_kg) || undefined,
    wheelbase_mm: Number(formData.wheelbase_mm) || undefined,
    fuel_capacity_l: Number(formData.fuel_capacity_l) || undefined,
    ground_clearance_mm: Number(formData.ground_clearance_mm) || undefined,
    is_default: formData.is_default,
    trim_level: formData.trim_level,
    market_region: formData.market_region,
    msrp_usd: Number(formData.msrp_usd) || undefined,
    color_id: formData.color_id,
    engine: selectedComponents.engine,
    brakes: selectedComponents.brakes,
    frame: selectedComponents.frame,
    suspension: selectedComponents.suspension,
    wheels: selectedComponents.wheels,
  });

  const getCleanConfigData = () => ({
    model_year_id: modelYearId,
    name: formData.name,
    description: formData.description || null,
    notes: formData.notes || null,
    engine_id: formData.engine_id || null,
    brake_system_id: formData.brake_system_id || null,
    frame_id: formData.frame_id || null,
    suspension_id: formData.suspension_id || null,
    wheel_id: formData.wheel_id || null,
    seat_height_mm: formData.seat_height_mm ? Number(formData.seat_height_mm) : null,
    weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
    wheelbase_mm: formData.wheelbase_mm ? Number(formData.wheelbase_mm) : null,
    fuel_capacity_l: formData.fuel_capacity_l ? Number(formData.fuel_capacity_l) : null,
    ground_clearance_mm: formData.ground_clearance_mm ? Number(formData.ground_clearance_mm) : null,
    is_default: formData.is_default,
    trim_level: formData.trim_level || null,
    market_region: formData.market_region || null,
    msrp_usd: formData.msrp_usd ? Number(formData.msrp_usd) : null,
    color_id: formData.color_id || null,
  });

  return {
    formData,
    selectedComponents,
    existingDefault,
    hasCheckedDefault,
    handleInputChange,
    handleComponentSelect,
    getMockConfiguration,
    getCleanConfigData
  };
};
