
import { useMemo } from "react";
import { Zap, TrendingUp, Weight, Gauge } from "lucide-react";
import { Motorcycle } from "@/types";
import { CalculatedField, ComparisonMotorcycle, NormalizedScore } from "./types";

export function useComparisonCalculations(motorcyclesToCompare: Motorcycle[]) {
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

  return {
    calculatedFields,
    comparisonData,
    normalizedScores
  };
}
