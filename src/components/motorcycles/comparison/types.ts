
import { Motorcycle } from "@/types";

export interface ComparisonMotorcycle extends Motorcycle {
  name: string;
  shortName: string;
  powerToWeight?: number;
  torqueToWeight?: number;
  powerPerCC?: number;
  weightPerCC?: number;
}

export interface NormalizedScore {
  motorcycle: ComparisonMotorcycle;
  performanceScore: number;
  fuelEfficiencyScore: number;
  practicalityScore: number;
}

export interface CalculatedField {
  label: string;
  key: string;
  icon: React.ReactNode;
  formatter: (value: number) => string;
  calculator: (motorcycle: Motorcycle) => number | null;
}
