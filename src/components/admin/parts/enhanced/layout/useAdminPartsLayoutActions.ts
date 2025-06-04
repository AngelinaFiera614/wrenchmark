
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAdminPartsLayoutActionsProps {
  selectedYears: string[];
  setSelectedYears: (years: string[] | ((prev: string[]) => string[])) => void;
  setIsCreatingNew: (creating: boolean) => void;
  setEditingConfig: (config: any) => void;
  adminData: any;
}

export const useAdminPartsLayoutActions = ({
  selectedYears,
  setSelectedYears,
  setIsCreatingNew,
  setEditingConfig,
  adminData
}: UseAdminPartsLayoutActionsProps) => {
  const { toast } = useToast();
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copySourceConfig, setCopySourceConfig] = useState<any>(null);

  const handleRunValidation = useCallback(() => {
    console.log("Running full validation...");
  }, []);

  const handleYearToggle = useCallback((yearId: string) => {
    setSelectedYears((prev: string[]) => {
      const newYears = prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId];
      
      console.log("Year toggled:", yearId, "New selection:", newYears);
      
      // If we're selecting a single year, also update the main hook's selection
      if (newYears.length === 1 && newYears[0] !== adminData.selectedYear) {
        console.log("Updating main hook's selected year to:", newYears[0]);
        adminData.handleYearSelect(newYears[0]);
      }
      
      return newYears;
    });
  }, [setSelectedYears, adminData]);

  const handleSelectAllYears = useCallback(() => {
    const allYearIds = adminData.modelYears.map((year: any) => year.id);
    console.log("Selecting all years:", allYearIds);
    setSelectedYears(allYearIds);
  }, [adminData.modelYears, setSelectedYears]);

  const handleClearAllYears = useCallback(() => {
    console.log("Clearing all year selections");
    setSelectedYears([]);
  }, [setSelectedYears]);

  const handleCreateNew = useCallback((yearIds?: string[]) => {
    if (!adminData.selectedModel) {
      alert("Please select a model first");
      return;
    }
    
    // Use provided yearIds or selected years, fallback to current year
    const yearsToUse = yearIds ? yearIds : selectedYears.length > 0 ? selectedYears : adminData.selectedYear ? [adminData.selectedYear] : [];
    
    if (yearsToUse.length === 0) {
      alert("Please select at least one model year");
      return;
    }
    
    console.log("Creating new trim for years:", yearsToUse);
    setSelectedYears(yearsToUse);
    setEditingConfig(null);
    setIsCreatingNew(true);
  }, [adminData.selectedModel, selectedYears, adminData.selectedYear, setSelectedYears, setEditingConfig, setIsCreatingNew]);

  const handleEditConfig = useCallback((config: any) => {
    console.log("Editing configuration:", config);
    setEditingConfig(config);
    setSelectedYears([config.model_year_id]);
    setIsCreatingNew(true);
  }, [setEditingConfig, setSelectedYears, setIsCreatingNew]);

  const handleCopyConfig = useCallback((config: any) => {
    console.log("Opening copy dialog for configuration:", config);
    setCopySourceConfig(config);
    setCopyDialogOpen(true);
  }, []);

  const handleCopyDialogClose = useCallback(() => {
    setCopyDialogOpen(false);
    setCopySourceConfig(null);
  }, []);

  const handleCopySuccess = useCallback(async () => {
    console.log("Copy operation completed successfully");
    setCopyDialogOpen(false);
    setCopySourceConfig(null);
    
    // Refresh all configurations
    await adminData.refreshConfigurations(selectedYears.length > 0 ? selectedYears : [adminData.selectedYear]);
    
    toast({
      title: "Copy Successful",
      description: "Trim level has been copied to the selected years.",
    });
  }, [selectedYears, adminData, toast]);

  const handleDeleteConfig = useCallback(async (config: any) => {
    console.log("Deleting configuration:", config);
    
    try {
      // Import and use the delete service
      const { deleteConfiguration } = await import("@/services/models/configurationService");
      
      const confirmed = window.confirm(
        `Are you sure you want to delete the trim level "${config.name || 'Unnamed'}"? This action cannot be undone.`
      );
      
      if (!confirmed) return;

      await deleteConfiguration(config.id);
      
      toast({
        title: "Trim Level Deleted",
        description: `"${config.name || 'Unnamed trim'}" has been deleted successfully.`,
      });

      // Refresh configurations after deletion
      await adminData.refreshConfigurations(selectedYears.length > 0 ? selectedYears : [config.model_year_id]);
      
    } catch (error) {
      console.error("Error deleting configuration:", error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete the trim level. Please try again.",
      });
    }
  }, [selectedYears, adminData, toast]);

  const handlePreviewConfig = useCallback((config: any) => {
    console.log("Previewing configuration:", config);
    adminData.handleConfigSelect(config.id);
  }, [adminData]);

  const handleManageComponents = useCallback(() => {
    console.log("Opening component library...");
    // Implement component management
  }, []);

  const handleBulkAssign = useCallback(() => {
    console.log("Opening bulk assign dialog...");
    // Implement bulk assignment
  }, []);

  const handleRefreshData = useCallback(async () => {
    console.log("Manual refresh triggered for selected years:", selectedYears);
    if (selectedYears.length > 0) {
      await adminData.refreshConfigurations(selectedYears);
    } else if (adminData.selectedYear) {
      await adminData.refreshConfigurations([adminData.selectedYear]);
    }
  }, [selectedYears, adminData]);

  const handleSaveConfig = useCallback(async (savedConfig: any) => {
    console.log("=== CONFIGURATION SAVED ===");
    console.log("Saved configuration:", savedConfig);
    
    setIsCreatingNew(false);
    setEditingConfig(null);
    
    // Enhanced refresh logic for multi-year operations
    const yearsToRefresh = selectedYears.length > 0 ? selectedYears : (savedConfig?.model_year_id ? [savedConfig.model_year_id] : []);
    
    console.log("Refreshing configurations for years:", yearsToRefresh);
    
    try {
      // Refresh the configurations through the main hook
      await adminData.refreshConfigurations(yearsToRefresh);
      
      // Small delay to ensure cache invalidation completes
      setTimeout(() => {
        // If we have a saved config, select it
        if (savedConfig?.id) {
          console.log("Auto-selecting newly saved configuration:", savedConfig.id);
          adminData.handleConfigSelect(savedConfig.id);
          
          // If the saved config year isn't selected, select it
          if (savedConfig.model_year_id && adminData.selectedYear !== savedConfig.model_year_id) {
            console.log("Updating selected year to match saved config:", savedConfig.model_year_id);
            adminData.handleYearSelect(savedConfig.model_year_id);
          }
        }
      }, 100);
      
    } catch (error) {
      console.error("Error during configuration save callback:", error);
    }
  }, [selectedYears, setIsCreatingNew, setEditingConfig, adminData]);

  const handleCancelEdit = useCallback(() => {
    console.log("Cancelling trim edit");
    setIsCreatingNew(false);
    setEditingConfig(null);
  }, [setIsCreatingNew, setEditingConfig]);

  return {
    handleRunValidation,
    handleYearToggle,
    handleSelectAllYears,
    handleClearAllYears,
    handleCreateNew,
    handleEditConfig,
    handleCopyConfig,
    handleDeleteConfig,
    handlePreviewConfig,
    handleManageComponents,
    handleBulkAssign,
    handleRefreshData,
    handleSaveConfig,
    handleCancelEdit,
    // New copy dialog state and handlers
    copyDialogOpen,
    copySourceConfig,
    handleCopyDialogClose,
    handleCopySuccess
  };
};
