
import { useState, useEffect } from "react";
import { Motorcycle } from "@/types";

export function useMotorcycleDetailData(motorcycle: Motorcycle) {
  const [selectedConfiguration, setSelectedConfiguration] = useState<any>(null);

  const handleConfigurationSelect = (config: any) => {
    console.log("Selected configuration:", config);
    setSelectedConfiguration(config);
  };

  useEffect(() => {
    console.log("MotorcycleDetail component mounted with motorcycle:", motorcycle.id, motorcycle.make, motorcycle.model);
    console.log("Component data available:", motorcycle._componentData);
    
    // Get configurations from the motorcycle data
    const configurations = motorcycle._componentData?.configurations || [];
    console.log("Available configurations:", configurations.length);
    
    if (configurations.length > 0 && !selectedConfiguration) {
      // Use the pre-selected configuration from the service
      const preSelected = motorcycle._componentData?.selectedConfiguration;
      if (preSelected) {
        setSelectedConfiguration(preSelected);
        console.log("Using pre-selected configuration:", preSelected.name || preSelected.id);
        console.log("Pre-selected configuration components:", {
          engine: preSelected.engines || preSelected.engine,
          brakes: preSelected.brake_systems || preSelected.brakes,
          frame: preSelected.frames || preSelected.frame,
          suspension: preSelected.suspensions || preSelected.suspension,
          wheels: preSelected.wheels || preSelected.wheels
        });
      } else {
        // Fallback to first configuration
        setSelectedConfiguration(configurations[0]);
        console.log("Fallback to first configuration:", configurations[0]?.name || configurations[0]?.id);
      }
    }
    
    document.title = `${motorcycle.make} ${motorcycle.model} | Wrenchmark`;
  }, [motorcycle, selectedConfiguration]);

  // Get configurations for the selector
  const configurations = motorcycle._componentData?.configurations || [];

  // Enhanced check for meaningful data to display - be more flexible
  const hasComponentData = selectedConfiguration && (
    // Check for engine data
    (selectedConfiguration.engines?.id || selectedConfiguration.engine?.id) ||
    // Check for brake data
    (selectedConfiguration.brake_systems?.id || selectedConfiguration.brakes?.id) ||
    // Check for frame data
    (selectedConfiguration.frames?.id || selectedConfiguration.frame?.id) ||
    // Check for suspension data
    (selectedConfiguration.suspensions?.id || selectedConfiguration.suspension?.id) ||
    // Check for wheel data
    (selectedConfiguration.wheels?.id || selectedConfiguration.wheels?.id) ||
    // Fallback to basic motorcycle data
    selectedConfiguration.seat_height_mm > 0 ||
    selectedConfiguration.weight_kg > 0 ||
    motorcycle.engine_size > 0 ||
    motorcycle.horsepower > 0
  );

  console.log("useMotorcycleDetailData result:", {
    selectedConfiguration: selectedConfiguration?.name || selectedConfiguration?.id,
    hasComponentData,
    configurations: configurations.length,
    selectedConfigData: selectedConfiguration ? {
      engine_size: selectedConfiguration.engines?.displacement_cc || selectedConfiguration.engine?.displacement_cc,
      horsepower: selectedConfiguration.engines?.power_hp || selectedConfiguration.engine?.power_hp,
      weight_kg: selectedConfiguration.weight_kg,
      seat_height_mm: selectedConfiguration.seat_height_mm,
      hasEngineComponent: !!(selectedConfiguration.engines?.id || selectedConfiguration.engine?.id),
      hasBrakeComponent: !!(selectedConfiguration.brake_systems?.id || selectedConfiguration.brakes?.id)
    } : null
  });

  return {
    selectedConfiguration,
    handleConfigurationSelect,
    componentData: selectedConfiguration,
    hasComponentData,
    configurations
  };
}
