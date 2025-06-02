
import { useState, useEffect } from "react";
import { Motorcycle } from "@/types";
import { Configuration } from "@/types/motorcycle";

export function useMotorcycleDetailData(motorcycle: Motorcycle) {
  const [selectedConfiguration, setSelectedConfiguration] = useState<Configuration | null>(null);

  const handleConfigurationSelect = (config: Configuration) => {
    console.log("Selected configuration:", config);
    setSelectedConfiguration(config);
  };

  useEffect(() => {
    console.log("MotorcycleDetail component mounted with motorcycle:", motorcycle.id, motorcycle.make, motorcycle.model);
    console.log("Component data available:", motorcycle._componentData);
    
    // Auto-select default configuration or first available
    const configurations = motorcycle._componentData?.configurations || [];
    if (configurations.length > 0 && !selectedConfiguration) {
      const defaultConfig = configurations.find(c => c.is_default) || configurations[0];
      setSelectedConfiguration(defaultConfig);
      console.log("Auto-selected configuration:", defaultConfig);
    }
    
    document.title = `${motorcycle.make} ${motorcycle.model} | Wrenchmark`;
  }, [motorcycle, selectedConfiguration]);

  // Enhanced component data extraction with better fallbacks
  const getComponentData = () => {
    const config = selectedConfiguration;
    if (!config) {
      return motorcycle._componentData;
    }

    return {
      engine: config.engines || config.engine || motorcycle._componentData?.engine,
      brakes: config.brake_systems || config.brakes || motorcycle._componentData?.brakes,
      frame: config.frames || config.frame || motorcycle._componentData?.frame,
      suspension: config.suspensions || config.suspension || motorcycle._componentData?.suspension,
      wheels: config.wheels || motorcycle._componentData?.wheels,
      configurations: motorcycle._componentData?.configurations || []
    };
  };

  const componentData = getComponentData();

  // Enhanced component data availability check
  const hasComponentData = componentData && (
    componentData.engine || 
    componentData.brakes || 
    componentData.frame || 
    componentData.suspension || 
    componentData.wheels ||
    // Also check if we have meaningful data in the main motorcycle object
    motorcycle.engine_size > 0 ||
    motorcycle.horsepower > 0 ||
    motorcycle.weight_kg > 0 ||
    motorcycle.seat_height_mm > 0
  );

  // Get configurations for the selector
  const configurations = motorcycle._componentData?.configurations || [];

  console.log("useMotorcycleDetailData result:", {
    selectedConfiguration,
    componentData,
    hasComponentData,
    configurations: configurations.length
  });

  return {
    selectedConfiguration,
    handleConfigurationSelect,
    componentData,
    hasComponentData,
    configurations
  };
}
