
import { Motorcycle } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { compareNumericValues, getComparisonClass } from "@/lib/comparison-utils";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { useMobile } from "@/hooks/use-mobile";

interface ComparisonPerformanceProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonPerformance({ motorcycles }: ComparisonPerformanceProps) {
  const isMobile = useMobile();
  
  // Compare engine sizes
  const engineComparisons = compareNumericValues(motorcycles.map(m => m.engine_cc));
  
  // Compare horsepower
  const horsepowerComparisons = compareNumericValues(motorcycles.map(m => m.horsepower_hp));
  
  // Compare torque
  const torqueComparisons = compareNumericValues(motorcycles.map(m => m.torque_nm));
  
  // Compare top speed
  const speedComparisons = compareNumericValues(motorcycles.map(m => m.top_speed_kph));
  
  // Create mobile cards for each motorcycle
  if (isMobile) {
    return (
      <>
        <ComparisonSectionHeader 
          title="Performance" 
          description="Engine and performance specifications" 
        />
        
        <div className="space-y-6">
          {motorcycles.map((motorcycle, index) => (
            <div key={motorcycle.id} className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-bold mb-4">{motorcycle.make} {motorcycle.model}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Engine</p>
                  <p className={`font-mono font-medium ${getComparisonClass(engineComparisons[index])}`}>
                    {motorcycle.engine_cc} cc
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Horsepower</p>
                  <p className={`font-mono font-medium ${getComparisonClass(horsepowerComparisons[index])}`}>
                    {motorcycle.horsepower_hp} hp
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Torque</p>
                  <p className={`font-mono font-medium ${getComparisonClass(torqueComparisons[index])}`}>
                    {motorcycle.torque_nm} Nm
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Top Speed</p>
                  <p className={`font-mono font-medium ${getComparisonClass(speedComparisons[index])}`}>
                    {motorcycle.top_speed_kph} km/h
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  // Desktop table view
  return (
    <>
      <ComparisonSectionHeader 
        title="Performance" 
        description="Engine and performance specifications" 
      />
      
      <Table className="bg-card/50">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Specification</TableHead>
            {motorcycles.map((motorcycle) => (
              <TableHead key={motorcycle.id}>
                {motorcycle.make} {motorcycle.model}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Engine Size</TableCell>
            {engineComparisons.map((comparison, i) => (
              <TableCell 
                key={`engine-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} cc
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Horsepower</TableCell>
            {horsepowerComparisons.map((comparison, i) => (
              <TableCell 
                key={`hp-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} hp
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Torque</TableCell>
            {torqueComparisons.map((comparison, i) => (
              <TableCell 
                key={`torque-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} Nm
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Top Speed</TableCell>
            {speedComparisons.map((comparison, i) => (
              <TableCell 
                key={`speed-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} km/h
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
