import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Zap, Weight, Gauge } from "lucide-react";
import { Motorcycle } from "@/types";
import { useComparison } from "@/context/ComparisonContext";

interface CalculatedField {
  label: string;
  key: string;
  icon: React.ReactNode;
  formatter: (value: number) => string;
  calculator: (motorcycle: Motorcycle) => number | null;
}

interface ComparisonMotorcycle extends Motorcycle {
  name: string;
  shortName: string;
  powerToWeight?: number;
  torqueToWeight?: number;
  powerPerCC?: number;
  weightPerCC?: number;
}

interface NormalizedScore {
  motorcycle: ComparisonMotorcycle;
  performanceScore: number;
  fuelEfficiencyScore: number;
  practicalityScore: number;
}

export default function EnhancedComparisonMatrix() {
  const { motorcyclesToCompare } = useComparison();
  const [selectedMetric, setSelectedMetric] = useState<string>('powerToWeight');

  const calculatedFields: CalculatedField[] = useMemo(() => [
    {
      label: 'Power-to-Weight',
      key: 'powerToWeight',
      icon: <Zap className="h-4 w-4" />,
      formatter: (value) => `${value.toFixed(2)} hp/kg`,
      calculator: (m) => m.horsepower && m.weight_kg ? m.horsepower / m.weight_kg : null
    },
    {
      label: 'Torque-to-Weight',
      key: 'torqueToWeight',
      icon: <TrendingUp className="h-4 w-4" />,
      formatter: (value) => `${value.toFixed(2)} Nm/kg`,
      calculator: (m) => m.torque_nm && m.weight_kg ? m.torque_nm / m.weight_kg : null
    },
    {
      label: 'Power per CC',
      key: 'powerPerCC',
      icon: <Gauge className="h-4 w-4" />,
      formatter: (value) => `${value.toFixed(3)} hp/cc`,
      calculator: (m) => m.horsepower && m.engine_size ? m.horsepower / m.engine_size : null
    },
    {
      label: 'Weight per CC',
      key: 'weightPerCC',
      icon: <Weight className="h-4 w-4" />,
      formatter: (value) => `${value.toFixed(3)} kg/cc`,
      calculator: (m) => m.weight_kg && m.engine_size ? m.weight_kg / m.engine_size : null
    }
  ], []);

  const comparisonData = useMemo(() => {
    return motorcyclesToCompare.map(motorcycle => {
      const powerToWeight = calculatedFields[0].calculator(motorcycle);
      const torqueToWeight = calculatedFields[1].calculator(motorcycle);
      const powerPerCC = calculatedFields[2].calculator(motorcycle);
      const weightPerCC = calculatedFields[3].calculator(motorcycle);

      return {
        ...motorcycle,
        name: `${motorcycle.make} ${motorcycle.model}`,
        shortName: motorcycle.model,
        powerToWeight: powerToWeight || undefined,
        torqueToWeight: torqueToWeight || undefined,
        powerPerCC: powerPerCC || undefined,
        weightPerCC: weightPerCC || undefined,
      } as ComparisonMotorcycle;
    });
  }, [motorcyclesToCompare, calculatedFields]);

  const chartData = useMemo(() => {
    return comparisonData.map(bike => ({
      name: bike.shortName,
      value: bike[selectedMetric as keyof ComparisonMotorcycle] as number || 0
    }));
  }, [comparisonData, selectedMetric]);

  const normalizedScores = useMemo(() => {
    const scores: NormalizedScore[] = comparisonData.map(bike => {
      const powerToWeight = bike.powerToWeight || 0;
      const torqueToWeight = bike.torqueToWeight || 0;
      const powerPerCC = bike.powerPerCC || 0;
      
      // Simple scoring algorithm (can be enhanced)
      const performanceScore = (powerToWeight * 0.4) + (torqueToWeight * 0.3) + (powerPerCC * 100 * 0.3);
      
      return {
        motorcycle: bike,
        performanceScore,
        fuelEfficiencyScore: bike.fuel_capacity_l ? (1000 / bike.fuel_capacity_l) : 0,
        practicalityScore: bike.seat_height_mm ? (1000 - bike.seat_height_mm) / 10 : 0
      };
    });

    // Normalize scores to 0-100 scale
    const maxPerformance = Math.max(...scores.map(s => s.performanceScore));
    const maxFuelEff = Math.max(...scores.map(s => s.fuelEfficiencyScore));
    const maxPracticality = Math.max(...scores.map(s => s.practicalityScore));

    return scores.map(score => ({
      ...score,
      performanceScore: maxPerformance > 0 ? (score.performanceScore / maxPerformance) * 100 : 0,
      fuelEfficiencyScore: maxFuelEff > 0 ? (score.fuelEfficiencyScore / maxFuelEff) * 100 : 0,
      practicalityScore: maxPracticality > 0 ? (score.practicalityScore / maxPracticality) * 100 : 0
    }));
  }, [comparisonData]);

  if (motorcyclesToCompare.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select motorcycles to compare advanced metrics and calculated fields
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
                onClick={() => setSelectedMetric(field.key)}
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
                      {field.icon}
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

      <Card>
        <CardHeader>
          <CardTitle>Normalized Performance Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motorcycle</TableHead>
                <TableHead className="text-center">Performance</TableHead>
                <TableHead className="text-center">Fuel Efficiency</TableHead>
                <TableHead className="text-center">Practicality</TableHead>
                <TableHead className="text-center">Overall</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalizedScores.map((score) => {
                const overall = (score.performanceScore + score.fuelEfficiencyScore + score.practicalityScore) / 3;
                return (
                  <TableRow key={score.motorcycle.id}>
                    <TableCell className="font-medium">
                      {score.motorcycle.make} {score.motorcycle.model}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10">
                        {score.performanceScore.toFixed(0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-500/10">
                        {score.fuelEfficiencyScore.toFixed(0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-purple-500/10">
                        {score.practicalityScore.toFixed(0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal">
                        {overall.toFixed(0)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
