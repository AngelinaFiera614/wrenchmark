
import { MotorcycleModel } from "@/types/motorcycle";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { compareArrayValues, getComparisonClass } from "@/lib/comparison-utils";

interface ComparisonFeaturesProps {
  models: MotorcycleModel[];
  getSelectedYear: (model: MotorcycleModel) => any;
  getSelectedConfig: (model: MotorcycleModel) => any;
}

export default function ComparisonFeatures({ 
  models,
  getSelectedYear,
  getSelectedConfig
}: ComparisonFeaturesProps) {
  // This component will be fully implemented in a future update
  return (
    <div className="text-center py-8">
      <ComparisonSectionHeader title="Features & Characteristics" />
      <p className="text-muted-foreground mt-4">
        Detailed feature comparison will be implemented in the next update.
      </p>
    </div>
  );
}
