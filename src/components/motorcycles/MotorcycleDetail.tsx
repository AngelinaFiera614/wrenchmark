
import { Motorcycle } from "@/types";
import { MotorcycleHeader } from "./MotorcycleHeader";
import { PerformanceSpecifications } from "./PerformanceSpecifications";
import { PhysicalDimensions } from "./PhysicalDimensions";
import { FeaturesList } from "./FeaturesList";
import { MaintenanceLogs } from "./MaintenanceLogs";

interface MotorcycleDetailProps {
  motorcycle: Motorcycle;
}

export default function MotorcycleDetail({ motorcycle }: MotorcycleDetailProps) {
  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header Section with Image and Overview */}
      <MotorcycleHeader motorcycle={motorcycle} />
      
      {/* Specifications Sections */}
      <PerformanceSpecifications motorcycle={motorcycle} />
      
      {/* Physical Dimensions Section */}
      <PhysicalDimensions motorcycle={motorcycle} />
      
      {/* Features and Smart Features Sections */}
      <FeaturesList motorcycle={motorcycle} />
      
      {/* Maintenance Section */}
      <MaintenanceLogs />
    </div>
  );
}
