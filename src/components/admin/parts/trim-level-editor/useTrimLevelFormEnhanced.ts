
import { useState, useMemo } from "react";
import { Configuration } from "@/types/motorcycle";
import { validateTrimLevelFormEnhanced, calculateFormCompleteness } from "./validationEnhanced";

interface FormData {
  name: string;
  engine_id: string;
  brake_system_id: string;
  frame_id: string;
  suspension_id: string;
  wheel_id: string;
  seat_height_mm: string | number;
  weight_kg: string | number;
  wheelbase_mm: string | number;
  fuel_capacity_l: string | number;
  ground_clearance_mm: string | number;
  is_default: boolean;
  market_region: string;
  price_premium_usd: string | number;
  model_year_id: string;
}

interface SelectedComponents {
  engine: any;
  brakes: any;
  frame: any;
  suspension: any;
  wheels: any;
}

export const useTrimLevelFormEnhanced = (modelYearId: string, configuration?: Configuration) => {
  const [formData, setFormData] = useState<FormData>({
    name: configuration?.name || "",
    engine_id: configuration?.engine_id || "",
    brake_system_id: configuration?.brake_system_id || "",
    frame_id: configuration?.frame_id || "",
    suspension_id: configuration?.suspension_id || "",
    wheel_id: configuration?.wheel_id || "",
    seat_height_mm: configuration?.seat_height_mm || "",
    weight_kg: configuration?.weight_kg || "",
    wheelbase_mm: configuration?.wheelbase_mm || "",
    fuel_capacity_l: configuration?.fuel_capacity_l || "",
    ground_clearance_mm: configuration?.ground_clearance_mm || "",
    is_default: configuration?.is_default || false,
    market_region: configuration?.market_region || "",
    price_premium_usd: configuration?.price_premium_usd || "",
    model_year_id: modelYearId,
  });

  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    engine: configuration?.engine || null,
    brakes: configuration?.brakes || null,
    frame: configuration?.frame || null,
    suspension: configuration?.suspension || null,
    wheels: configuration?.wheels || null,
  });

  // Enhanced validation with real-time feedback
  const validation = useMemo(() => {
    return validateTrimLevelFormEnhanced(formData, modelYearId);
  }, [formData, modelYearId]);

  // Completeness calculation
  const completeness = useMemo(() => {
    return calculateFormCompleteness(formData);
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComponentSelect = (componentType: string, componentId: string, component: any) => {
    console.log(`Selected ${componentType}:`, componentId, component);
    handleInputChange(`${componentType}_id`, componentId);
    setSelectedComponents(prev => ({ ...prev, [componentType]: component }));
  };

  // Create a mock configuration for metrics calculation
  const getMockConfiguration = (): Configuration => ({
    id: configuration?.id || 'temp',
    model_year_id: modelYearId,
    name: formData.name,
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
    market_region: formData.market_region,
    price_premium_usd: Number(formData.price_premium_usd) || undefined,
    engine: selectedComponents.engine,
    brakes: selectedComponents.brakes,
    frame: selectedComponents.frame,
    suspension: selectedComponents.suspension,
    wheels: selectedComponents.wheels,
  });

  const getCleanConfigData = () => ({
    model_year_id: modelYearId,
    name: formData.name.trim(),
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
    market_region: formData.market_region || null,
    price_premium_usd: formData.price_premium_usd ? Number(formData.price_premium_usd) : null,
  });

  return {
    formData,
    selectedComponents,
    validation,
    completeness,
    handleInputChange,
    handleComponentSelect,
    getMockConfiguration,
    getCleanConfigData
  };
};
