
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
    
    // Get configurations from the motorcycle data
    const configurations = motorcycle._componentData?.configurations || [];
    console.log("Available configurations:", configurations.length);
    
    if (configurations.length > 0 && !selectedConfiguration) {
      // Use the pre-selected configuration from the service
      const preSelected = motorcycle._componentData?.selectedConfiguration;
      if (preSelected) {
        setSelectedConfiguration(preSelected);
        console.log("Using pre-selected configuration:", preSelected.name || preSelected.id);
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

  // Check if we have meaningful data to display
  const hasComponentData = selectedConfiguration && (
    (selectedConfiguration.engines && selectedConfiguration.engines.displacement_cc > 0) ||
    selectedConfiguration.seat_height_mm > 0 ||
    selectedConfiguration.weight_kg > 0
  );

  console.log("useMotorcycleDetailData result:", {
    selectedConfiguration: selectedConfiguration?.name || selectedConfiguration?.id,
    hasComponentData,
    configurations: configurations.length,
    selectedConfigData: selectedConfiguration ? {
      engine_size: selectedConfiguration.engines?.displacement_cc,
      horsepower: selectedConfiguration.engines?.power_hp,
      weight_kg: selectedConfiguration.weight_kg,
      seat_height_mm: selectedConfiguration.seat_height_mm
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
