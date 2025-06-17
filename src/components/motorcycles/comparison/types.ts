
import { Motorcycle } from "@/types";

export interface ComparisonMotorcycle extends Motorcycle {
  name: string;
  shortName: string;
  make: string; // Make this required instead of optional
  model: string; // Make this required instead of optional
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
  iconName: string;
  formatter: (value: number) => string;
  calculator: (motorcycle: Motorcycle) => number | null;
}
