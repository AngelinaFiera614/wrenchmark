
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface CalculatedField {
  label: string;
  key: string;
  icon: React.ReactNode;
  formatter: (value: number) => string;
}

interface ComparisonChartProps {
  calculatedFields: CalculatedField[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  chartData: Array<{ name: string; value: number }>;
}

export default function ComparisonChart({
  calculatedFields,
  selectedMetric,
  onMetricChange,
  chartData
}: ComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Enhanced Comparison Matrix
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {calculatedFields.map((field) => (
            <Button
              key={field.key}
              variant={selectedMetric === field.key ? "default" : "outline"}
              size="sm"
              onClick={() => onMetricChange(field.key)}
              className="flex items-center gap-1"
            >
              {field.icon}
              {field.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => {
                const field = calculatedFields.find(f => f.key === selectedMetric);
                return field ? field.formatter(value as number) : value;
              }} />
              <Bar dataKey="value" fill="#00D2B4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
