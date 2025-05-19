
import { MotorcycleModel } from "@/types/motorcycle";
import { Motorcycle } from "@/types";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { compareArrayValues, getComparisonClass } from "@/lib/comparison-utils";

interface ComparisonFeaturesProps {
  models?: MotorcycleModel[];
  getSelectedYear?: (model: MotorcycleModel) => any;
  getSelectedConfig?: (model: MotorcycleModel) => any;
  motorcycles?: Motorcycle[]; // Add support for legacy Motorcycle type
}

export default function ComparisonFeatures({ 
  models = [],
  getSelectedYear,
  getSelectedConfig,
  motorcycles = []
}: ComparisonFeaturesProps) {
  // This component will be fully implemented in a future update
  const hasMotorcycles = motorcycles && motorcycles.length > 0;
  const hasModels = models && models.length > 0;

  return (
    <div>
      <ComparisonSectionHeader title="Features & Characteristics" />
      
      <div className="text-center py-8 text-muted-foreground">
        Detailed feature comparison will be implemented in the next update.
      </div>
    </div>
  );
}
