
import { useState, useEffect, useMemo } from "react";
import { useAdminPartsAssignmentRefactored } from "@/hooks/admin/useAdminPartsAssignmentRefactored";
import { validateConfiguration } from "../../validation/ValidationEngine";
import { Configuration } from "@/types/motorcycle";

export const useAdminPartsLayoutState = () => {
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  
  const adminData = useAdminPartsAssignmentRefactored();

  // Validation for current configuration
  const validation = validateConfiguration(
    adminData.selectedConfigData,
    adminData.selectedModelData,
    adminData.selectedYearData,
    adminData.configurations
  );

  // Sync selectedYears with the main hook's selected year
  useEffect(() => {
    if (adminData.selectedYear && !selectedYears.includes(adminData.selectedYear)) {
      console.log("Syncing selectedYears with hook's selectedYear:", adminData.selectedYear);
      setSelectedYears([adminData.selectedYear]);
    }
  }, [adminData.selectedYear]);

  // Get all configurations for the selected years from the main hook
  const allConfigsForSelectedYears = useMemo(() => {
    if (selectedYears.length === 0) return [];
    
    // If we only have one year selected and it matches the main hook's selected year,
    // use the configurations from the main hook for consistency
    if (selectedYears.length === 1 && selectedYears[0] === adminData.selectedYear) {
      console.log("Using configurations from main hook for single selected year");
      return adminData.configurations;
    }
    
    // For multiple years, we'll need to fetch separately - but for now use what we have
    // This could be enhanced to fetch multi-year data if needed
    console.log("Multiple years selected, using available configurations");
    return adminData.configurations.filter((config: Configuration) => 
      selectedYears.some(yearId => config.model_year_id === yearId)
    );
  }, [selectedYears, adminData.configurations, adminData.selectedYear]);

  return {
    selectedYears,
    setSelectedYears,
    isCreatingNew,
    setIsCreatingNew,
    editingConfig,
    setEditingConfig,
    adminData,
    validation,
    allConfigsForSelectedYears
  };
};
