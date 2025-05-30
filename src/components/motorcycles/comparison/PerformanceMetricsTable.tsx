
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, TrendingUp, Gauge, Weight } from "lucide-react";
import { ComparisonMotorcycle } from "./types";

interface CalculatedField {
  label: string;
  key: string;
  iconName: string;
  formatter: (value: number) => string;
}

interface PerformanceMetricsTableProps {
  comparisonData: ComparisonMotorcycle[];
  calculatedFields: CalculatedField[];
}

const getIcon = (iconName: string) => {
  const iconProps = { className: "h-4 w-4" };
  switch (iconName) {
    case 'zap':
      return <Zap {...iconProps} />;
    case 'trending-up':
      return <TrendingUp {...iconProps} />;
    case 'gauge':
      return <Gauge {...iconProps} />;
    case 'weight':
      return <Weight {...iconProps} />;
    default:
      return <TrendingUp {...iconProps} />;
  }
};

export default function PerformanceMetricsTable({
  comparisonData,
  calculatedFields
}: PerformanceMetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculated Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Motorcycle</TableHead>
              {calculatedFields.map((field) => (
                <TableHead key={field.key} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getIcon(field.iconName)}
                    {field.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((bike) => (
              <TableRow key={bike.id}>
                <TableCell className="font-medium">
                  {bike.make} {bike.model}
                </TableCell>
                {calculatedFields.map((field) => {
                  const value = bike[field.key as keyof ComparisonMotorcycle] as number;
                  return (
                    <TableCell key={field.key} className="text-center">
                      {value ? field.formatter(value) : 'N/A'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
