
import { useMemo } from "react";
import { Configuration } from "@/types/motorcycle";
import { calculateAllMetrics } from "@/utils/motorcycleCalculations";

export const useConfigurationMetrics = (configuration: Configuration | null) => {
  const metrics = useMemo(() => {
    if (!configuration) return null;
    return calculateAllMetrics(configuration);
  }, [configuration]);

  return metrics;
};

export const useMultipleConfigurationMetrics = (configurations: Configuration[]) => {
  const allMetrics = useMemo(() => {
    return configurations.map(config => ({
      configId: config.id,
      name: config.name,
      metrics: calculateAllMetrics(config)
    }));
  }, [configurations]);

  return allMetrics;
};
