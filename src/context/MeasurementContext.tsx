
import React, { createContext, useContext, useEffect, useState } from "react";

export type MeasurementUnit = "metric" | "imperial";

interface MeasurementContextType {
  unit: MeasurementUnit;
  toggleUnit: () => void;
}

const MeasurementContext = createContext<MeasurementContextType | undefined>(undefined);

interface MeasurementProviderProps {
  children: React.ReactNode;
  defaultUnit?: MeasurementUnit;
  storageKey?: string;
}

export function MeasurementProvider({
  children,
  defaultUnit = "metric",
  storageKey = "wrenchmark-measurement-unit",
}: MeasurementProviderProps) {
  const [unit, setUnit] = useState<MeasurementUnit>(
    () => (localStorage.getItem(storageKey) as MeasurementUnit) || defaultUnit
  );

  useEffect(() => {
    localStorage.setItem(storageKey, unit);
  }, [unit, storageKey]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  return (
    <MeasurementContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </MeasurementContext.Provider>
  );
}

export function useMeasurement() {
  const context = useContext(MeasurementContext);
  
  if (context === undefined) {
    throw new Error("useMeasurement must be used within a MeasurementProvider");
  }
  
  return context;
}
