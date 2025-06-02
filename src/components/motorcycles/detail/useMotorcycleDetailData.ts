
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

  // Get component data from the selected configuration or fallback to motorcycle data
  const componentData = selectedConfiguration ? {
    engine: selectedConfiguration.engines || selectedConfiguration.engine,
    brakes: selectedConfiguration.brake_systems || selectedConfiguration.brakes,
    frame: selectedConfiguration.frames || selectedConfiguration.frame,
    suspension: selectedConfiguration.suspensions || selectedConfiguration.suspension,
    wheels: selectedConfiguration.wheels,
    configurations: motorcycle._componentData?.configurations || []
  } : motorcycle._componentData;

  const hasComponentData = componentData && (
    componentData.engine || 
    componentData.brakes || 
    componentData.frame || 
    componentData.suspension || 
    componentData.wheels
  );

  // Get configurations for the selector
  const configurations = motorcycle._componentData?.configurations || [];

  return {
    selectedConfiguration,
    handleConfigurationSelect,
    componentData,
    hasComponentData,
    configurations
  };
}
