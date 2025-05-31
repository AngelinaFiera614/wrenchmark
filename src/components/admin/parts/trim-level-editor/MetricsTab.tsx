
import React from "react";
import MetricsDisplay from "@/components/admin/models/MetricsDisplay";

interface MetricsTabProps {
  metrics: any;
}

const MetricsTab = ({ metrics }: MetricsTabProps) => {
  return <MetricsDisplay metrics={metrics} />;
};

export default MetricsTab;
